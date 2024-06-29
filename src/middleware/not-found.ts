import type { Context, Next } from "hono";

const serverPaths = ["/", "/pdf", "/test"];

const notFound = async (c: Context, next: Next) => {
  if (!serverPaths.includes(c.req.path)) {
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

export default notFound;
