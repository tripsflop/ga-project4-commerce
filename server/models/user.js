const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minLength: 5 },
  password: { type: String, required: true, minLength: 8 },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  streetName: { type: String, required: true },
  unitNo: { type: String, required: true },
  postalCode: { type: String, required: true },
  creditCard: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
