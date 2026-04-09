package com.oxysystemplayground.com;

import android.Manifest;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.*;
import android.os.Build;

import androidx.annotation.RequiresPermission;
import androidx.core.content.ContextCompat;

import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(
        name = "PrinterPlugin",
        permissions = {
                @Permission(
                        strings = {
                                Manifest.permission.BLUETOOTH,
                                Manifest.permission.BLUETOOTH_ADMIN,
                                Manifest.permission.BLUETOOTH_SCAN,
                                Manifest.permission.BLUETOOTH_CONNECT,
                                Manifest.permission.ACCESS_FINE_LOCATION
                        },
                        alias = "bluetooth"
                )
        }
)
public class PrinterPlugin extends Plugin {

    private static final String TAG = "PrinterPlugin";
    private static final String ACTION_USB_PERMISSION = "com.oxysystemplayground.com.USB_PERMISSION";
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static final byte[] ESC_INIT = new byte[]{0x1B, 0x40};
    private static final byte[] ESC_SET_TABLE = new byte[]{0x1B, 0x74, 0x10};
    private final ExecutorService printQueue = Executors.newSingleThreadExecutor();
    private BluetoothSocket bluetoothSocket;
    private OutputStream btOutputStream;
    private UsbDeviceConnection usbConnection;
    private UsbEndpoint usbEndpoint;
    private PluginCall savedCall;

    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {

            String action = intent.getAction();
            if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(action)) {
                UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                if (device != null && usbConnection != null) {
                    // Jika yang dicabut adalah printer kita, bersihkan
                    cleanupConnections();
                }
            }

            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (device != null && savedCall != null) {
                            connectUsbLogic(device, savedCall);
                            savedCall = null;
                        }
                    } else {
                        if (savedCall != null) savedCall.reject("Izin USB ditolak oleh pengguna");
                    }
                }
            }
        }
    };

    @Override
    public void load() {
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getContext().registerReceiver(usbReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            ContextCompat.registerReceiver(getContext(), usbReceiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED);
        }
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (printQueue != null && !printQueue.isShutdown()) {
            printQueue.shutdownNow();
        }

        try {
            getContext().unregisterReceiver(usbReceiver);
        } catch (IllegalArgumentException ignored) { }
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        try {
            if (btOutputStream != null) btOutputStream.close();
            if (bluetoothSocket != null) bluetoothSocket.close();
            if (usbConnection != null) usbConnection.close();

            btOutputStream = null;
            bluetoothSocket = null;
            usbConnection = null;
            usbEndpoint = null;
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    @PluginMethod
    public void autoConnect(PluginCall call) {
        if (usbConnection != null || (bluetoothSocket != null && bluetoothSocket.isConnected())) {
            call.resolve();
            return;
        }

        if (bluetoothSocket != null && bluetoothSocket.isConnected()) {
            try {
                btOutputStream.write(ESC_INIT); // ESC @ (Initialize)
                btOutputStream.flush();
                call.resolve();
                return;
            } catch (IOException e) {
                // Jika gagal, berarti socket "stale", bersihkan
                cleanupConnections();
            }
        }

        if (savedCall != null) {
            call.reject("Permintaan koneksi sebelumnya sedang diproses. Mohon tunggu.");
            return;
        }
        // 1. Cek USB
        try {
            UsbDevice usbDevice = findUsbPrinter();
            if (usbDevice != null) {
                UsbManager manager = (UsbManager) getContext().getSystemService(Context.USB_SERVICE);
                if (manager.hasPermission(usbDevice)) {
                    connectUsbLogic(usbDevice, call);
                } else {
                    savedCall = call;
                    int flags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ? PendingIntent.FLAG_MUTABLE : 0;
                    PendingIntent permissionIntent = PendingIntent.getBroadcast(getContext(), 0, new Intent(ACTION_USB_PERMISSION), flags);
                    manager.requestPermission(usbDevice, permissionIntent);
                }
                return;
            }
        } catch (Exception e) {
            call.reject("Error USB: " + e.getMessage());
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (getPermissionState("bluetooth") != PermissionState.GRANTED) {
                requestPermissionForAlias("bluetooth", call, "btPermCallback");
                return;
            }
        } else {
            // Untuk Android 11 kebawah, kita cukup pastikan izin lokasi granted
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("bluetooth", call, "btPermCallback");
                return;
            }
        }
        attemptBluetoothConnect(call);

//        // 2. Cek Bluetooth
//        if (getPermissionState("bluetooth") != PermissionState.GRANTED) {
//            requestPermissionForAlias("bluetooth", call, "btPermCallback");
//        } else {
//            attemptBluetoothConnect(call);
//        }
    }



    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    @PermissionCallback
    private void btPermCallback(PluginCall call) {
        if (getPermissionState("bluetooth") == PermissionState.GRANTED) {
            attemptBluetoothConnect(call);
        } else {
            call.reject("Izin Bluetooth diperlukan");
        }
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    private void attemptBluetoothConnect(PluginCall call) {
        try {
            BluetoothDevice btDevice = findBluetoothPrinter();
            if (btDevice != null) {
                connectBluetoothLogic(btDevice, call);
            } else {
                call.reject("Printer tidak ditemukan (USB/BT)");
            }
        } catch (SecurityException e) {
            // Menangkap error jika izin sistem tiba-tiba dicabut/tidak valid
            call.reject("Akses sistem ditolak: " + e.getMessage());
        } catch (Exception e) {
            call.reject("Kesalahan tak terduga: " + e.getMessage());
        }
    }

    @PluginMethod
    public void printText(PluginCall call) {
        printQueue.execute(() -> {
            String text = call.getString("text");
            if (text == null) {
                call.reject("Teks kosong");
                return;
            }

            try {
                // 1. Inisialisasi Printer & Set Character Code Table ke WPC1252 (Latin/Simbol umum)
                // ESC t n (n=16 atau 0x10 biasanya untuk WPC1252)
                byte[] initPrinter = ESC_INIT; // ESC @ (Initialize)
                byte[] setTable = ESC_SET_TABLE; // ESC t 16

                // 2. Encode teks menggunakan "CP1252" agar match dengan tabel printer
                // Ini mendukung karakter Latin, Euro, dan simbol umum lainnya.
                byte[] textData = text.getBytes("CP1252");

                if (btOutputStream != null) {
                    try {
                        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                        buffer.write(initPrinter);
                        buffer.write(setTable);
                        buffer.write(textData);

                        btOutputStream.write(buffer.toByteArray());
                        btOutputStream.flush();
                        call.resolve();
                    } catch (IOException e) {
                        cleanupConnections(); // Bersihkan koneksi yang rusak
                        call.reject("Printer terputus, silakan hubungkan kembali.");
                    }
                } else if (usbConnection != null && usbEndpoint != null) {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    outputStream.write(initPrinter);
                    outputStream.write(setTable);
                    outputStream.write(textData);

                    int result = usbConnection.bulkTransfer(usbEndpoint, outputStream.toByteArray(), outputStream.size(), 5000);
                    if (result < 0) {
                        cleanupConnections();
                        call.reject("Gagal transfer USB");
                    } else {
                        call.resolve();
                    }
                } else {
                    call.reject("Printer offline");
                }
            } catch (Exception e) {
                call.reject("Gagal mencetak teks: " + e.getMessage());
            }

        });

    }

    private void connectUsbLogic(UsbDevice device, PluginCall call) {
        UsbManager manager = (UsbManager) getContext().getSystemService(Context.USB_SERVICE);
        UsbDeviceConnection connection = manager.openDevice(device);

        if (connection != null) {
            // Cari interface printer secara dinamis, jangan hardcode index 0
            for (int i = 0; i < device.getInterfaceCount(); i++) {
                UsbInterface intf = device.getInterface(i);
                if (intf.getInterfaceClass() == UsbConstants.USB_CLASS_PRINTER) {
                    if (connection.claimInterface(intf, true)) {
                        usbConnection = connection;
                        // Cari endpoint OUT (kirim data)
                        for (int j = 0; j < intf.getEndpointCount(); j++) {
                            UsbEndpoint ep = intf.getEndpoint(j);
                            if (ep.getDirection() == UsbConstants.USB_DIR_OUT) {
                                usbEndpoint = ep;
                                call.resolve();
                                return;
                            }
                        }
                    }
                }
            }

            connection.close();
        }
        call.reject("Printer USB ditemukan tapi interface tidak dapat diakses.");
    }

    private void connectBluetoothLogic(BluetoothDevice device, PluginCall call) {
        // Masukkan proses koneksi ke antrean agar tidak tumpang tindih dengan perintah cetak
        printQueue.execute(() -> {
            try {
                try {
                    bluetoothSocket = device.createRfcommSocketToServiceRecord(SPP_UUID);
                    bluetoothSocket.connect();
                } catch (IOException e) {
                    // Fallback ke Insecure Socket jika Secure gagal
                    bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(SPP_UUID);
                    bluetoothSocket.connect();
                }

                Thread.sleep(200);
                btOutputStream = bluetoothSocket.getOutputStream();
                btOutputStream.write(ESC_INIT);
                btOutputStream.flush();
                call.resolve();
            } catch (Exception e) {
                cleanupConnections();
                call.reject("Gagal terhubung: " + e.getMessage());
            }
        });
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    private BluetoothDevice findBluetoothPrinter() throws SecurityException {
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        if (adapter == null || !adapter.isEnabled()) return null;
        Set<BluetoothDevice> devices = adapter.getBondedDevices();
        for (BluetoothDevice d : devices) {
            if (d.getBluetoothClass() != null &&
                    d.getBluetoothClass().getMajorDeviceClass() == android.bluetooth.BluetoothClass.Device.Major.IMAGING) {
                return d;
            }

            String name = d.getName();
            if (name != null) {
                String lowerName = name.toLowerCase();
                if (lowerName.contains("print") || lowerName.contains("pos") || lowerName.contains("mpt")) return d;
            }
        }
        return null;
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject ret = new JSObject();
        boolean isConnected = (usbConnection != null) || (bluetoothSocket != null && bluetoothSocket.isConnected());

        // Kamu juga bisa menambahkan tipe koneksi jika diperlukan
        String type = "none";
        if (usbConnection != null) type = "usb";
        else if (bluetoothSocket != null && bluetoothSocket.isConnected()) type = "bluetooth";

        ret.put("connected", isConnected);
        ret.put("type", type);

        call.resolve(ret);
    }

    private UsbDevice findUsbPrinter() {
        UsbManager manager = (UsbManager) getContext().getSystemService(Context.USB_SERVICE);
        for (UsbDevice d : manager.getDeviceList().values()) {
            int deviceClass = d.getDeviceClass();
            if (deviceClass == UsbConstants.USB_CLASS_PRINTER || deviceClass == 255 || deviceClass == 0){
                for (int i=0; i<d.getInterfaceCount(); i++) {
                    int interfaceClass = d.getInterface(i).getInterfaceClass();
                    // Jika interface-nya Printer (7) ATAU Vendor Specific (255)
                    if (interfaceClass == UsbConstants.USB_CLASS_PRINTER || interfaceClass == 255) {
                        return d;
                    }
                }
            }
        }
        return null;
    }

    private void cleanupConnections() {
        try {
            if (btOutputStream != null) btOutputStream.close();
            if (bluetoothSocket != null) bluetoothSocket.close();
            if (usbConnection != null) usbConnection.close();
        } catch (Exception ignored) {}

        btOutputStream = null;
        bluetoothSocket = null;
        usbConnection = null;
        usbEndpoint = null;
    }
}
