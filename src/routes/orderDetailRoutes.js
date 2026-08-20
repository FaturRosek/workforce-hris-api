const express = require("express");

const {
  getOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} = require("../controllers/orderDetailController");

const router = express.Router();

router.get("/", getOrderDetails);

router.get("/:id", getOrderDetailById);

router.post("/", createOrderDetail);

router.put("/:id", updateOrderDetail);

router.delete("/:id", deleteOrderDetail);

module.exports = router;
