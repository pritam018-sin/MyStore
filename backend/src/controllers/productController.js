import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { cloudinaryUpload } from "../utils/cloudnaryServices.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand, countInStock } = req.body;

  // Validation
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }
  if (!brand || !brand.trim()) {
    res.status(400);
    throw new Error("Brand is required");
  }
  if (!description || !description.trim()) {
    res.status(400);
    throw new Error("Description is required");
  }
  if (price === undefined || price === "") {
    res.status(400);
    throw new Error("Price is required");
  }
  if (!category) {
    res.status(400);
    throw new Error("Category is required");
  }
  if (quantity === undefined || quantity === "") {
    res.status(400);
    throw new Error("Quantity is required");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    res.status(400);
    throw new Error("Image file is required");
  }

  // Upload image to Cloudinary
  const image = await cloudinaryUpload(imageLocalPath);
  if (!image) {
    res.status(400);
    throw new Error("Image upload failed");
  }

  const product = new Product({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    category,
    quantity: Number(quantity),
    brand: brand.trim(),
    image: image.secure_url || image.url || "",
    countInStock: countInStock !== undefined && countInStock !== "" ? Number(countInStock) : Number(quantity),
  });

  await product.save();

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, quantity, brand, countInStock } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // If a new image was uploaded, send to Cloudinary
  if (req.file?.path) {
    const uploadedImage = await cloudinaryUpload(req.file.path);
    if (!uploadedImage) {
      res.status(400);
      throw new Error("New image upload failed");
    }
    product.image = uploadedImage.secure_url || uploadedImage.url;
  }

  if (name !== undefined) product.name = name.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined && price !== "") product.price = Number(price);
  if (category !== undefined && category !== "") product.category = category;
  if (quantity !== undefined && quantity !== "") product.quantity = Number(quantity);
  if (brand !== undefined) product.brand = brand.trim();
  if (countInStock !== undefined && countInStock !== "") {
    product.countInStock = Number(countInStock);
  } else if (quantity !== undefined && quantity !== "") {
    product.countInStock = Number(quantity);
  }

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword }).limit(pageSize);

  res.json({
    products,
    page: 1,
    pages: Math.ceil(count / pageSize),
    hasMore: false,
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 });

  res.json(products);
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment: comment ? comment.trim() : "",
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    Math.round(
      (product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length) *
        10
    ) / 10;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio } = req.body || {};

  let args = {};
  if (Array.isArray(checked) && checked.length > 0) {
    args.category = { $in: checked };
  }
  if (Array.isArray(radio) && radio.length === 2) {
    args.price = { $gte: Number(radio[0]), $lte: Number(radio[1]) };
  }

  const products = await Product.find(args);
  res.json(products);
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
