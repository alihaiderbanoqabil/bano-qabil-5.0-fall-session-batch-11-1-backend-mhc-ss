const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { AppError } = require("../utils");
const { queryService } = require("./query.service");

const listCategories = (query) => queryService(Category, query, {
    searchFields: ["name", "description"],
    populate: [{ path: "parentCategory", select: "name slug" }],
});

const getCategory = async (id) => {
    const category = await Category.findById(id).populate("parentCategory", "name slug");
    if (!category) throw new AppError("Category not found", 404);
    return category;
};

const createCategory = async (data) => {
    if (data.parentCategory && !(await Category.exists({ _id: data.parentCategory }))) {
        throw new AppError("Parent category not found", 400);
    }
    return Category.create({ name: data.name, description: data.description, image: data.image, parentCategory: data.parentCategory });
};

const updateCategory = async (id, updates) => {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    if (updates.parentCategory && updates.parentCategory.toString() === id) {
        throw new AppError("A category cannot be its own parent", 400);
    }
    if (updates.parentCategory && !(await Category.exists({ _id: updates.parentCategory }))) {
        throw new AppError("Parent category not found", 400);
    }
    for (const field of ["name", "description", "image", "parentCategory"]) {
        if (updates[field] !== undefined) category[field] = updates[field];
    }
    return category.save();
};

const deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    if (await Product.exists({ category: id })) {
        throw new AppError("Category cannot be deleted while products use it", 409);
    }
    if (await Category.exists({ parentCategory: id })) {
        throw new AppError("Category cannot be deleted while it has child categories", 409);
    }
    await category.deleteOne();
    return category;
};

module.exports = { createCategory, deleteCategory, getCategory, listCategories, updateCategory };