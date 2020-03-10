const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory"
  },
  weight: {
    type: String
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producer"
  },
  name: {
    type: String,

    required: true
  },
  description: { type: [String], default: [] },
  photos: { type: [Object], default: [] },
  labels: { type: [String], default: [] },
  ingredient: {
    type: String,
    required: true
  }
});

module.exports = Product;
