const db = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    // Total customer
    const customerResult = await db("customers").count("id as total").first();

    // Total employee
    const employeeResult = await db("employees").count("id as total").first();

    // Total order
    const orderResult = await db("orders").count("id as total").first();

    // Total revenue dari order
    const revenueResult = await db("orders")
      .sum("total_amount as total")
      .whereNot("status", "Cancelled")
      .first();

    // Total payment
    const paymentResult = await db("payments").sum("amount as total").first();

    // Order berdasarkan status
    const orderStatus = await db("orders")
      .select("status")
      .count("id as total")
      .groupBy("status")
      .orderBy("status");

    const totalOrder = Number(orderResult.total || 0);
    const totalRevenue = Number(revenueResult.total || 0);
    const totalPayment = Number(paymentResult.total || 0);

    const outstanding = totalRevenue - totalPayment;

    res.json({
      success: true,
      data: {
        customers: Number(customerResult.total || 0),
        employees: Number(employeeResult.total || 0),
        orders: totalOrder,
        revenue: totalRevenue,
        payments: totalPayment,
        outstanding,
        orders_by_status: orderStatus.map((item) => ({
          status: item.status,
          total: Number(item.total),
        })),
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
