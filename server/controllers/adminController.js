const express = require("express");
const bcrypt = require("bcrypt");
const { param, body, validationResult } = require("express-validator");
const Admin = require("../models/Admin.js");
const admin = express.Router();
const role = require("../helper/roles.js");

// admin login
admin.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Admin.findOne({ username }).exec();

  const value = {
    _id: user._id,
  };

  if (user === null) {
    return res.status(401).json({ msg: "Admin not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ msg: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user, role: role.Admin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });

  // redirect to explore page
  return res.status(200).json(value);
});

admin.post(
  "/register",
  body("password").isAlphanumeric().isLength({ min: 8 }),
  body("username").custom(async (value) => {
    return await Admin.find({ username: value }).then((admin) => {
      if (admin.length) {
        return Promise.reject("Admin already in use");
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
      const newAdmin = await Admin.create(data);
      res.status(200).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = admin;
