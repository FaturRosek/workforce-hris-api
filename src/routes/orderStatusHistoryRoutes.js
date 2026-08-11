const express = require("express");

const {
  getOrderStatusHistory,
} = require("../controllers/orderStatusHistoryController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getOrderStatusHistory,
);

module.exports = router;
