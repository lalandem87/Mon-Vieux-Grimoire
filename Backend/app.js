const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/grimoire")
  .then(() => {
    console.log("Connect to mongoose");
  })
  .catch((e) => {
    console.error(e);
  });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type, Authorization, Accept",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS",
  );
  next();
});
module.exports = app;
