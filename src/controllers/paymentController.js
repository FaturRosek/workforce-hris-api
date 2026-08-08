const db = require("../config/db");

const getPayments = async (req, res) => {
  try {
    const payments = await db("payments")
      .select(
        "payments.id",
        "payments.order_id",
        "payments.payment_date",
        "payments.amount",
        "payments.payment_method",
        "orders.invoice_number",
        "orders.total_amount",
      )
      .leftJoin("orders", "payments.order_id", "orders.id")
      .orderBy("payments.id", "desc");

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get payments",
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await db("payments")
      .select(
        "payments.id",
        "payments.order_id",
        "payments.payment_date",
        "payments.amount",
        "payments.payment_method",
        "orders.invoice_number",
        "orders.total_amount",
      )
      .leftJoin("orders", "payments.order_id", "orders.id")
      .where("payments.id", id)
      .first();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get payment",
    });
  }
};

const createPayment = async (req, res) => {
  const trx = await db.transaction();

  try {
    const { order_id, amount, payment_method } = req.body;

    if (!order_id || !amount || !payment_method) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Order, amount, and payment method are required",
      });
    }

    const paymentAmount = Number(amount);

    if (paymentAmount <= 0) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    // Cari order
    const order = await trx("orders").where("id", order_id).first();

    if (!order) {
      await trx.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Hitung total payment yang sudah masuk
    const paymentResult = await trx("payments")
      .where("order_id", order_id)
      .sum("amount as total_paid")
      .first();

    const totalPaid = Number(paymentResult.total_paid || 0);

    const totalOrder = Number(order.total_amount);

    const outstanding = totalOrder - totalPaid;

    if (paymentAmount > outstanding) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds outstanding balance",
        data: {
          total_order: totalOrder,
          total_paid: totalPaid,
          outstanding,
        },
      });
    }

    // Simpan payment
    const [payment] = await trx("payments")
      .insert({
        order_id,
        payment_date: new Date(),
        amount: paymentAmount,
        payment_method,
      })
      .returning("*");

    const newTotalPaid = totalPaid + paymentAmount;
    const newOutstanding = totalOrder - newTotalPaid;

    await trx.commit();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment,
        summary: {
          total_order: totalOrder,
          total_paid: newTotalPaid,
          outstanding: newOutstanding,
        },
      },
    });
  } catch (error) {
    await trx.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
};
