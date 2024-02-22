import type { Context, Next } from "hono";
import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";

const pageDataMiddleware = async (c: Context, next: Next) => {
  if (c.req.method === "GET") {
    UpdatePageDataInBackground(c.req.path);
  }

  await next();
};

export default pageDataMiddleware;
