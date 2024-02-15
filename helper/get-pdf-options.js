const getTargetUrl = (req, res) => {
  const url = req.headers["x-pdf-url"];
  if (!url) {
    res.status(400).send({ error: "Bad Request" });
  }
  return url;
};

const getPdfOptions = (req) => {
  let options = {};
  let format = req.headers["x-size-format"] || "A4";

  if (format === "custom") {
    options.width = req.headers["x-width"];
    options.height = req.headers["x-height"];

    options = {
      width: options.width,
      height: options.height,
    };
  } else {
    options = {
      format: "A4",
    };
  }

  return options;
};

module.exports = { getTargetUrl, getPdfOptions };
