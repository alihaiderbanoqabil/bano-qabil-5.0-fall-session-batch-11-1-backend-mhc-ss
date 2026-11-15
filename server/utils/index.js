const crypto = require("crypto");

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

const base64UrlEncode = (value) =>
    Buffer.from(value).toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

const signToken = (user) => {
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64UrlEncode(JSON.stringify({
        sub: user.id || user._id.toString(),
        role: user.role,
        iss: TOKEN_ISSUER,
        iat: now,
        exp: now + TOKEN_LIFETIME_SECONDS,
    }));
    const input = `${header}.${payload}`;
    const signature = crypto.createHmac("sha256", getTokenSecret()).update(input).digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${input}.${signature}`;
};

const verifyToken = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) throw new AppError("Invalid or expired token", 401);

    const [headerPart, payloadPart, signaturePart] = parts;
    const expectedSignature = crypto.createHmac("sha256", getTokenSecret())
        .update(`${headerPart}.${payloadPart}`)
        .digest();
    const suppliedSignature = Buffer.from(
        signaturePart.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    );

    if (suppliedSignature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(suppliedSignature, expectedSignature)) {
        throw new AppError("Invalid or expired token", 401);
    }

    let header;
    let payload;
    try {
        header = JSON.parse(Buffer.from(headerPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
        payload = JSON.parse(Buffer.from(payloadPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }

    if (header.alg !== "HS256" || payload.iss !== TOKEN_ISSUER ||
        typeof payload.sub !== "string" || !payload.sub ||
        !["customer", "admin"].includes(payload.role) ||
        !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new AppError("Invalid or expired token", 401);
    }

    return payload;
};

const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { AppError, asyncHandler, escapeRegex, getTokenSecret, signToken, verifyToken };