const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // MASTER DATA
    const customerResult = await db("customers").count("id as total").first();
    const employeeResult = await db("employees").count("id as total").first();

    // ORDER QUERY
    const orderQuery = db("orders").whereNot("status", "Cancelled");
    if (start_date) {
      orderQuery.where("order_date", ">=", start_date);
    }

    if (end_date) {
      orderQuery.where("order_date", "<=", end_date);
    }

    // ORDER STATISTICS
    const orderResult = await orderQuery.clone().count("id as total").first();
    const revenueResult = await orderQuery
      .clone()
      .sum("total_amount as total")
      .first();

    // PAYMENT QUERY

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
      .sum("payments.amount as total")
      .first();

    // ORDER BY STATUS
    const statusQuery = db("orders")
      .select("status")
      .count("id as total")
      .groupBy("status");

    if (start_date) {
      statusQuery.where("order_date", ">=", start_date);
    }

    if (end_date) {
      statusQuery.where("order_date", "<=", end_date);
    }

    const orderStatus = await statusQuery.orderBy("status");

    // CALCULATION
    const totalOrders = Number(orderResult.total || 0);
    const totalRevenue = Number(revenueResult.total || 0);
    const totalPayment = Number(paymentResult.total || 0);
    const outstanding = Math.max(totalRevenue - totalPayment, 0);

    // RESPONSE
    res.json({
      success: true,

      data: {
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },

        master_data: {
          customers: Number(customerResult.total || 0),

          employees: Number(employeeResult.total || 0),
        },

        financial: {
          revenue: totalRevenue,
          payments: totalPayment,
          outstanding,
        },

        orders: {
          total: totalOrders,

          by_status: orderStatus.map((item) => ({
            status: item.status,
            total: Number(item.total),
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};
