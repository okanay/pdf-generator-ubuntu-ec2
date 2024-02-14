const router = require("express").Router();
const puppeteer = require('puppeteer');

const searchUrl = process.env.SEARCH_URL || "https://nextdok.dev/";

router.get("/pdf", async (req, res) => {

    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(searchUrl, {waitUntil: 'networkidle0'});
        const pdf = await page.pdf({
            format: 'a4',
            printBackground: true
        });

        const buffer = Buffer.from(pdf);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=nextdok.pdf');
        res.send(buffer);
        await browser.close();
    } catch (error) {
        return res.json({error: error.message})
    }
});

module.exports = router;
