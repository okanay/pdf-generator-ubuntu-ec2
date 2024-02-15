const authMiddleware = (req, res, next) => {
  console.log("authMiddleware called");

  const validToken = "my-secret-token";
  const token = req.headers["x-access-token"];

  if (token !== validToken) return res.status(403).send({ error: "Forbidden" });

  return next();
};

module.exports = authMiddleware;
