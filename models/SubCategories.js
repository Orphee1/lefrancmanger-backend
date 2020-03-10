const mongoose = require("mongoose");

const SubCategory = mongoose.model("SubCategory", {
  name: {
    type: String,
    required: true
  },
  description: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = SubCategory;
