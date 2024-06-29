import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { auth, notFound } from "./middleware";

import { pdf, testRoute } from "./routes/";

const app = new Hono();

app.use(secureHeaders({}));
app.use("*", cors());
app.use("*", logger());

app.use(notFound);
app.use(auth);

app.route("/pdf", pdf);
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
