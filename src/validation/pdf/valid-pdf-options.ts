import pdfOptionsSchema from "./schema";
import type { Context } from "hono";
import type { PDFOptions } from "puppeteer";

const validPdfOptions = (c: Context) => {
  const headers = {
    targetUrl: c.req.header("x-pdf-url"),
    format: c.req.header("x-size-format") || "a4",
    width: c.req.header("x-width"),
    height: c.req.header("x-height"),
  };

  let options: PDFOptions = {};
  const result = pdfOptionsSchema.safeParse(headers);

  if (!result.success)
    return {
      isValid: false,
      errorMessage: result.error.issues[0].message,
      targetUrl: "",
      options: options,
      sendError: (c: Context) => {
        c.status(400);
        c.res.headers.set("x-error-message", result.error.issues[0].message);
        return c.json({ message: result.error.issues[0].message });
      },
    };

  const { format, targetUrl, width, height } = result.data;

  if (format === "a4") {
    options.format = "a4";
  } else if (format === "custom") {
    options.width = width;
    options.height = height;
  }

  return {
    options,
    targetUrl: targetUrl,
    isValid: true,
  };
};

export default validPdfOptions;
