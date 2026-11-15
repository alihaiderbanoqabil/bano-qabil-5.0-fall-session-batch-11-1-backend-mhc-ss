const User = require("../models/user.model");
const { AppError } = require("../utils");

const createUser = async ({ name, email, password, phone, address }) => {
    if (typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password) {
        throw new AppError("Name, email, and password are required", 400);
    }
    return User.create({ name, email, password, phone, address });
};

const login = async ({ email, password }) => {
    if (typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid email or password", 401);
    }
    return user;
};

const getAllUsers = async (query = {}) => {
    const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));
    const filter = {};
    if (query.role === "admin" || query.role === "customer") filter.role = query.role;

    const [data, total] = await Promise.all([
        User.find(filter).select("-password -emailVerificationToken").sort("-createdAt")
            .skip((page - 1) * limit).limit(limit),
        User.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};

const getUserById = async (id) => {
    const user = await User.findById(id).select("-password -emailVerificationToken");
    if (!user) throw new AppError("User not found", 404);
    return user;
};

const updateProfile = async (id, updates) => {
    const user = await User.findById(id);
    if (!user) throw new AppError("User not found", 404);

    for (const field of ["name", "phone", "address"]) {
        if (updates[field] !== undefined) user[field] = updates[field];
    }
    await user.save();
    return user;
};

const updateUser = async (id, updates) => {
    const user = await User.findById(id);
    if (!user) throw new AppError("User not found", 404);

    for (const field of ["name", "email", "phone", "address", "role"]) {
        if (updates[field] !== undefined) user[field] = updates[field];
    }
    await user.save();
    return user;
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id).select("-password -emailVerificationToken");
    if (!user) throw new AppError("User not found", 404);
    return user;
};

module.exports = { createUser, deleteUser, getAllUsers, getUserById, login, updateProfile, updateUser };
