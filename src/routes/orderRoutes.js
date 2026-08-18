const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStatusHistory,
} = require("../controllers/orderController");

const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id/history", getOrderStatusHistory);
router.get("/:id/payment-summary", paymentController.getOrderPaymentSummary);
router.get("/:id/payments", paymentController.getOrderPayments);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put(
  "/:id/status",
  authenticate,
  authorize("Admin", "Tailor"),
  updateOrderStatus,
);

module.exports = router;
