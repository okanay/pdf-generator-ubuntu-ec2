import puppeteer from "puppeteer";
import { validPdfOptions } from "../validation/pdf/";

import { Hono } from "hono";
const pdfRoute = new Hono();

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
      ],
    });

    page = await browser.newPage();

    await page.goto(targetUrl as string, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdf = await page.pdf({ ...options });

    c.res.headers.set("Content-Type", "application/pdf");
    c.res.headers.set(
      "Content-Disposition",
      "attachment; filename=generated.pdf",
    );

    return c.body(pdf as any);
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
