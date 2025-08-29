const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Get all products (with filtering)
router.get("/", productController.list);

// Create new product (admin only)
router.post("/", productController.create);

// Get product by ID
router.get("/:id", productController.getById);

// Update product (admin only)
router.put("/:id", productController.update);

// Delete product (admin only)
router.delete("/:id", productController.delete);

module.exports = router;
