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

// Specific routes first
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.single("image"), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);
router.route("/filtered-products").post(filterProducts);

// Reviews
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// Parameterized product routes
router
  .route("/:id")
  .get(checkId, fetchProductById)
  .put(authenticate, authorizeAdmin, checkId, upload.single("image"), updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

export default router;
