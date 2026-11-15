const categoryService = require("../services/category.service");

const listCategories = async (req, res) => {
    const result = await categoryService.listCategories(req.query);
    return res.status(200).json({ status: true, ...result });
};

const getCategory = async (req, res) => {
    const category = await categoryService.getCategory(req.params.id);
    return res.status(200).json({ status: true, data: category });
};

const createCategory = async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json({ status: true, message: "Category created", data: category });
};

const updateCategory = async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json({ status: true, message: "Category updated", data: category });
};

const deleteCategory = async (req, res) => {
    const category = await categoryService.deleteCategory(req.params.id);
    return res.status(200).json({ status: true, message: "Category deleted", data: category });
};

module.exports = { createCategory, deleteCategory, getCategory, listCategories, updateCategory };