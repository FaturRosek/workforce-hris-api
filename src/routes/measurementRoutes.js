const express = require("express");

const {
  createMeasurement,
  getMeasurementByOrder,
  updateMeasurement,
} = require("../controllers/measurementController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  createMeasurement,
);

router.get(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getMeasurementByOrder,
);

router.put(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  updateMeasurement,
);

module.exports = router;
