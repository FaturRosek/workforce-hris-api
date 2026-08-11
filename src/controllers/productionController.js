const db = require("../config/db");

const getProductionByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Ambil order + customer + employee
    const order = await db("orders")
      .select(
        "orders.id",
        "orders.invoice_number",
        "orders.order_date",
        "orders.pickup_date",
        "orders.status",
        "orders.total_amount",
        "orders.notes",
        "customers.id as customer_id",
        "customers.full_name as customer_name",
        "customers.phone as customer_phone",
        "employees.id as employee_id",
        "employees.full_name as employee_name",
      )
      .leftJoin("customers", "orders.customer_id", "customers.id")
      .leftJoin("employees", "orders.employee_id", "employees.id")
      .where("orders.id", order_id)
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ambil measurement
    const measurement = await db("measurements")
      .select(
        "id",
        "order_id",
        "chest",
        "waist",
        "hip",
        "shoulder",
        "sleeve_length",
        "shirt_length",
        "neck",
        "armhole",
        "notes",
      )
      .where("order_id", order_id)
      .first();

    // Ambil history status produksi
    const history = await db("order_status_histories")
      .select("id", "order_id", "status", "created_at")
      .where("order_id", order_id)
      .orderBy("created_at", "asc");

    res.json({
      success: true,
      data: {
        order,
        measurement: measurement || null,
        production_history: history,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get production data",
    });
  }
};

module.exports = {
  getProductionByOrder,
};
