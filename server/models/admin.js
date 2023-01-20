const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minLength: 5 },
  password: { type: String, required: true, minLength: 8 },
});

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
