const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createOrder,
  myOrders,
  metrics,
  getAllOrders,
} = require("../controllers/orderController");

router.post("/", auth, createOrder);
router.get("/mine", auth, myOrders);
router.get("/metrics", auth, metrics);
router.get("/", getAllOrders); // Admin endpoint to get all orders

module.exports = router;
