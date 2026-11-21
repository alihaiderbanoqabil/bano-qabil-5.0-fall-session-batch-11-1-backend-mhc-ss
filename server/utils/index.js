const jwt = require("jsonwebtoken");

const TOKEN_ISSUER = "bano-qabil-api";
const TOKEN_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getTokenSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new AppError("JWT_SECRET must be set to a random value of at least 32 characters", 500);
    }
    return secret;
};

const signToken = (user) => {
    const subject = user.id || user._id?.toString();
    if (!subject) {
        throw new AppError("Cannot sign a token without a user id", 500);
    }

    return jwt.sign(
        { role: user.role },
        getTokenSecret(),
        {
            algorithm: "HS256",
            subject,
            issuer: TOKEN_ISSUER,
            expiresIn: TOKEN_LIFETIME_SECONDS,
        }
    );
};

const verifyToken = (token) => {
    const secret = getTokenSecret();

    try {
        const payload = jwt.verify(token, secret, {
            algorithms: ["HS256"],
            issuer: TOKEN_ISSUER,
        });

        if (typeof payload.sub !== "string" || !payload.sub ||
            !["customer", "admin"].includes(payload.role)) {
            throw new AppError("Invalid or expired token", 401);
        }

        return payload;
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }
};

const createToken = (user, expiryTime = "7d") => {
    return jwt.sign(
        { id: user._id, email: user.email, phone: user.phone, role: user.role },
        // process.env.JWT_SECRET,
        getTokenSecret(),
        { expiresIn: expiryTime }
    );
};

const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { AppError, createToken, asyncHandler, escapeRegex, getTokenSecret, signToken, verifyToken };