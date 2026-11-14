
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // Main Image: একটি ছবির URL ও public_id থাকবে
    mainImage: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    // Additional Images: সর্বোচ্চ ৩টি ছবি রাখা যাবে
    additionalImages: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],

      // ৩টির বেশি ছবি হলে validation error দেবে
      validate: {
        validator: (images) => images.length <= 3,
        message: "Maximum 3 additional images allowed",
      },

      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
