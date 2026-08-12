const express = require("express");

const {
  getProductionByOrder,
  getProductionOrders,
  getProductionSummary,
  getPickupOrders,
} = require("../controllers/productionController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getProductionSummary,
);

router.get(
  "/",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getProductionOrders,
);

router.get(
  "/pickup",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getPickupOrders,
);

router.get(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getProductionByOrder,
);

module.exports = router;
