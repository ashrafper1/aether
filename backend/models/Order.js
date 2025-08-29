const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Paid", "Fulfilled", "Cancelled"] }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
