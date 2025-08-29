const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCart, addToCart, updateItem, removeItem, clearCart } = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateItem);
router.delete("/remove/:productId", auth, removeItem);
router.delete("/clear", auth, clearCart);

module.exports = router;
