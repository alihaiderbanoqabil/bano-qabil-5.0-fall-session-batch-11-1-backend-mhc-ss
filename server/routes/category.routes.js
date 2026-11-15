const express = require("express");
const categoryController = require("../controllers/category.controllers");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", authenticate, authorizeRoles("admin"), categoryController.createCategory);
router.patch("/:id", authenticate, authorizeRoles("admin"), categoryController.updateCategory);
router.delete("/:id", authenticate, authorizeRoles("admin"), categoryController.deleteCategory);

module.exports = router;