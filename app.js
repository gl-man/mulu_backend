const mongoose = require("mongoose");
const express = require("express");
const httpApp = express();
const router = express.Router();

const http = require("http");
const config = require("./config");

httpApp.set("port", config.port);

var bodyParser = require("body-parser");
var cors = require("cors");
httpApp.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
httpApp.use(bodyParser.json({ limit: "5mb" }));
httpApp.use(cors());

var api = require("./api")();
httpApp.use("/api", api);

mongoose
  .connect(config.mongodb_url)
  .then(() => console.log("Now connected to MongoDB!"))
  .catch((err) => console.error("Something went wrong", err));

http.createServer(httpApp).listen(config.port, function () {
  console.log("Express HTTP server listening on port " + config.port);
});
