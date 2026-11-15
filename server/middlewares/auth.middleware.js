const User = require("../models/user.model");
const { AppError, asyncHandler, verifyToken } = require("../utils");

// const authenticate = async (req, res, next) => {
//   try{
//   const authorization = req.get("authorization");
//     if (!authorization || !authorization.startsWith("Bearer ")) {
//         throw new AppError("Authentication required", 401);
//     }

//     const payload = verifyToken(authorization.slice(7).trim());
//     const user = await User.findById(payload.sub).select("_id name email role");
//     if (!user) throw new AppError("User account no longer exists", 401);

//     req.user = user;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

const authenticate = asyncHandler(async (req, res, next) => {
    const authorization = req.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const payload = verifyToken(authorization.slice(7).trim());
    const user = await User.findById(payload.sub).select("_id name email role");
    if (!user) throw new AppError("User account no longer exists", 401);

    req.user = user;
    next();
});

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
};

module.exports = { authenticate, authorizeRoles };