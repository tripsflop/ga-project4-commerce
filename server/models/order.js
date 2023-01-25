const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        size: { type: String },
        quantity: { type: Number },
      },
    ],
    subtotal: { type: Number },
    total: { type: Number },
    payment: [String],
    paymentStatus: { type: String, required: true },
    shippingDetails: {
      city: String,
      country: String,
      line1: String,
      line2: String,
      postal_code: String,
      state: String,
    },
    shippingStatus: { status: { type: String, default: "Pending" } },
  },
  { timestamps: true }
);

const Order = new mongoose.model("order", orderSchema);
module.exports = Order;
