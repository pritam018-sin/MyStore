import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }

  const trimmedName = name.trim();
  const existingCategory = await Category.findOne({ name: trimmedName });

  if (existingCategory) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await new Category({ name: trimmedName }).save();
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryId = req.params.categoryId || req.params.id;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = name.trim();

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

const removeCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId || req.params.id;
  const removed = await Category.findByIdAndDelete(categoryId);

  if (!removed) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(removed);
});

const listCategory = asyncHandler(async (req, res) => {
  const all = await Category.find({});
  res.json(all);
});

const readCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId || req.params.id;
  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};