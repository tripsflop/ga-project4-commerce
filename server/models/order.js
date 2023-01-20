const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
      size: Number,
    },
    payment: { method: String, transactionId: String },
    status: { type: String, required: true },
    promoCode: { type: String },
    discount: { type: Number },
    total: { type: Number },
    shipping: { carrier: String, tracking: String },
  },
  { timestamps: true }
);

const Order = new mongoose.model("order", orderSchema);
module.exports = Order;
