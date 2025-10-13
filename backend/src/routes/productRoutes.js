import express from "express";
import { upload } from "../middlewares/mutler.Middleware.js";
import {
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
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

// ✅ Fetch and Create Product (with image upload)
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.single("image"), addProduct);

// ✅ All products
router.route("/allproducts").get(fetchAllProducts);

// ✅ Reviews
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// ✅ Top / New products
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

// ✅ Update & Delete
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, upload.single("image"), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

// ✅ Filter
router.route("/filtered-products").post(filterProducts);

export default router;
