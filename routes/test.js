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
        "x-pdf-url":
          "https://resetyourself.com.tr/panel/pdf/summary/index.php?key=b3abdd1e-1503-6cc8-8c6e-4c32dea1f769",
        "x-access-token": "7c73c3f9afc53cd4b5f2c34e7ad0dfce",
        "x-size-format": "custom",
        "x-width": "1000",
        "x-height": "1000",
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
