import { isValid, z } from "zod";

import type { Context } from "hono";
import type { PDFOptions } from "puppeteer";

const pdfOptionsSchema = z
  .object({
    targetUrl: z.string().url({ message: "Invalid target URL" }).optional(),
    format: z.enum(["a4", "custom"]),
    width: z.string().optional(),
    height: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.format === "custom" && (!data.width || !data.height)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "x-width and x-height headers are required if x-size-format is custom",
        path: ["format"],
      });
    }

    if (!data.targetUrl || data.targetUrl.length === 0) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "x-pdf-url header is required for pdf generation, example: x-pdf-url: https://example.com",
        path: ["targetUrl"],
      });
    }
  });

const pdfValidation = (c: Context) => {
  const headers = {
    targetUrl: c.req.header("x-pdf-url"),
    format: c.req.header("x-size-format") || "a4",
    width: c.req.header("x-width"),
    height: c.req.header("x-height"),
  };

  let options: PDFOptions = { printBackground: true };
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

export default pdfValidation;
