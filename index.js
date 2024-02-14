require("dotenv").config()

const cors = require("cors")
const express = require("express");

const productionMode = process.env.PRODUCTION_MODE;
const app = express();

app.use(cors())
app.use(express.json())

const product = require("./routes/pdf")
app.use("/", product)

const test = require("./routes/test")
app.use("/", test)

app.get("/", async (req, res) => {
    return res.json({listen : "server run on AWS EC2 instance"})
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
