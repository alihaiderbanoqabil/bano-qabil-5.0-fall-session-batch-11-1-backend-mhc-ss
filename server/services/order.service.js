const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { AppError } = require("../utils");
const { queryService } = require("./query.service");

const listOrders = (userId, query = {}, isAdmin = false) => queryService(Order, query, {
    baseFilter: isAdmin ? {} : { user: userId },
    searchFields: ["status", "paymentMethod"],
    populate: [
        { path: "user", select: "name email" },
        { path: "items.product", select: "name images" },
    ],
});

const getOrder = async (id, userId, isAdmin = false) => {
    const filter = { _id: id };
    if (!isAdmin) filter.user = userId;
    const order = await Order.findOne(filter).populate("items.product", "name images");
    if (!order) throw new AppError("Order not found", 404);
    return order;
};

const restoreStock = async (changes) => {
    await Promise.all(changes.map(({ productId, quantity }) =>
        Product.updateOne({ _id: productId }, { $inc: { stock: quantity } })));
};

const createOrder = async (userId, data) => {
    if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new AppError("An order must contain at least one item", 400);
    }

    const quantities = new Map();
    for (const item of data.items) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            throw new AppError("Each item must be an object with a product and quantity", 400);
        }
        const quantity = Number(item.quantity);
        if (!item.product || !Number.isInteger(quantity) || quantity < 1) {
            throw new AppError("Each item needs a product and a positive integer quantity", 400);
        }
        const productId = item.product.toString();
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }

    const products = await Product.find({
        _id: { $in: Array.from(quantities.keys()) },
        isActive: true,
    });
    const byId = new Map(products.map((product) => [product.id, product]));
    if (byId.size !== quantities.size) throw new AppError("One or more products are unavailable", 400);

    const stockChanges = [];
    try {
        for (const [productId, quantity] of quantities) {
            const product = byId.get(productId);
            if (product.stock < quantity) {
                throw new AppError(`Insufficient stock for ${product.name}`, 409);
            }
            const updated = await Product.findOneAndUpdate(
                { _id: productId, isActive: true, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true }
            );
            if (!updated) throw new AppError(`Insufficient stock for ${product.name}`, 409);
            stockChanges.push({ productId, quantity });
        }

        const items = Array.from(quantities, ([productId, quantity]) => ({
            product: productId,
            quantity,
            price: byId.get(productId).price,
        }));
        return await Order.create({
            user: userId,
            items,
            totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
        });
    } catch (error) {
        try {
            await restoreStock(stockChanges);
        } catch (rollbackError) {
            console.error("Failed to restore product stock after order creation failed", rollbackError);
        }
        throw error;
    }
};

const cancelOrder = async (id, userId) => {
    const order = await Order.findOneAndUpdate(
        { _id: id, user: userId, status: "pending" },
        { $set: { status: "cancelled" } },
        { new: true }
    );
    if (!order) {
        if (!(await Order.exists({ _id: id, user: userId }))) throw new AppError("Order not found", 404);
        throw new AppError("Only pending orders can be cancelled", 409);
    }
    await restoreStock(order.items.map(({ product, quantity }) => ({
        productId: product,
        quantity,
    })));
    return order;
};

const updateOrderStatus = async (id, status) => {
    if (!["processing", "shipped", "delivered"].includes(status)) {
        throw new AppError("Status must be processing, shipped, or delivered", 400);
    }
    const order = await Order.findByIdAndUpdate(id, { $set: { status } }, {
        new: true,
        runValidators: true,
    });
    if (!order) throw new AppError("Order not found", 404);
    return order;
};

module.exports = { cancelOrder, createOrder, getOrder, listOrders, updateOrderStatus };