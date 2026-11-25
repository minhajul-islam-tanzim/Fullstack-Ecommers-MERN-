
const mongoose = require("mongoose");

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },

  size: {
    type: String,
    required: true,
  },

  color: {
    type: String,
    required: true,
  },
});

// Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
