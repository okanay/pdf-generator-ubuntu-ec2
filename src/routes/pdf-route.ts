import { Hono } from "hono";
import pdfValidation from "../validation/pdf-validation";
import puppeteer from "puppeteer";

const pdfRoute = new Hono();

pdfRoute.get("/", async (c) => {
  const { targetUrl, options, isValid, errorMessages } = pdfValidation(c);

  if (!isValid) {
    c.status(400);
    c.res.headers.set("Content-Type", "application/json");
    c.res.headers.set("error-messages", errorMessages || "Bad request");
    return c.json({ message: "Bad request" });
  }

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
    console.log("pdf-route error : ", error);

    const errorMessage = "An error occurred while generating pdf";

    c.status(500);
    c.res.headers.set("error-messages", errorMessage);

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
