// const userService = require("../services/user.service");
const { createUser, getAllUsers } = require("../services/user.service");

// CREATE USER

const createUser = (req, res) => {
    try {
        const user = createUser(req.body);

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// const createUser = (req, res) => {
//     try {
//         const { name, email, age } = req.body;

//         const user = {
//             id: randomUUID(),
//             name,
//             email,
//             age,
//         };

//         users.push(user);

//         return res.status(201).json({
//             status: true,
//             message: "User created successfully",
//             data: user,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// }

// const createUser = (req, res, next) => {
//     try {
//         const user = userService.createUser(req.body);

//         return res.status(201).json({
//             status: true,
//             message: "User created successfully",
//             data: user,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// GET ALL USERS
const getAllUsers = (req, res) => {
    const users = getAllUsers();

    return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users,
    });
};

// GET SINGLE USER
const getUserById = (req, res) => {
    const { id } = req.params;

    const user = userService.getUserById(id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "User fetched successfully",
        data: user,
    });
};

// UPDATE USER
const updateUser = (req, res) => {
    const { id } = req.params;

    const user = userService.updateUser(id, req.body);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
    });
};

// DELETE USER
const deleteUser = (req, res) => {
    const { id } = req.params;

    const user = userService.deleteUser(id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: user,
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};