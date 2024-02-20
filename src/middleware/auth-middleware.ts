import type { Context, Next } from "hono";
import { CheckAuth } from "../utils/security/check-auth.ts";

const authorizeNeedPaths = ["/pdf"];

const authMiddleware = async (c: Context, next: Next) => {
  if (authorizeNeedPaths.includes(c.req.path)) {
    const isAuthorized = await CheckAuth(c);

    if (!isAuthorized) {
      return c.json(
        {
          message: "Unauthorized Customer!",
        },
        401,
      );
    }
  }

  await next();
};

export default authMiddleware;
