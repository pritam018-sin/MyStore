import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.route("/categories").get(listCategory);

router.route("/").post(authenticate, authorizeAdmin, createCategory);

router
  .route("/:categoryId")
  .get(checkId, readCategory)
  .put(authenticate, authorizeAdmin, checkId, updateCategory)
  .delete(authenticate, authorizeAdmin, checkId, removeCategory);

export default router;