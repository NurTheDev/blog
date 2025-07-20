const express = require("express");
const app = express();
const router = require("./routes/index");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router)
module.exports = app;
