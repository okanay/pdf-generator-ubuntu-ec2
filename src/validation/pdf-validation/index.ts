import { z } from "zod";

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
        message: "width and height are required for custom format",
        path: ["format"],
      });
    }

    if (!data.targetUrl || data.targetUrl.length === 0) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "targetUrl is required",
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

  try {
    let options: PDFOptions = { printBackground: true };
    const result = pdfOptionsSchema.parse(headers);

    if (result.format === "a4") {
      options.format = "a4";
    } else if (result.format === "custom") {
      options.width = result.width;
      options.height = result.height;
    }

    return {
      isValid: true,
      options,
      targetUrl: result.targetUrl,
      errorMessages: undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        options: {},
        targetUrl: headers.targetUrl,
        errorMessages: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      isValid: false,
      options: {},
      targetUrl: headers.targetUrl,
      errorMessages: "An unexpected error occurred",
    };
  }
};

export default pdfValidation;
