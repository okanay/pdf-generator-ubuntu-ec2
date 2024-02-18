import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import middleware from "./middleware";
import pdfRoute from "./routes/pdf-route.ts";
import pdfTestRoute from "./routes/test-route.ts";

const app = new Hono();

app.use(middleware);
app.use("*", cors());
app.use("*", logger());

app.route("/pdf", pdfRoute);
app.route("/test", pdfTestRoute);

app.notFound((c) => {
  return c.text("404", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Error", 500);
});

// test.

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
