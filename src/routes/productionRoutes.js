const express = require("express");

const { getProductionByOrder } = require("../controllers/productionController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/orders/:order_id",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getProductionByOrder,
);

module.exports = router;
