const express = require("express");
const productController = require("../controllers/product.controllers");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.post("/", authenticate, authorizeRoles("admin"), productController.createProduct);
router.patch("/:id", authenticate, authorizeRoles("admin"), productController.updateProduct);
router.delete("/:id", authenticate, authorizeRoles("admin"), productController.deleteProduct);

module.exports = router;