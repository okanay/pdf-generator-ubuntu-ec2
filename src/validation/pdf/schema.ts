import { z } from "zod";

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

export default pdfOptionsSchema;
