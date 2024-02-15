const testMiddleware = (req, res, next) => {
  console.log("testMiddleware called");

  if (process.env.PRODUCTION_MODE !== "local")
    return res.status(403).send({ error: "Forbidden" });

  return next();
};

module.exports = testMiddleware;
