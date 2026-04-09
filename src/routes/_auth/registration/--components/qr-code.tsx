import QRCodeGenerator from "@/components/qr-code/qr-code-generator";
import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";

const QrCode = ({ value }: { value: string }) => {
  const content = useRef(null);

  const handlePrintWeb = useReactToPrint({
    contentRef: content,
    documentTitle: "qr-code",
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 5px;
      }
      body {
        margin: 5px;
        padding: 0;
      }
    `,
  });

  const handlePrintEscPos = useCallback(async () => {
    if (!content.current) return;

    // Render dengan html2canvas
    const canvas = await html2canvas(content.current, {
      scale: 2,
      backgroundColor: "#fff",
    } as any);

    // 🎯 Paksa resize ke 576px (standar printer ESC/POS 80mm = 576 dots)
    // 384 = 58 mm
    const targetWidth = 576;
    const scaleFactor = targetWidth / canvas.width;
    const targetHeight = Math.floor(canvas.height * scaleFactor);

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;

    const ctx = resizedCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
    }

    const imgData = resizedCanvas.toDataURL("image/png");

    // kirim ke WebView Android
    const rnWebView = (window as any).ReactNativeWebView;
    if (rnWebView) {
      rnWebView.postMessage(
        JSON.stringify({ type: "PRINT_QR_CODE", payload: imgData }),
      );
    } else {
      alert("ESC/POS service tidak terdeteksi. Coba print di PC/laptop.");
    }
  }, []);

  const isAndroidWebView =
    typeof window !== "undefined" && !!(window as any).ReactNativeWebView;

  return (
    <>
      <Button
        size={"sm"}
        variant="outline"
        className="whitespace-nowrap"
        onClick={() => {
          if (isAndroidWebView) {
            handlePrintEscPos();
          } else {
            handlePrintWeb();
          }
        }}
      >
        Print Qr Code
      </Button>
      <div ref={content} id="print-qr-code">
        <QRCodeGenerator value={value} />
      </div>
    </>
  );
};

export default QrCode;
