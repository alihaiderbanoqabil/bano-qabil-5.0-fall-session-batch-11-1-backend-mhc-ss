const express = require("express");
const orderController = require("../controllers/order.controllers");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);
router.get("/", orderController.listOrders);
router.post("/", orderController.createOrder);
router.patch("/:id/status", authorizeRoles("admin"), orderController.updateOrderStatus);
router.post("/:id/cancel", orderController.cancelOrder);
router.get("/:id", orderController.getOrder);

module.exports = router;