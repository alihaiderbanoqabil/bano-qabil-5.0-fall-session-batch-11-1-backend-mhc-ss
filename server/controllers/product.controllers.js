const productService = require("../services/product.service");

const listProducts = async (req, res) => {
    const result = await productService.listProducts(req.query);
    return res.status(200).json({ status: true, ...result });
};

const getProduct = async (req, res) => {
    const product = await productService.getProduct(req.params.id);
    return res.status(200).json({ status: true, data: product });
};

const createProduct = async (req, res) => {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({ status: true, message: "Product created", data: product });
};

const updateProduct = async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    return res.status(200).json({ status: true, message: "Product updated", data: product });
};

const deleteProduct = async (req, res) => {
    const product = await productService.deactivateProduct(req.params.id);
    return res.status(200).json({ status: true, message: "Product deactivated", data: product });
};

module.exports = { createProduct, deleteProduct, getProduct, listProducts, updateProduct };