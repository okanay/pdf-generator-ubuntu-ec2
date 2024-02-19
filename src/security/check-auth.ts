import type { Context, Next } from "hono";

const isAuthorized = (c: Context) => {
  const token = c.req.header("x-access-token") || "no-token";
  const secretToken = process.env.SECRET_TOKEN || "no-secret-token";

  return token === secretToken;
};

export { isAuthorized };
