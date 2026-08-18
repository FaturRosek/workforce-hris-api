const db = require("../config/db");

const getPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      payment_method,
      payment_status,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    const query = db("payments").leftJoin(
      "orders",
      "payments.order_id",
      "orders.id",
    );

    if (search) {
      query.whereILike("orders.invoice_number", `%${search}%`);
    }

    if (payment_method) {
      query.where("payments.payment_method", payment_method);
    }

    if (payment_status) {
      query.where("payments.payment_status", payment_status);
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count("payments.id as total")
      .first();

    const offset = (pageNumber - 1) * limitNumber;

    const payments = await query
      .clone()
      .select(
        "payments.id",
        "payments.order_id",
        "payments.payment_date",
        "payments.payment_method",
        "payments.amount",
        "payments.payment_status",
        "payments.created_at",
        "payments.updated_at",
        "orders.invoice_number",
        "orders.total_amount",
      )
      .orderBy("payments.id", "desc")
      .limit(limitNumber)
      .offset(offset);

    const total = Number(countResult.total || 0);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        total_pages: Math.ceil(total / limitNumber),
      },
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
        "payments.payment_status",
        "payments.created_at",
        "payments.updated_at",
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

    const paymentSummary = await db("payments")
      .where("order_id", payment.order_id)
      .sum("amount as total")
      .first();

    const totalPaid = Number(paymentSummary.total || 0);
    const orderTotal = Number(payment.total_amount || 0);
    const remaining = Math.max(orderTotal - totalPaid, 0);

    res.json({
      success: true,
      data: {
        ...payment,
        summary: {
          order_total: orderTotal,
          total_paid: totalPaid,
          remaining,
          payment_status: remaining === 0 ? "Paid" : "Partial",
        },
      },
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
    const { order_id, payment_date, payment_method, amount } = req.body;

    if (!order_id || !payment_date || !payment_method || amount === undefined) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Order, payment date, payment method, and amount are required",
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const order = await trx("orders").where("id", order_id).first();

    if (!order) {
      await trx.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled") {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Cannot make payment for cancelled order",
      });
    }

    const paymentResult = await trx("payments")
      .where("order_id", order_id)
      .sum("amount as total")
      .first();

    const totalPaid = Number(paymentResult.total || 0);

    const remaining = Number(order.total_amount) - totalPaid;

    if (paymentAmount > remaining) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds remaining balance",
        data: {
          order_total: Number(order.total_amount),
          total_paid: totalPaid,
          remaining,
        },
      });
    }

    const newTotalPaid = totalPaid + paymentAmount;

    let paymentStatus = "Partial";

    if (newTotalPaid >= Number(order.total_amount)) {
      paymentStatus = "Paid";
    }

    const [payment] = await trx("payments")
      .insert({
        order_id,
        payment_date,
        payment_method,
        amount: paymentAmount,
        payment_status: paymentStatus,
      })
      .returning("*");

    await trx.commit();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment,
        summary: {
          order_total: Number(order.total_amount),
          total_paid: newTotalPaid,
          remaining: Number(order.total_amount) - newTotalPaid,
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

const getOrderPaymentSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db("orders")
      .select("id", "invoice_number", "total_amount", "status")
      .where("id", id)
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const paymentResult = await db("payments")
      .where("order_id", id)
      .sum("amount as total_paid")
      .first();

    const orderTotal = Number(order.total_amount || 0);
    const totalPaid = Number(paymentResult.total_paid || 0);

    const remaining = Math.max(orderTotal - totalPaid, 0);

    let paymentStatus = "Unpaid";

    if (totalPaid >= orderTotal) {
      paymentStatus = "Paid";
    } else if (totalPaid > 0) {
      paymentStatus = "Partial";
    }

    res.json({
      success: true,
      data: {
        order_id: order.id,
        invoice_number: order.invoice_number,
        order_status: order.status,
        order_total: orderTotal,
        total_paid: totalPaid,
        remaining,
        payment_status: paymentStatus,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get payment summary",
    });
  }
};

const getOrderPayments = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db("orders")
      .select("id", "invoice_number", "total_amount")
      .where("id", id)
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payments = await db("payments")
      .select(
        "id",
        "order_id",
        "payment_date",
        "payment_method",
        "amount",
        "payment_status",
        "created_at",
      )
      .where("order_id", id)
      .orderBy("payment_date", "desc")
      .orderBy("id", "desc");

    const totalPaid = payments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );

    const orderTotal = Number(order.total_amount || 0);

    const remaining = Math.max(orderTotal - totalPaid, 0);

    let paymentStatus = "Unpaid";

    if (totalPaid >= orderTotal) {
      paymentStatus = "Paid";
    } else if (totalPaid > 0) {
      paymentStatus = "Partial";
    }

    res.json({
      success: true,
      data: {
        order_id: order.id,
        invoice_number: order.invoice_number,
        order_total: orderTotal,
        total_paid: totalPaid,
        remaining,
        payment_status: paymentStatus,
        payments,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get order payments",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  getOrderPaymentSummary,
  getOrderPayments,
};
