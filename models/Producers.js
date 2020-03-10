const mongoose = require("mongoose");

const Producers = mongoose.model("Producer", {
  name: { type: String, unique: true, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  loc: {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true }
  },
  description: { type: [String], default: [] },
  photos: { type: [Object], default: [] },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  meansOPayment: {
    cheque: { type: Boolean, default: false },
    cash: { type: Boolean, default: false },
    card: { type: Boolean, default: false }
  },
  timeSlot: { type: [Object], default: [] },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

module.exports = Producers;
