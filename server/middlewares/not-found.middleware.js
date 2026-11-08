const notFound = (req, res) => {
    return res.status(404).json({
        status: false,
        message: "Route not found",
    });
};

module.exports = notFound;