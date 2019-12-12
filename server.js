// load express module
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// start express app
const app = express();
app.use(cors());

// use jsonParser
app.use(express.json());

// load images
app.use("/images", express.static("img"));

//load from router
const indexRouter = require("./backend/router");
app.use("/", indexRouter);

// Listening for Express Server
app.listen(process.env.SERVER_PORT, function() {
  console.log(`Listening on port ${process.env.SERVER_PORT}!`);
});
