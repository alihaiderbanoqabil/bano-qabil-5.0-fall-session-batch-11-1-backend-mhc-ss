const Product = require("../models/product.model");
const Rating = require("../models/rating.model");
const { AppError } = require("../utils");
const { queryService } = require("./query.service");

const listProductRatings = (productId, query) => queryService(Rating, query, {
    baseFilter: { product: productId },
    searchFields: ["review"],
    populate: [{ path: "user", select: "name" }],
});

const listMyRatings = (userId, query) => queryService(Rating, query, {
    baseFilter: { user: userId },
    populate: [{ path: "product", select: "name images" }],
});

const createRating = async (userId, data) => {
    if (!data.product || data.rating === undefined) {
        throw new AppError("Product and rating are required", 400);
    }
    if (!(await Product.exists({ _id: data.product, isActive: true }))) {
        throw new AppError("Product not found", 404);
    }
    return Rating.create({
        user: userId,
        product: data.product,
        rating: data.rating,
        review: data.review,
    });
};

const updateRating = async (id, userId, updates, isAdmin = false) => {
    const rating = await Rating.findById(id);
    if (!rating) throw new AppError("Rating not found", 404);
    if (!isAdmin && rating.user.toString() !== userId.toString()) {
        throw new AppError("You can only update your own ratings", 403);
    }
    if (updates.rating !== undefined) rating.rating = updates.rating;
    if (updates.review !== undefined) rating.review = updates.review;
    return rating.save();
};

const deleteRating = async (id, userId, isAdmin = false) => {
    const rating = await Rating.findById(id);
    if (!rating) throw new AppError("Rating not found", 404);
    if (!isAdmin && rating.user.toString() !== userId.toString()) {
        throw new AppError("You can only delete your own ratings", 403);
    }
    await rating.deleteOne();
    return rating;
};

module.exports = { createRating, deleteRating, listMyRatings, listProductRatings, updateRating };