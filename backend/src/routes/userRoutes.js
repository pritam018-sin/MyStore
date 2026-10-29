import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, checkId, deleteUserById)
  .get(authenticate, authorizeAdmin, checkId, getUserById)
  .put(authenticate, authorizeAdmin, checkId, updateUserById);

export default router;