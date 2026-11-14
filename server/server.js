require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const notFound = require("./middlewares/not-found.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// =========================
// GLOBAL MIDDLEWARES
// =========================
app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/api/users", userRoutes);

// =========================
// ERROR HANDLING
// =========================
app.use(notFound);
app.use(errorHandler);

// =========================
// START SERVER (after DB connects)
// =========================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});