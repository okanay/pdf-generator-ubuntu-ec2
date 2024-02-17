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

app.route("/", pdfRoute);
app.route("/", pdfTestRoute)

app.get("/", (c) => {
  return c.json({
    status: "Everything is working well",
  });
});

export default {
  port: process.env.PORT || 8081,
  fetch: app.fetch,
};
