import { PDFDocument } from "pdf-lib";
import multer from "multer";

const upload = multer();

export default async function handler(req, res) {
  upload.array("files")(req, {}, async () => {
    const pdfFinal = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const pages = await pdfFinal.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => pdfFinal.addPage(p));
    }

    const bytes = await pdfFinal.save();
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(bytes));
  });
}

