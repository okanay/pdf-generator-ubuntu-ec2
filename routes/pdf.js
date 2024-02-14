const searchUrl = process.env.SEARCH_URL || "https://nextdok.dev/";
const router = require("express").Router();

router.get("/pdf", async (req, res) => {
    res.json({ searchUrl });
});

module.exports = router;