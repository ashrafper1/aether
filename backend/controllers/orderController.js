const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    const products = cart.products.map((p) => ({
      productId: p.productId._id,
      quantity: p.quantity,
    }));
    const total = cart.products.reduce(
      (sum, p) => sum + p.quantity * (p.productId.price || 0),
      0
    );
    const order = await Order.create({
      userId,
      products,
      total,
      status: "Paid",
    });
    cart.products = [];
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.metrics = async (_req, res) => {
  try {
    const agg = await Order.aggregate([
      { $match: { status: { $in: ["Paid", "Fulfilled"] } } },
      {
        $group: { _id: null, revenue: { $sum: "$total" }, count: { $sum: 1 } },
      },
    ]);
    const revenue = agg[0]?.revenue || 0;
    const sales = agg[0]?.count || 0;
    res.json({ revenue, sales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
