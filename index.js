require("dotenv").config();
const port = process.env.PORT || 8080;

const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const app = express();

const middleware = require("./routes/middlewares");
const pdfRoutes = require("./routes/pdf");
const testRoutes = require("./routes/test");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use(middleware);

app.use("/pdf", pdfRoutes);
app.use("/test", testRoutes);

app.get("/", async (req, res) => {
  return res.json({ listen: "Server is running on AWS EC2 instance" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
