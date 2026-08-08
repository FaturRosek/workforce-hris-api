const express = require("express");

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.post("/", createOrder);

router.put("/:id/status", updateOrderStatus);

module.exports = router;
