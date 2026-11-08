const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        status: false,
        message: err.message || "Internal server error",
    });
};

module.exports = errorHandler;