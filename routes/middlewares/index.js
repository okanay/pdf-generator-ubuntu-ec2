const authPaths = ["/pdf"];
const testPaths = ["/test"];

const authMiddleware = require("./auth-middleware");
const testMiddleware = require("./test-middleware");

const middleware = (req, res, next) => {
  if (authPaths.includes(req.path)) {
    return authMiddleware(req, res, next);
  }

  if (testPaths.includes(req.path)) {
    return testMiddleware(req, res, next);
  }
};

module.exports = middleware;
