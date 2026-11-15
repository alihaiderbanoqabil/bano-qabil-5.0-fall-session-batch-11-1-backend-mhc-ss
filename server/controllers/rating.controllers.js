const ratingService = require("../services/rating.service");

const listProductRatings = async (req, res) => {
    const result = await ratingService.listProductRatings(req.params.productId, req.query);
    return res.status(200).json({ status: true, ...result });
};

const listMyRatings = async (req, res) => {
    const result = await ratingService.listMyRatings(req.user.id, req.query);
    return res.status(200).json({ status: true, ...result });
};

const createRating = async (req, res) => {
    const rating = await ratingService.createRating(req.user.id, req.body);
    return res.status(201).json({ status: true, message: "Rating created", data: rating });
};

const updateRating = async (req, res) => {
    const rating = await ratingService.updateRating(
        req.params.id,
        req.user.id,
        req.body,
        req.user.role === "admin"
    );
    return res.status(200).json({ status: true, message: "Rating updated", data: rating });
};

const deleteRating = async (req, res) => {
    const rating = await ratingService.deleteRating(
        req.params.id,
        req.user.id,
        req.user.role === "admin"
    );
    return res.status(200).json({ status: true, message: "Rating deleted", data: rating });
};

module.exports = { createRating, deleteRating, listMyRatings, listProductRatings, updateRating };