const result = require("dotenv").config();
const e = require("express");
const express = require("express");
const Product = require("../models/product.js");

const checkout = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// check dot env
if (result.error) {
  console.log(result.error);
}

checkout.post("/create", async (req, res) => {
  const lineItems = [];

  for (let item of req.body) {
    const storeItem = await Product.findById(item._id);
    lineItems.push({
      price_data: {
        currency: "sgd",
        product_data: {
          name: storeItem.shoeName,
        },
        unit_amount: storeItem.retailPrice * 100,
      },
      quantity: item.quantity,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/order`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = checkout;
