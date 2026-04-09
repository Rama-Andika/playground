import ButtonIconPrint from "@/components/button/icon/ButtonIconPrint";
import { DOCUMENT_STATUS } from "@/enums/document-status.enum";
import { companyQueries } from "@/queries/company.queries";
import { salesTakingQueries } from "@/queries/sales-taking.queries";
import { strukKasirQueries } from "@/queries/struk-kasir.queries";
import { formatNumberWithDecimals } from "@/utils/format-number";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useImperativeHandle, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Capacitor, registerPlugin } from "@capacitor/core";
import type { SalesTakingPlaygroundView } from "@/interfaces/sales-taking.interface";
import type { CompanyView } from "@/interfaces/company.interface";
import { usePrinter } from "@/hooks/use-printer";
import { ESC_CMDS, justifyText, line, wordWrap } from "@/utils/escpos";

// Registrasi Plugin Printer
const PrinterPlugin = registerPlugin<any>("PrinterPlugin");

const locationId = import.meta.env.VITE_LOCATION_ID as string;

export interface SmallInvoiceRef {
  print: () => void;
}

export interface Props {
  id: string;
  hideButton?: boolean;
  ref: React.Ref<SmallInvoiceRef | null>;
}

const generateEscPosText = (
  sales: SalesTakingPlaygroundView | undefined,
  company: CompanyView | undefined,
  headers: string[] | undefined,
  footers: string[] | undefined,
  paperWidth: "58mm" | "80mm" = "80mm", // Tambahkan parameter ukuran kertas
) => {
  const customerName =
    sales?.customerName !== "PUBLIC"
      ? sales?.customerName
      : sales.parentName
        ? sales.parentName
        : sales.customerName;
  // Tentukan jumlah karakter maksimal berdasarkan ukuran kertas
  // const is58mm = paperWidth === "58mm";
  const maxLength = paperWidth === "58mm" ? 31 : 42;

  let res = ESC_CMDS.INIT; // Initialize

  // --- 1. HEADER ---
  res += ESC_CMDS.ALIGN_CTR + ESC_CMDS.SIZE_DBL + ESC_CMDS.BOLD_ON;
  // Nama toko dibungkus jika sangat panjang
  wordWrap(company?.name?.toUpperCase() || "TOKO", maxLength).forEach(
    (l) => (res += l.trim() + "\n"),
  );

  res += ESC_CMDS.TXT_NORMAL + ESC_CMDS.ALIGN_CTR;
  res += (company?.address || "") + "\n";
  res += (company?.phone ? `Telp: ${company.phone}` : "") + "\n";

  if (headers && headers.length > 0) {
    headers.forEach((h) => (res += h.trim() + "\n"));
  }
  res += "\n";

  // --- 2. TRANSACTION INFO ---
  res += ESC_CMDS.ALIGN_LT;
  const dateStr = dayjs(sales?.date).format("DD/MM/YY HH:mm");

  // Jika 58mm, pecah No dan Date jadi dua baris agar tidak sesak

  res += `No   : ${sales?.number}\n`;
  res += `Date : ${dateStr}\n`;
  res += `Cust : ${customerName?.substring(0, maxLength - 7) || "Public"}\n`;
  res += line(maxLength) + "\n";

  // --- 3. ITEMS ---
  sales?.salesTakingDetails.forEach((detail) => {
    // Nama item (Bisa multi-baris jika panjang)
    const wrappedName = wordWrap(
      detail.itemMasterName.toUpperCase(),
      maxLength,
    );
    wrappedName.forEach((l) => (res += l.trim() + "\n"));

    // Qty & Harga
    const qtyPrice = `  ${detail.qty} x ${formatNumberWithDecimals(detail.price)}`;
    const total = formatNumberWithDecimals(detail.qty * detail.price);

    // Jika qtyPrice + total terlalu panjang (di 58mm), taruh total di baris baru
    if (qtyPrice.length + total.length + 1 > maxLength) {
      res += qtyPrice + "\n" + justifyText("", total, maxLength) + "\n";
    } else {
      res += justifyText(qtyPrice, total, maxLength) + "\n";
    }

    if (detail.discountItem > 0) {
      res +=
        justifyText(
          "  (Disc)",
          `-${formatNumberWithDecimals(detail.discountItem)}`,
          maxLength,
        ) + "\n";
    }
  });

  // --- 4. TOTALS ---
  res += line(maxLength) + "\n";
  res += ESC_CMDS.BOLD_ON;

  const subTotal = sales?.salesTakingDetails.reduce(
    (total, detail) => total + detail.total,
    0,
  );
  // Gunakan justify sederhana untuk total
  res +=
    justifyText(
      "GRAND TOTAL",
      formatNumberWithDecimals(subTotal ?? 0),
      maxLength,
    ) + "\n";
  res += ESC_CMDS.BOLD_OFF;

  res += line(maxLength) + "\n";

  if ((sales?.payment?.costCardAmount ?? 0) > 0) {
    res +=
      justifyText(
        "Card Surcharge",
        formatNumberWithDecimals(sales?.payment.costCardAmount ?? 0),
        maxLength,
      ) + "\n";
  }

  res +=
    justifyText(
      sales?.payment?.paymentMethod ?? "",
      formatNumberWithDecimals(sales?.payment.amount ?? 0),
      maxLength,
    ) + "\n";

  res +=
    justifyText(
      "Change",
      formatNumberWithDecimals(sales?.returnPayment?.amount ?? 0),
      maxLength,
    ) + "\n";
  res += line(maxLength) + "\n\n";

  // --- 5. FOOTER ---
  res += ESC_CMDS.ALIGN_CTR;
  if (footers && footers.length > 0) {
    footers.forEach((f) => (res += f.trim() + "\n"));
  } else {
    res += "TERIMA KASIH\n";
  }

  res = res.trimEnd();

  res += ESC_CMDS.CUT; // Cut Function B

  return res;
};

