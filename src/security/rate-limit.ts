// rate-limit.ts
import { store } from "./memory-store.ts";
import type { Context, Next } from "hono";

export async function rateLimit(c: Context, next: Next) {
  const key = "global"; // Örnek olarak global bir anahtar kullanıyoruz.
  store.cleanup(); // Süresi dolmuş istekleri temizle

  if (!store.add(key)) {
    const rateLimit = Number(process.env.RATE_LIMIT) || 10;
    const rateTimeLimit = Number(process.env.RATE_LIMIT_TIME_SECOND) || 10;

    c.status(429);
    c.res.headers.set(
      "x-error-message",
      "Server can only handle " +
        rateLimit +
        " requests per " +
        rateTimeLimit +
        " seconds.",
    );
    return c.text("Too Many Requests", 429);
  }

  // Kapasite aşılmamışsa, sonraki middleware veya handler'ı çalıştır
  return await next();
}
