const router = require("express").Router();
const puppeteer = require("puppeteer");

const access_token = process.env.ACCESS_TOKEN || "my-secret-token";

router.get("/pdf", async (req, res) => {
  const headers = req.headers;
  const targetUrl = headers["x-pdf-url"];
  const token = headers["x-access-token"];

  if (token !== access_token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  if (!targetUrl) {
    return res.status(400).send({ error: "Bad Request" });
  }

  let browser;
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
    console.log("browser launched");

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 60000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=nextdok.pdf");
    res.send(pdf);
  } catch (error) {
    console.error("PDF generation error: ", error);
    res.status(500).send({ error: "Internal Server Error" });
  } finally {
    if (browser) {
      await browser.close();
      console.log("browser closed");
    }
  }
});

module.exports = router;
