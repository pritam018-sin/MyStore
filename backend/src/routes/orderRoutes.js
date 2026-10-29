import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router
  .route("/total-orders")
  .get(authenticate, authorizeAdmin, countTotalOrders);
router
  .route("/total-sales")
  .get(authenticate, authorizeAdmin, calculateTotalSales);
router
  .route("/total-sales-by-date")
  .get(authenticate, authorizeAdmin, calculateTotalSalesByDate);
router.route("/:id").get(authenticate, checkId, findOrderById);
router.route("/:id/pay").put(authenticate, checkId, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, checkId, markOrderAsDelivered);

export default router;