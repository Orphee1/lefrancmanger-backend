const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  name: {
    type: String,
    required: true
  },
  description: [String],
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }]
});

module.exports = Category;
