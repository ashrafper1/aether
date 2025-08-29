const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "general" },
    strapMaterial: {
      type: String,
      enum: ["Steel", "Leather", "Gold", "Titanium"],
      default: "Steel",
    },
    style: {
      type: String,
      enum: ["Chronograph", "Minimalist", "Skeleton", "Diver"],
      default: "Minimalist",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
