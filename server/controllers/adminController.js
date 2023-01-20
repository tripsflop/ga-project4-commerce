const express = require("express");
const bcrypt = require("bcrypt");
const { param, body, validationResult } = require("express-validator");
const Admin = require("../models/user.js");
const admin = express.Router();
const role = require("../helper/roles.js");

// admin login
admin.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Admin.findOne({ username }).exec();

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
  return res.redirect("/welcome");
});

module.exports = admin;
