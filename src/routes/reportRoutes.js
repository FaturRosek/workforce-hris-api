const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

router.get("/sales", reportController.getSalesReport);

router.get("/payments", reportController.getPaymentReport);

module.exports = router;
