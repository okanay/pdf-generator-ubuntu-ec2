const router = require("express").Router();
const puppeteer = require("puppeteer");
const pdfHelper = require("../helper/get-pdf-options");

router.get("/", async (req, res) => {
  const targetUrl = pdfHelper.getTargetUrl(req, res);
  const pdfOptions = pdfHelper.getPdfOptions(req);

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
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 60000 });

    const pdf = await page.pdf({
      ...pdfOptions,
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=nextdok.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("PDF generation error: ", error);
    res.status(500).send({ error: "Internal Server Error" });
  } finally {
    if (page) {
      await page.close();
      console.log("page closed");
    }
    if (browser) {
      await browser.close();
      console.log("browser closed");
    }
  }
});

module.exports = router;
