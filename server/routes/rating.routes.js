const express = require("express");
const ratingController = require("../controllers/rating.controllers");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/product/:productId", ratingController.listProductRatings);
router.get("/me", authenticate, ratingController.listMyRatings);
router.post("/", authenticate, ratingController.createRating);
router.patch("/:id", authenticate, ratingController.updateRating);
router.delete("/:id", authenticate, ratingController.deleteRating);

module.exports = router;