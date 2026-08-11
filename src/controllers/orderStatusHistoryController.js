const db = require("../config/db");

const getOrderStatusHistory = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Cek order
    const order = await db("orders").where("id", order_id).first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const history = await db("order_status_histories")
      .select(
        "order_status_histories.id",
        "order_status_histories.order_id",
        "order_status_histories.status",
        "order_status_histories.created_at",
      )
      .where("order_status_histories.order_id", order_id)
      .orderBy("order_status_histories.created_at", "asc");

    res.json({
      success: true,
      data: {
        order_id: order.id,
        invoice_number: order.invoice_number,
        current_status: order.status,
        history,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get order status history",
    });
  }
};

module.exports = {
  getOrderStatusHistory,
};
