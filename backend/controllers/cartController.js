const Cart = require("../models/Cart");

const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, products: [] });
  return cart;
};

exports.getCart = async (req, res) => {
  try {
    const cart = await (await ensureCart(req.user.id)).populate("products.productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await ensureCart(req.user.id);
    const existing = cart.products.find(p => p.productId.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.products.push({ productId, quantity });
    await cart.save();
    const populated = await cart.populate("products.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await ensureCart(req.user.id);
    const item = cart.products.find(p => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });
    item.quantity = quantity;
    cart.products = cart.products.filter(p => p.quantity > 0);
    await cart.save();
    const populated = await cart.populate("products.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await ensureCart(req.user.id);
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();
    const populated = await cart.populate("products.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
