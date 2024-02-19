import type { Next, Context } from "hono";

import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";
import { isAuthorized } from "../security/check-auth.ts";

const authorizeNeedPaths = ["/pdf"];
const serverPaths = ["/", "/pdf", "/test"];

const middleware = async (c: Context, next: Next) => {
  const path = c.req.path;

  if (!serverPaths.includes(path)) {
    return c.json(
      {
        path,
        message: "Not Found!",
      },
      404,
    );
  }

  UpdatePageDataInBackground(path);

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

  await next();
};

export default middleware;
