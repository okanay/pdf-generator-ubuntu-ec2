const router = require("express").Router();
const axios = require("axios");

const URL =
  "http://ec2-16-171-146-195.eu-north-1.compute.amazonaws.com:8080/pdf";
// const URL = "http://localhost:8080/pdf";

router.get("/test", async (req, res) => {
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
