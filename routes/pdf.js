const router = require("express").Router();
const puppeteer = require('puppeteer');

const searchUrl = process.env.SEARCH_URL || "https://nextdok.dev/";

router.get("/pdf", async (req, res) => {

    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(searchUrl);
        const title = await page.title();
        await browser.close();
        return res.json({title: title})
    }
    catch (error) {
        return res.json({error: error.message})
    }
});

module.exports = router;
