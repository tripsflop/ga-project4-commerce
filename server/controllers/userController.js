const express = require("express");
const bcrypt = require("bcrypt");
const { param, body, validationResult } = require("express-validator");
const User = require("../models/user.js");
const role = require("../helper/roles.js");
const user = express.Router();
const jwt = require("jsonwebtoken");
const authorise = require("../middleware/auth.js");

// user login
user.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();

  const value = {
    _id: user._id,
  };

  if (user === null) {
    return res.status(401).json({ msg: "User not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ msg: "Invalid password" });
  }

  const accessToken = jwt.sign(
    { id: user, role: role.User },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user, role: role.User },
    process.env.REFRESH_TOKEN_SECRET
  );

  res.cookie("token", accessToken, { httpOnly: true });
  res.cookie("refresh", refreshToken, { httpOnly: true });

  // redirect to explore page
  return res.status(200).json(value);
});

user.post(
  "/register",
  body("name").isAlpha(["en-US"], { ignore: " _-" }),
  body("email").isEmail(),
  body("password").isAlphanumeric().isLength({ min: 8 }),
  body("mobile").isMobilePhone(["en-SG", true]),
  body("creditCard").isCreditCard(),
  body("username").custom(async (value) => {
    return await User.find({ username: value }).then((user) => {
      if (user.length) {
        return Promise.reject("Username already in use");
      }
    });
  }),
  body("email").custom(async (value) => {
    return await User.find({ email: value }).then((user) => {
      if (user.length) {
        return Promise.reject("Email already in use");
      }
    });
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 10);
      data.creditCard = bcrypt.hashSync(data.creditCard, 10);
      const newUser = await User.create(data);
      res.status(200).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

user.get(
  "/:id",
  param("id").isMongoId(),
  authorise(role.User),
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let item = await User.findById(id);
      const value = {
        _id: item._id,
        username: item.username,
        name: item.name,
        mobile: item.mobile,
        email: item.email,
        streetName: item.streetName,
        unitNo: item.unitNo,
        postalCode: item.postalCode,
      };
      res.json(value);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

user.get("/check/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let item = await User.findOne({ username: id }).exec();
    if (item != null) {
      res.status(400).json({ msg: "Username not available" });
    } else {
      res.status(200).send({ msg: "Username available" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = user;
