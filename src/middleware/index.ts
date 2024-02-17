import type { Next, Context } from "hono";

const authorizeNeedPaths = ["/pdf"];

const isAuthorized = (c: Context) => {
  const token = c.req.header("x-access-token") || "no-token";
  const secretToken = process.env.SECRET_TOKEN || "no-secret-token";

  return token === secretToken;
};

const middleware = async (c: Context, next: Next) => {
  if (authorizeNeedPaths.includes(c.req.path)) {
    if (!isAuthorized(c)) {
      return c.json(
        {
          message: "Unauthorized custom",
        },
        401,
      );
    }
  }

  await next();
};

export default middleware;
