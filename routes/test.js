const express = require("express");
const router = express.Router();
const axios = require("axios");

// const URL = "http://localhost:8080/pdf";

const ipAddress = process.env.IP_ADDRESS;
const URL = `http://${ipAddress}:8080/pdf`;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(URL, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
        "x-pdf-url": "https://www.nextdok.dev/docs/description",
        "x-access-token": "my-secret-token",
      },
    });

    await res.setHeader("Content-Type", "application/pdf");
    await res.setHeader(
      "Content-Disposition",
      "attachment; filename=downloaded.pdf",
    );
    await res.send(response.data);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
