import type { Context } from "hono";

const checkAuth = (c: Context, paths: string[]) => {
  const isAuthorized = (c: Context) => {
    const token = c.req.header("x-access-token") || "no-token";
    const secretToken = process.env.SECRET_TOKEN || "no-secret-token";

    return token === secretToken;
  };

  if (paths.includes(c.req.path)) {
    if (!isAuthorized(c)) {
      return c.json(
        {
          message: "Unauthorized Customer!",
        },
        401,
      );
    }
  }
};

export default checkAuth;
