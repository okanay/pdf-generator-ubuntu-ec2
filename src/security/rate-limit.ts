import { memoryStore } from "./memory-store.ts";
import type { Context } from "hono";

const rateLimit = (options: { windowMs: number; max: number }) => {
  const { windowMs, max } = options;
  const store = memoryStore(windowMs);

  return async (c: Context, next: Function) => {
    const key = c.req.header("x-forwarded-for") || "0.0.0.0";
    const count = store.increment(key);

    if (count > max) {
      return c.json(
        { error: "Too many requests, please try again in 20 seconds" },
        429,
      );
    }

    c.res.headers.set("X-RateLimit-Limit", max.toString());
    c.res.headers.set(
      "X-RateLimit-Remaining",
      Math.max(0, max - count).toString(),
    );

    await next();
  };
};

export default rateLimit;
