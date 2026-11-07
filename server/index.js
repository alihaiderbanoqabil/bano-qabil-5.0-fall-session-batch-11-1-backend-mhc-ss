
const express = require("express");
const { randomUUID } = require("crypto");

const app = express();

// Middleware
app.use(express.json());

// In-memory users array
let users = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        age: 30,
    }
];

// =========================
// CREATE USER
// POST /api/users
// =========================
app.post("/api/users", (req, res) => {
    try {
        const { name, email, age } = req.body;

        const user = {
            id: randomUUID(),
            name,
            email,
            age,
        };

        users.push(user);

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            data: user,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
});

// =========================
// GET ALL USERS
// GET /api/users
// =========================
app.get("/api/users", (req, res) => {
    return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users,
    });
});

// =========================
// GET SINGLE USER
// GET /api/users/:id
// =========================
app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

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
});

// =========================
// UPDATE USER
// PUT /api/users/:id
// =========================
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    const { name, email, age } = req.body;

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.age = age ?? user.age;

    return res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
    });
});

// =========================
// DELETE USER
// DELETE /api/users/:id
// =========================
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
});

// =========================
// 404 - ROUTE NOT FOUND
// =========================
app.use((req, res) => {
    return res.status(404).json({
        status: false,
        message: "Route not found",
    });
});


// =========================
// START SERVER
// =========================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
