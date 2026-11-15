require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const ratingRoutes = require("./routes/rating.routes");
const orderRoutes = require("./routes/order.routes");

const notFound = require("./middlewares/not-found.middleware");
const errorHandler = require("./middlewares/error.middleware");
const { AppError } = require("./utils");

const app = express();

// =========================
// GLOBAL MIDDLEWARES
// =========================
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
    if (req.body === undefined) req.body = {};
    if (req.body === null || typeof req.body !== "object" || Array.isArray(req.body)) {
        return next(new AppError("Request body must be a JSON object", 400));
    }
    next();
});

// =========================
// API ROUTES
// =========================
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);

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