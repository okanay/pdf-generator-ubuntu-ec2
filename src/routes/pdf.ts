import { Hono } from "hono";
import { exec } from "child_process";

import * as fs from "fs";
import puppeteer from "puppeteer";

import executablePath from "../helpers/executable-path.ts";
import { validPdfOptions } from "../validation/pdf/";

const pdf = new Hono();

pdf.get("", async (c) => {
  const { targetUrl, options, isValid } = validPdfOptions(c);
  if (!isValid) {
    return c.json({ message: "Invalid request" }, 400);
  }

  const uniqueId = Math.random().toString(36).substring(7);
  const tempPdfPath = `temp_${uniqueId}.pdf`;
  const compressedPdfPath = `compressed_${uniqueId}.pdf`;

  try {
    const isSuccess = await generatePdf(
      targetUrl!,
      options,
      tempPdfPath,
      compressedPdfPath,
    );

    if (!isSuccess) throw new Error("Failed to generate pdf");

    const compressedPdf = fs.readFileSync(compressedPdfPath);

    c.res.headers.set("Content-Type", "application/pdf");
    c.res.headers.set("Custom-File-Name", `${uniqueId}`);
    c.res.headers.set(
      "Content-Disposition",
      "attachment; filename=generated.pdf",
    );

    return c.body(compressedPdf as any);
  } catch (error) {
    console.log(error);
    const errorMessage = "An error occurred while generating pdf";

    c.status(400);
    c.res.headers.set("x-error-message", errorMessage);

    return c.json({ message: errorMessage });
  } finally {
    cleanupFiles([tempPdfPath, compressedPdfPath]);
  }
});

async function generatePdf(
  targetUrl: string,
  options: any,
  tempPdfPath: string,
  compressedPdfPath: string,
) {
  let browser;
  let page;

  const path = executablePath();

  try {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-dev-shm-usage",
      ],
      headless: true,
      ...path,
    });
    page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    );

    await page.goto(targetUrl as string, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdf = await page.pdf({
      printBackground: true,
      ...options,
    });

    fs.writeFileSync(tempPdfPath, pdf);
    await compressPdf(tempPdfPath, compressedPdfPath);

    return true;
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

async function compressPdf(inputPath: string, outputPath: string) {
  const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`;

  await new Promise<void>((resolve, reject) => {
    exec(gsCommand, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`PDF compressed: ${outputPath}`);
      resolve();
    });
  });
}

function cleanupFiles(files: string[]) {
  files.forEach((path) => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      console.log(`Cleaned up file: ${path}`);
    }
  });
}

export default pdf;
