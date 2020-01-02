// load express module
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// start express app
const app = express();
app.use(cors());

// allow bigger files
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// use jsonParser
app.use(express.json());

// load images
app.use("/images", express.static("img"));

//load from router
const indexRouter = require("./backend/router");
app.use("/", indexRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get("/dashboard", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listening for Express Server
app.listen(process.env.SERVER_PORT, function() {
  console.log(`Listening on port ${process.env.SERVER_PORT}!`);
});
