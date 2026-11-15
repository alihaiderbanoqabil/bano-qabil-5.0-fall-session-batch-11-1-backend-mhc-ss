const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if (err.name === "ValidationError") {
        statusCode = 400;
    } else if (err.name === "CastError" || err instanceof SyntaxError && "body" in err) {
        statusCode = 400;
        message = err.name === "CastError" ? "Invalid identifier or value" : "Invalid JSON body";
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "A record with that value already exists";
    }

    if (statusCode >= 500) message = "Internal server error";

    return res.status(statusCode).json({
        status: false,
        message,
    });
};

module.exports = errorHandler;