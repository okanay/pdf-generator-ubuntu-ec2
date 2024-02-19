import { Hono } from "hono";

const pdfTestRoute = new Hono();

pdfTestRoute.get("", async (c) => {
  try {
    const headers = {
      Accept: "application/pdf",
      "x-pdf-url":
        "https://resetyourself.com.tr/panel/pdf/summary/index.php?key=b3abdd1e-1503-6cc8-8c6e-4c32dea1f769",
      "x-access-token": `${process.env.SECRET_TOKEN}`,
      "x-size-format": "custom",
      "x-width": "1000",
      "x-height": "1000",
    };

    const response = await fetch("http://localhost:8080/pdf", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const status = response.status as any;
      const statusText = response.statusText;
      const errorMessage =
        response.headers.get("x-error-message") || "unknown error occurred";

      return c.json({ status, statusText, errorMessage }, status);
    }

    c.res.headers.set("Content-Type", "application/pdf");
    c.res.headers.set("Content-Disposition", "attachment; filename=test.pdf");
    return c.body(response.body);
  } catch (error) {
    return c.json({ error: "Something went wrong" }, 500);
  }
});

export default pdfTestRoute;
