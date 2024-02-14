const router = require("express").Router();
const axios = require('axios');

const EC2_URL = "http://16.171.146.195:8080/pdf";
const LOCAL_URL = "http://localhost:8080/pdf";

router.get("/test", async (req, res) => {
    try {
        const response = await axios.get(LOCAL_URL, {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/pdf'
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');
        res.send(response.data);
    } catch (error) {
        console.error("Hata: ", error);
        res.status(500).send("Sunucuda bir hata oluştu");
    }
});

module.exports = router;
