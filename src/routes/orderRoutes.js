const express = require("express");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStatusHistory,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id/history", getOrderStatusHistory);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
