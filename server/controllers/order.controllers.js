const orderService = require("../services/order.service");

const listOrders = async (req, res) => {
    const result = await orderService.listOrders(
        req.user.id,
        req.query,
        req.user.role === "admin"
    );
    return res.status(200).json({ status: true, ...result });
};

const getOrder = async (req, res) => {
    const order = await orderService.getOrder(
        req.params.id,
        req.user.id,
        req.user.role === "admin"
    );
    return res.status(200).json({ status: true, data: order });
};

const createOrder = async (req, res) => {
    const order = await orderService.createOrder(req.user.id, req.body);
    return res.status(201).json({ status: true, message: "Order created", data: order });
};

const cancelOrder = async (req, res) => {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    return res.status(200).json({ status: true, message: "Order cancelled", data: order });
};

const updateOrderStatus = async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    return res.status(200).json({ status: true, message: "Order status updated", data: order });
};

module.exports = { cancelOrder, createOrder, getOrder, listOrders, updateOrderStatus };