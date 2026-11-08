const { randomUUID } = require("crypto");
const users = require("../models/user.model");

// CREATE USER
const createUser = (userData) => {
    const user = {
        id: randomUUID(),
        ...userData,
    };

    users.push(user);

    return user;
};

// GET ALL USERS
const getAllUsers = () => {
    return users;
};

// GET SINGLE USER
const getUserById = (id) => {
    return users.find((user) => user.id === id);
};

// UPDATE USER
const updateUser = (id, userData) => {
    const user = getUserById(id);

    if (!user) return null;

    user.name = userData.name ?? user.name;
    user.email = userData.email ?? user.email;
    user.age = userData.age ?? user.age;

    return user;
};

// DELETE USER
const deleteUser = (id) => {
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) return null;

    return users.splice(userIndex, 1)[0];
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};