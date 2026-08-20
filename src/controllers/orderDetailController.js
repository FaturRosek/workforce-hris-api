const db = require("../config/db");

const updateOrderTotal = async (orderId) => {
  const result = await db("order_details")
    .where("order_id", orderId)
    .sum("subtotal as total")
    .first();

  const total = Number(result.total || 0);

  await db("orders").where("id", orderId).update({
    total_amount: total,
    updated_at: db.fn.now(),
  });

  return total;
};

const getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.query;

    const query = db("order_details as od")
      .leftJoin("services as s", "od.service_id", "s.id")
      .select(
        "od.id",
        "od.order_id",
        "od.service_id",
        "s.service_name",
        "od.qty",
        "od.price",
        "od.subtotal",
        "od.created_at",
      )
      .orderBy("od.id", "desc");

    if (order_id) {
      query.where("od.order_id", order_id);
    }

    const details = await query;

    res.json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get order details",
    });
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await db("order_details as od")
      .leftJoin("services as s", "od.service_id", "s.id")
      .select(
        "od.id",
        "od.order_id",
        "od.service_id",
        "s.service_name",
        "od.qty",
        "od.price",
        "od.subtotal",
        "od.created_at",
      )
      .where("od.id", id)
      .first();

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Order detail not found",
      });
    }

    res.json({
      success: true,
      data: detail,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get order detail",
    });
  }
};

const createOrderDetail = async (req, res) => {
  try {
    const { order_id, service_id, qty } = req.body;

    if (!order_id || !service_id || !qty) {
      return res.status(400).json({
        success: false,
        message: "Order ID, service ID, and quantity are required",
      });
    }

    if (!Number.isInteger(Number(qty)) || Number(qty) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const order = await db("orders").where("id", order_id).first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const service = await db("services").where("id", service_id).first();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const price = Number(service.price);
    const quantity = Number(qty);
    const subtotal = price * quantity;

    const [detail] = await db("order_details")
      .insert({
        order_id,
        service_id,
        qty: quantity,
        price,
        subtotal,
      })
      .returning(["id", "order_id", "service_id", "qty", "price", "subtotal"]);

    const totalAmount = await updateOrderTotal(order_id);

    res.status(201).json({
      success: true,
      message: "Order detail created successfully",
      data: detail,
      order_total: totalAmount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create order detail",
    });
  }
};

const updateOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_id, qty } = req.body;

    const existingDetail = await db("order_details").where("id", id).first();

    if (!existingDetail) {
      return res.status(404).json({
        success: false,
        message: "Order detail not found",
      });
    }

    if (!service_id || !qty) {
      return res.status(400).json({
        success: false,
        message: "Service ID and quantity are required",
      });
    }

    if (!Number.isInteger(Number(qty)) || Number(qty) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const service = await db("services").where("id", service_id).first();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const price = Number(service.price);
    const quantity = Number(qty);
    const subtotal = price * quantity;

    const [detail] = await db("order_details")
      .where("id", id)
      .update({
        service_id,
        qty: quantity,
        price,
        subtotal,
        updated_at: db.fn.now(),
      })
      .returning(["id", "order_id", "service_id", "qty", "price", "subtotal"]);

    const totalAmount = await updateOrderTotal(existingDetail.order_id);

    res.json({
      success: true,
      message: "Order detail updated successfully",
      data: detail,
      order_total: totalAmount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update order detail",
    });
  }
};

const deleteOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const existingDetail = await db("order_details").where("id", id).first();

    if (!existingDetail) {
      return res.status(404).json({
        success: false,
        message: "Order detail not found",
      });
    }

    const deleted = await db("order_details").where("id", id).del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order detail not found",
      });
    }

    const totalAmount = await updateOrderTotal(existingDetail.order_id);

    res.json({
      success: true,
      message: "Order detail deleted successfully",
      order_total: totalAmount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order detail",
    });
  }
};

module.exports = {
  getOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
