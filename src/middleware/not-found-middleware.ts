import type { Context, Next } from "hono";
import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";

const serverPaths = ["/", "/pdf", "/test"];

const notFoundMiddleware = async (c: Context, next: Next) => {
  if (!serverPaths.includes(c.req.path)) {
    UpdatePageDataInBackground("/not-found");
    return c.json(
      {
        path: c.req.path,
        message: "Not Found!",
      },
      404,
    );
  }

  await next();
};

export default notFoundMiddleware;
