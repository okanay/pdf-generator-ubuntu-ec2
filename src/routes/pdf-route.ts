import puppeteer from "puppeteer";
import { validPdfOptions } from "../validation/pdf/";

import { Hono } from "hono";
import * as fs from "fs";
import {exec} from "child_process";
const pdfRoute = new Hono();

function delay(time : number) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}


pdfRoute.get("", async (c) => {
  const { targetUrl, options, isValid, sendError } = validPdfOptions(c);
  if (!isValid) return sendError!(c);

  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: true,
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
    });

    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

    await page.goto(targetUrl as string, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdf = await page.pdf({
      printBackground: true,
      ...options,
    });

    const tempPdfPath = 'temp.pdf';
    fs.writeFileSync(tempPdfPath, pdf);

    const compressedPdfPath = 'compressed_output.pdf';
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${compressedPdfPath} ${tempPdfPath}`;

    await new Promise<void>((resolve, reject) => {
      exec(gsCommand, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
          return;
        }
        console.log(`PDF sıkıştırıldı: ${compressedPdfPath}`);
        resolve(stdout as any);
      });
    });

    const compressedPdf = fs.readFileSync(compressedPdfPath);

    c.res.headers.set("Content-Type", "application/pdf");
    c.res.headers.set(
      "Content-Disposition",
      "attachment; filename=generated.pdf",
    );

    return c.body(compressedPdf as any);
  } catch (error) {
    const errorMessage = "An error occurred while generating pdf";

    c.status(400);
    c.res.headers.set("x-error-message", errorMessage);

    return c.json({ message: errorMessage });
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
});

export default pdfRoute;
