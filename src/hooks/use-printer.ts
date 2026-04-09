import { useState, useEffect, useCallback } from "react";
import { registerPlugin } from "@capacitor/core";

// Definisikan interface agar TypeScript memberikan autocomplete yang cerdas
type connectionType = "none" | "usb" | "bluetooth";
export interface PrinterPlugin {
  autoConnect(): Promise<void>;
  disconnect(): Promise<void>;
  printText(options: { text: string }): Promise<void>;
  openCashDrawer(): Promise<void>; // Sesuai saran sebelumnya
  getStatus(): Promise<{ connected: boolean; type: connectionType }>;
}

const Printer = registerPlugin<PrinterPlugin>("PrinterPlugin");

export const usePrinter = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionType, setConnectionType] = useState<connectionType>("none");
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Fungsi Cek Status berkala atau manual
  const refreshStatus = useCallback(async () => {
    try {
      const status = await Printer.getStatus();
      setIsConnected(status.connected);
      setConnectionType(status.type);
      return status;
    } catch (e) {
      setIsConnected(false);
      return { connected: false, type: "none" };
    }
  }, []);

  // 2. Efek untuk autoConnect saat aplikasi pertama kali dibuka
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // 3. Fungsi Connect
  const connect = async () => {
    setLoading(true);
    try {
      await Printer.autoConnect();
      await refreshStatus();
    } catch (error) {
      console.error("Connect Printer Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. Fungsi Print
  const print = async (text: string) => {
    try {
      await Printer.printText({ text: text });
    } catch (error) {
      console.error("Printer Error: ", error);
      throw error;
    }
  };

  return {
    connect,
    print,
    refreshStatus,
    isConnected,
    connectionType,
    loading,
  };
};
