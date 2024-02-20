import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import {
  pageDataMiddleware,
  authMiddleware,
  notFoundMiddleware,
} from "./middleware";

import { pdfRoute, testRoute } from "./routes/";
import { rateLimit } from "./utils/security/rate-limit.ts";

const app = new Hono();

app.use(secureHeaders({}));
app.use("*", cors());
app.use("*", logger());

app.use(notFoundMiddleware);
app.use(pageDataMiddleware);
app.use(authMiddleware);

app.use("/pdf", rateLimit);

app.route("/pdf", pdfRoute);
app.route("/test", testRoute);

app.get("/", (c) => {
  try {
    return c.json({
      system: "Bun System",
      server: "Hono",
      status: "Everything is working well",
    });
  } catch (error) {
    console.log("pdf-route error : ", error);
    return c.json({ error: "An error occurred" }, 500);
  }
});

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch,
};
