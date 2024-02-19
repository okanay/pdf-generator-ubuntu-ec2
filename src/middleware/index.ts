import type { Next, Context } from "hono";

import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";
import checkAuth from "../security/check-auth.ts";

const authorizeNeedPaths = ["/pdf"];

const middleware = async (c: Context, next: Next) => {
  checkAuth(c, authorizeNeedPaths);
  UpdatePageDataInBackground(c.req.path);

  if (c.req.path === "/pdf" || c.res.status === 200) {
    console.log(c.res.status);
  }

  await next();
};

export default middleware;
