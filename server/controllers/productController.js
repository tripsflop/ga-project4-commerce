const express = require("express");
const { param, body, validationResult } = require("express-validator");
const Product = require("../models/product.js");
const product = express.Router();

product.get("/all", async (req, res) => {
  try {
    const listings = await Product.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

product.get("/count", async (req, res) => {
  try {
    const listings = await Product.count();
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// filter by release date
product.get("/latest", async (req, res) => {
  try {
    const listings = await Product.find().sort({ releaseDate: -1 }).limit(4);
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

product.get("/item", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skipIndex = (page - 1) * limit;

  try {
    const results = await Product.find()
      .sort()
      .limit(limit)
      .skip(skipIndex)
      .exec();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e);
  }
});

// filter by object ID
product.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Product.findById(id);
    res.status(200).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = product;
