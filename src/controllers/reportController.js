const db = require("../config/db");

const getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const query = db("orders")
      .select(
        "orders.id",
        "orders.invoice_number",
        "orders.order_date",
        "orders.status",
        "orders.total_amount",
        "customers.full_name as customer_name",
        "employees.full_name as employee_name",
      )
      .leftJoin("customers", "orders.customer_id", "customers.id")
      .leftJoin("employees", "orders.employee_id", "employees.id")
      .whereNot("orders.status", "Cancelled");

    if (start_date) {
      query.where("orders.order_date", ">=", start_date);
    }

    if (end_date) {
      query.where("orders.order_date", "<=", end_date);
    }

    const orders = await query
      .orderBy("orders.order_date", "desc")
      .orderBy("orders.id", "desc");

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (total, order) => total + Number(order.total_amount || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },
        summary: {
          total_orders: totalOrders,
          total_revenue: totalRevenue,
        },
        orders,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get sales report",
    });
  }
};

const getPaymentReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Ambil order yang bukan cancelled
    const orderQuery = db("orders").whereNot("status", "Cancelled");

    if (start_date) {
      orderQuery.where("order_date", ">=", start_date);
    }

    if (end_date) {
      orderQuery.where("order_date", "<=", end_date);
    }

    const orderResult = await orderQuery
      .clone()
      .sum("total_amount as total_revenue")
      .count("id as total_orders")
      .first();

    const totalRevenue = Number(orderResult.total_revenue || 0);

    const totalOrders = Number(orderResult.total_orders || 0);

    // Ambil payment
    const paymentQuery = db("payments")
      .leftJoin("orders", "payments.order_id", "orders.id")
      .whereNot("orders.status", "Cancelled");

    if (start_date) {
      paymentQuery.where("payments.payment_date", ">=", start_date);
    }

    if (end_date) {
      paymentQuery.where("payments.payment_date", "<=", end_date);
    }

    const paymentResult = await paymentQuery
      .clone()
      .sum("payments.amount as total_paid")
      .count("payments.id as total_payments")
      .first();

    const totalPaid = Number(paymentResult.total_paid || 0);

    const totalPayments = Number(paymentResult.total_payments || 0);

    const outstanding = Math.max(totalRevenue - totalPaid, 0);

    const payments = await paymentQuery
      .clone()
      .select(
        "payments.id",
        "payments.order_id",
        "payments.payment_date",
        "payments.payment_method",
        "payments.amount",
        "payments.payment_status",
        "orders.invoice_number",
        "orders.total_amount",
      )
      .orderBy("payments.payment_date", "desc")
      .orderBy("payments.id", "desc");

    res.json({
      success: true,
      data: {
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },
        summary: {
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          total_payments: totalPayments,
          total_paid: totalPaid,
          outstanding,
        },
        payments,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get payment report",
    });
  }
};

module.exports = {
  getSalesReport,
  getPaymentReport,
};
