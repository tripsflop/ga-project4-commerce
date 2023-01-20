const result = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { db } = require("./models/user.js");
const userController = require("./controllers/userController.js");
const adminController = require("./controllers/adminController.js");
const productController = require("./controllers/productController.js");

const app = express();
const PORT = process.env.PORT ?? 7000;
const MONGO_URI = process.env.MONGO_URI;

// mongoose connection settings
mongoose.connect(MONGO_URI);
mongoose.set("runValidators", true);
mongoose.set("debug", true);

// check dot env
if (result.error) {
  console.log(result.error);
}

// check mongodb connection status
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGO_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("../client/dist"));
app.use(cookieParser());

// routes
app.use("/api/user", userController);
app.use("/api/admin", adminController);
app.use("/api/product", productController);

app.get("/api/", (req, res) => {
  res.json({ message: "connection success!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist", "index.html"));
});

mongoose.connection.once("open", () => {
  console.log("connect to mongodb");
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
});
