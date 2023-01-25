const express = require("express");
const Order = require("../models/order.js");
const { body, param, validationResult } = require("express-validator");
const order = express.Router();

order.get("/initiate", async (req, res) => {
  try {
    const orders = await Order.find({ refundInitiated: true }).exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// filter by object ID
order.get("/:id", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete order
order.post("/cancel/:id", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (order.shippingStatus.status === "Pending") {
      // refund for stripe
      const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
      const refund = await stripe.refunds.create({
        payment_intent: order.paymentIntent,
        amount: order.total,
      });
      order.paymentStatus = "Refunded";
      order.shippingStatus.status = "Cancelled";
      order.isDeleted = true;
      await order.save();
      res.status(200);
    } else {
      res.status(400).json({ msg: "unable to cancel order" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// refund order
order.post("/refund/:id", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (order.shippingStatus.status === "Completed") {
      order.paymentStatus = "Refund Initiated";
      order.refundInitiated = true;
      await order.save();
      res.status(200);
    } else {
      res.status(400).json({ msg: "unable to initiate refund" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// refund order
order.post("/manual/:id", param("id").isMongoId(), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (order.shippingStatus.status === "Completed") {
      // refund for stripe
      const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
      const refund = await stripe.refunds.create({
        payment_intent: order.paymentIntent,
        amount: order.total,
      });
      order.paymentStatus = "Refunded";
      order.shippingStatus.status = "Returned";
      await order.save();
      res.status(200);
    } else {
      res.status(400).json({ msg: "unable to initiate refund" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = order;
