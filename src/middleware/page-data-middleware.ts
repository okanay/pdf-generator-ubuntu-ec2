import type { Context, Next } from "hono";
import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";

const pageDataMiddleware = async (c: Context, next: Next) => {
  const path = c.req.path;

  if (c.req.method === "GET") {
    UpdatePageDataInBackground(path);
  }

  await next();
};

export default pageDataMiddleware;
