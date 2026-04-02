import { domToCanvas } from 'modern-screenshot';
import jsPDF from 'jspdf';

const LOGO_URL = "../public/logo.png";

const loadExternalImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const downloadImage = async (element, filename = "export.png") => {
  if (!element) return;

  try {
    const canvas = await domToCanvas(element, { scale: 2 });
    const ctx = canvas.getContext('2d');

    const watermark = await loadExternalImage(LOGO_URL);

    const aspectRatio = watermark.width / watermark.height;
    const w = 200;
    const h = w / aspectRatio;

    const x = (canvas.width * 0.15) - (w / 2) - 40;
    const y = (canvas.height / 2) - (h / 2) - 40;

    ctx.globalAlpha = 0.3;
    ctx.drawImage(watermark, x, y, w, h);
    ctx.globalAlpha = 1.0;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};

export const downloadPDF = async (element, filename = "export.pdf") => {
  if (!element) return;

  try {
    const canvas = await domToCanvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL("image/png");

    const pxToMm = 0.264583;
    const canvasWidthMm = canvas.width * pxToMm / 2;
    const canvasHeightMm = canvas.height * pxToMm / 2;

    const pdf = new jsPDF({
      orientation: canvasWidthMm > canvasHeightMm ? "l" : "p",
      unit: "mm",
      format: [canvasWidthMm, canvasHeightMm]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvasWidthMm, canvasHeightMm);

    const watermark = await loadExternalImage(LOGO_URL);
    const logoWidth = canvasWidthMm * 0.15;
    const logoHeight = (watermark.height * logoWidth) / watermark.width;
    const margin = canvasWidthMm * 0.02;

    pdf.setGState(new pdf.GState({ opacity: 0.3 }));
    pdf.addImage(
      LOGO_URL,
      "PNG",
      (canvasWidthMm * 0.15) - (logoHeight / 2) - margin,
      (canvasHeightMm / 2) - (logoHeight / 2) - margin,
      logoWidth,
      logoHeight
    );
    pdf.setGState(new pdf.GState({ opacity: 1.0 }));

    pdf.save(filename);
  } catch (error) {
    console.error("Failed to download PDF:", error);
  }
};