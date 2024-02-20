import type { Context, Next } from "hono";
import { UpdatePageDataInBackground } from "../db/functions/page-data.ts";

const serverPaths = ["/", "/pdf", "/test"];

const notFoundMiddleware = async (c: Context, next: Next) => {
  const path = c.req.path;

  if (!serverPaths.includes(path)) {
    UpdatePageDataInBackground("/not-found");
    return c.json(
      {
        path,
        message: "Not Found!",
      },
      404,
    );
  }

  await next();
};

export default notFoundMiddleware;
