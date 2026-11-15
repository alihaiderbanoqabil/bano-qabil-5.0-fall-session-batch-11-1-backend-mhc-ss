const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controllers");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.updateMe);
router.get("/", authenticate, authorizeRoles("admin"), userController.getAllUsers);
router.get("/:id", authenticate, authorizeRoles("admin"), userController.getUserById);
router.patch("/:id", authenticate, authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", authenticate, authorizeRoles("admin"), userController.deleteUser);


module.exports = router;