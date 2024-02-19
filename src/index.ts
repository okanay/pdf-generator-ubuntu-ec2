import { Hono, type Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import middleware from "./middleware";

import pdfRoute from "./routes/pdf-route.ts";
import pdfTestRoute from "./routes/test-route.ts";
import { rateLimit } from "./security/rate-limit.ts";

const app = new Hono();

app.use(secureHeaders({}));
app.use(middleware);
app.use("/pdf", rateLimit);
app.use("*", cors());
app.use("*", logger());

app.notFound((c) => {
  return c.text("404", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Error", 500);
});

app.route("/pdf", pdfRoute);
app.route("/test", pdfTestRoute);

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
