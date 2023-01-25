const express = require("express");
const Order = require("../models/order.js");
const order = express.Router();

// filter by object ID
order.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = order;
