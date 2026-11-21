const userService = require("../services/user.service");
const { getTokenSecret, createToken } = require("../utils");

const register = async (req, res) => {
    getTokenSecret();
    const user = await userService.createUser(req.body);
    // const { password, isEmailVerified, emailVerificationToken, ...userDetails } = user.toJSON();
    // console.log("user", userDetails);
    return res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: {
            user: user,
            token: createToken(user, "15m"),
        },
    });
};

const login = async (req, res) => {
    getTokenSecret();
    const user = await userService.login(req.body);
    return res.status(200).json({
        status: true,
        message: "Login successful",
        data: { user: user.toJSON(), token: createToken(user, "7d") },
    });
};

const getMe = (req, res) => res.status(200).json({
    status: true,
    data: req.user,
});

const updateMe = async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    return res.status(200).json({ status: true, message: "Profile updated", data: user });
};

const getAllUsers = async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    return res.status(200).json({ status: true, ...result });
};

const getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ status: true, data: user });
};

const updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ status: true, message: "User updated", data: user });
};

const deleteUser = async (req, res) => {
    const user = await userService.deleteUser(req.params.id);
    return res.status(200).json({ status: true, message: "User deleted", data: user });
};

module.exports = {
    register,
    login,
    getMe,
    updateMe,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};