const express = require("express");

const {
  getPayments,
  getPaymentById,
  createPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getPayments);

router.get("/:id", getPaymentById);

router.post("/", createPayment);

module.exports = router;
