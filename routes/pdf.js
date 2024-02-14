const router = require("express").Router();
const puppeteer = require("puppeteer");

const access_token = process.env.ACCESS_TOKEN || "my-secret-token";

router.get("/pdf", async (req, res) => {
  const headers = req.headers;

  const targetUrl = headers["x-pdf-url"];
  const token = headers["x-access-token"];

  if (token !== access_token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!targetUrl) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    console.log("browser launch");

    const page = await browser.newPage();
    console.log("new page created");

    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    console.log("page loaded");

    const pdf = await page.pdf({
      viewport: {
        width: 1920,
        height: 1080,
      },
      format: "a4",
      printBackground: true,
    });
    console.log("pdf created");

    const buffer = Buffer.from(pdf);
    console.log("buffer created");

    await res.setHeader("Content-Type", "application/pdf");
    await res.setHeader(
      "Content-Disposition",
      "attachment; filename=nextdok.pdf",
    );
    await res.send(buffer);
    console.log("response pdf sent to client");

    await browser.close();
    console.log("browser closed");
  } catch (error) {
    console.log("error: ", error);
    return res.json({
      error: error.message,
      status: error.response.status,
      log: error,
    });
  }
});

module.exports = router;
