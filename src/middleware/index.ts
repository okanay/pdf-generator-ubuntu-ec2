import type { Next, Context } from "hono";

import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";

const authorizeNeedPaths = ["/pdf"];

const isAuthorized = (c: Context) => {
  const token = c.req.header("x-access-token") || "no-token";
  const secretToken = process.env.SECRET_TOKEN || "no-secret-token";

  return token === secretToken;
};

const middleware = async (c: Context, next: Next) => {
  const path = c.req.path;

  if (authorizeNeedPaths.includes(path)) {
    if (!isAuthorized(c)) {
      return c.json(
        {
          message: "Unauthorized Customer!",
        },
        401,
      );
    }
  }

  // This is a background job that will not block the request.
  // It will update the page data in the database without waiting for the response.
  UpdatePageDataInBackground(path);

  await next();
};

export default middleware;
