import { Hono } from "hono";

const pdfTestRoute = new Hono();

pdfTestRoute.get("", async (c) => {
  const PORT = process.env.PORT || 8080;

  try {
    const headers = {
      Accept: "application/pdf",
      "x-pdf-url":
        "https://resetyourself.com/panel/pdf/complete/index.php?type=test&lang=tr",
      "x-access-token": `${process.env.SECRET_TOKEN}`,
      "x-size-format": "custom",
      "x-width": "1000",
      "x-height": "1000",
    };

    const response = await fetch(`http://localhost:${PORT}/pdf`, {
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

    const fileName = response.headers.get("Custom-File-Name");
    c.res.headers.set("Content-Type", "application/pdf");
    c.res.headers.set(
      "Content-Disposition",
      `attachment; filename=test-${fileName}.pdf`,
    );
    return c.body(response.body);
  } catch (error) {
    return c.json({ error: "Something went wrong" }, 500);
  }
});

export default pdfTestRoute;
