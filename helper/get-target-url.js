const getTargetUrl = (req, res) => {
  const url = req.headers["x-pdf-url"];
  if (!url) {
    res.status(400).send({ error: "Bad Request" });
  }
  return url;
};

module.exports = { getTargetUrl };
