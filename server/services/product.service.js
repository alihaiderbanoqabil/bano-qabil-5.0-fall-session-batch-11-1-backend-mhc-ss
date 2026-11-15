const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { AppError } = require("../utils");
const { queryService } = require("./query.service");

const listProducts = (query) => queryService(Product, query, {
    baseFilter: { isActive: true },
    searchFields: ["name", "description"],
    populate: [{ path: "category", select: "name slug" }],
});

const getProduct = async (id) => {
    const product = await Product.findOne({ _id: id, isActive: true }).populate("category", "name slug");
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

const ensureCategory = async (categoryId) => {
    if (!categoryId || !(await Category.exists({ _id: categoryId }))) {
        throw new AppError("A valid product category is required", 400);
    }
};

const createProduct = async (data) => {
    await ensureCategory(data.category);
    const fields = ["name", "description", "price", "category", "stock", "images", "sku", "isActive"];
    return Product.create(Object.fromEntries(fields
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]])));
};

const updateProduct = async (id, updates) => {
    const product = await Product.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    if (updates.category !== undefined) await ensureCategory(updates.category);
    for (const field of ["name", "description", "price", "category", "stock", "images", "sku", "isActive"]) {
        if (updates[field] !== undefined) product[field] = updates[field];
    }
    return product.save();
};

const deactivateProduct = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    product.isActive = false;
    await product.save();
    return product;
};

module.exports = { createProduct, deactivateProduct, getProduct, listProducts, updateProduct };