const SmallInvoice = ({ id, hideButton = false, ref }: Props) => {
  const content = useRef<HTMLDivElement>(null);
  const { print, connect, loading } = usePrinter();
  // Deteksi apakah aplikasi berjalan di Native (Android/iOS)
  const isNative = Capacitor.isNativePlatform();

  // ===============
  // =====QUERY=====
  // ===============
  const { data: company } = useQuery(companyQueries.company());
  const { data: sales, refetch } = useQuery(
    salesTakingQueries.salesPlaygroundByNumber(id, {
      enabled: false,
    }),
  );
  const { data: strukKasir } = useQuery(
    strukKasirQueries.byLocation(locationId),
  );

  const subTotal = sales?.salesTakingDetails.reduce(
    (total, detail) => total + detail.total,
    0,
  );

  const headers = strukKasir?.header.split("#");
  const footers = strukKasir?.footer.split("#");

  // PRINT UNTUK WEB (Browser PC)
  const handlePrintWeb = useReactToPrint({
    contentRef: content,
    documentTitle: `invoice-${sales?.number}`,
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }
    body {
      margin: 0;
      -webkit-print-color-adjust: exact;
    }
    #print-invoice {
      width: 72mm;
      margin: 0 auto;
      padding: 3mm;
      box-sizing: border-box;
    }
  `,
  });

  // PRINT UNTUK ANDROID (ESC/POS via Capacitor)
  const handlePrintEscPos = useCallback(async () => {
    if (!content.current) return;

    try {
      const checkPerm = await PrinterPlugin.checkPermissions();
      if (checkPerm.bluetooth !== "granted") {
        await PrinterPlugin.requestPermissions({ permissions: ["bluetooth"] });
      }

      const result = await refetch();

      const receiptText = generateEscPosText(
        result.data,
        company,
        headers,
        footers,
        "58mm",
      );

      await connect();
      await print(receiptText);
    } catch (error: any) {
      alert("Printer Error " + error.message);
    }
  }, [sales, company, headers, footers, subTotal]);

  // Handler utama yang memilih metode print
  const executePrint = useCallback(async () => {
    if (isNative) {
      handlePrintEscPos();
    } else {
      handlePrintWeb();
    }
  }, [isNative, handlePrintEscPos, handlePrintWeb]);

  // Expose fungsi print ke parent component
  useImperativeHandle(ref, () => ({
    print: async () => {
      if (!isNative) {
        const result = await refetch();
        if (!result.data) return;

        // Beri sedikit delay agar React selesai re-render data terbaru
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await executePrint();
    },
  }));

  return (
    <>
      {!hideButton && sales?.docStatus === DOCUMENT_STATUS.APPROVED && (
        <ButtonIconPrint onClick={executePrint} disabled={loading} />
      )}

      <div
        ref={content}
        id="print-invoice"
        className="w-[72mm] font-mono bg-white text-black p-1"
        style={{ color: "black", backgroundColor: "white" }} // Paksa warna hitam putih
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[14px] font-bold">{company?.name}</h1>
          <p className="text-[10px]">{company?.address}</p>
          <p className="text-[10px]">Telp: {company?.phone}</p>
        </div>

        <div className="flex flex-col items-center text-center text-[10px] mt-2">
          {headers?.map((header, index) => (
            <p key={index}>{header}</p>
          ))}
        </div>

        <div className="mt-2">
          <div className="flex flex-col">
            <h2 className="text-[12px] font-bold border-b border-black pb-1 mb-1">
              INVOICE
            </h2>
            <div className="flex gap-1 text-[10px]">
              <p className="w-16">No</p>
              <p>:</p>
              <p>{sales?.number}</p>
            </div>
            <div className="flex gap-1 text-[10px]">
              <p className="w-16">Date</p>
              <p>:</p>
              <p>
                {sales?.date
                  ? dayjs(sales.date).format("DD-MM-YYYY HH:mm")
                  : ""}
              </p>
            </div>
            <div className="flex gap-1 text-[10px]">
              <p className="w-16">Customer</p>
              <p>:</p>
              <p>{sales?.customerName}</p>
            </div>
          </div>

          <div className="border-b border-dotted w-full border-black my-2"></div>

          <div className="flex flex-col text-[10px] gap-2">
            {sales?.salesTakingDetails.map((detail) => (
              <div key={detail.id} className="flex flex-col">
                <p className="wrap-break-word">{detail.itemMasterName}</p>
                <div className="flex justify-between">
                  <p>
                    {detail.qty} x {formatNumberWithDecimals(detail.price)}
                  </p>
                  <p>{formatNumberWithDecimals(detail.qty * detail.price)}</p>
                </div>
                {detail.discountItem > 0 && (
                  <div className="flex justify-end gap-1 text-red-600">
                    <p>
                      Disc (-{formatNumberWithDecimals(detail.discountItem)})
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-b border-dotted w-full border-black my-2"></div>

          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between font-bold">
              <p>GRAND TOTAL :</p>
              <p>{formatNumberWithDecimals(subTotal ?? 0)}</p>
            </div>
          </div>

          <div className="border-b border-dotted w-full border-black my-2"></div>

          <div className="flex flex-col gap-1 text-[10px]">
            {(sales?.payment?.costCardAmount ?? 0) > 0 && (
              <div className="flex justify-between font-bold">
                <p>Card Surcharge :</p>
                <p>
                  {formatNumberWithDecimals(sales?.payment.costCardAmount ?? 0)}
                </p>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <p>{sales?.payment.paymentMethod} :</p>
              <p>{formatNumberWithDecimals(sales?.payment.amount ?? 0)}</p>
            </div>

            <div className="flex justify-between font-bold">
              <p>Change :</p>
              <p>
                {formatNumberWithDecimals(sales?.returnPayment.amount ?? 0)}
              </p>
            </div>
          </div>

          <div className="border-b border-dotted w-full border-black my-2"></div>

          <div className="flex flex-col items-center text-center text-[10px] mt-2 mb-8">
            {footers?.map((footer, index) => (
              <p key={index}>{footer}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SmallInvoice;
