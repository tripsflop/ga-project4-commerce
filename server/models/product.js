const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  shoeName: { type: String, required: true },
  silhoutte: { type: String, required: true },
  colorway: { type: String, required: true },
  retailPrice: { type: String, required: true },
  thumbnail: { type: String, required: true },
  releaseDate: { type: String, required: true },
  description: { type: String },
  make: { type: String, required: true },
  urlKey: { type: String, required: true },
  releaseYear: { type: String, required: true },
  sizes: { type: Object },
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
