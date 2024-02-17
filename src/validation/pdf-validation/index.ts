import type { Context } from "hono";
import type { PDFOptions } from "puppeteer";

const pdfValidation = (c: Context) => {
  let errorMessages: string | undefined = undefined;
  let isValid = true;
  let targetUrl = c.req.header("x-pdf-url") || undefined;
  let options: PDFOptions | undefined = {};

  if (targetUrl === undefined) {
    isValid = false;
    errorMessages =
      "x-pdf-url header is required. example : x-pdf-url: https://example.com";
    return { isValid, options, targetUrl, errorMessages };
  }

  let format = c.req.header("x-size-format") || "a4";

  if (format !== "a4" && format !== "custom") {
    isValid = false;
    errorMessages = "x-size-format header must be a4 or custom";
    return { isValid, options, targetUrl, errorMessages };
  }

  let width = c.req.header("x-width") || "210mm";

  if (format === "custom" && isNaN(Number(width))) {
    isValid = false;
    errorMessages = "if x-size-format is custom, x-width must be a required";
    return { isValid, options, targetUrl, errorMessages };
  }

  let height = c.req.header("x-height") || "297mm";

  if (format === "custom" && isNaN(Number(height))) {
    isValid = false;
    errorMessages = "if x-size-format is custom, x-height must be a required";
    return { isValid, options, targetUrl, errorMessages };
  }

  switch (format) {
    case "a4":
      options = {
        format: "a4",
        printBackground: true,
      };
      break;
    case "custom":
      options = {
        width,
        height,
        printBackground: true,
      };
      break;
  }

  return { targetUrl, options, isValid, errorMessages };
};

export default pdfValidation;
