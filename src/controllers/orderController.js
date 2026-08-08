const db = require("../config/db");

const getOrders = async (req, res) => {
  try {
    const orders = await db("orders")
      .select(
        "orders.id",
        "orders.invoice_number",
        "orders.order_date",
        "orders.pickup_date",
        "orders.status",
        "orders.total_amount",
        "orders.notes",
        "customers.full_name as customer_name",
        "employees.full_name as employee_name",
      )
      .leftJoin("customers", "orders.customer_id", "customers.id")
      .leftJoin("employees", "orders.employee_id", "employees.id")
      .orderBy("orders.id", "desc");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

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
      .where("orders.id", id)
      .first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const details = await db("order_details")
      .select(
        "order_details.id",
        "order_details.qty",
        "order_details.price",
        "order_details.subtotal",
        "services.id as service_id",
        "services.service_name",
      )
      .leftJoin("services", "order_details.service_id", "services.id")
      .where("order_details.order_id", id);

    res.json({
      success: true,
      data: {
        ...order,
        details,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get order",
    });
  }
};

const createOrder = async (req, res) => {
  const trx = await db.transaction();

  try {
    const {
      customer_id,
      employee_id,
      order_date,
      pickup_date,
      notes,
      details,
    } = req.body;

    if (
      !customer_id ||
      !employee_id ||
      !order_date ||
      !pickup_date ||
      !details ||
      details.length === 0
    ) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Customer, employee, dates, and order details are required",
      });
    }

    // Cek customer
    const customer = await trx("customers").where("id", customer_id).first();

    if (!customer) {
      await trx.rollback();

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Cek employee
    const employee = await trx("employees").where("id", employee_id).first();

    if (!employee) {
      await trx.rollback();

      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Generate invoice
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const lastOrder = await trx("orders").orderBy("id", "desc").first();

    const nextNumber = lastOrder ? lastOrder.id + 1 : 1;

    const invoiceNumber = `INV-${today}-${String(nextNumber).padStart(3, "0")}`;

    let totalAmount = 0;

    const orderDetails = [];

    for (const item of details) {
      const service = await trx("services")
        .where("id", item.service_id)
        .first();

      if (!service) {
        await trx.rollback();

        return res.status(404).json({
          success: false,
          message: `Service ${item.service_id} not found`,
        });
      }

      const qty = Number(item.qty);

      if (!Number.isInteger(qty) || qty <= 0) {
        await trx.rollback();

        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than 0",
        });
      }

      const price = Number(service.price);
      const subtotal = price * qty;

      totalAmount += subtotal;

      orderDetails.push({
        service_id: service.id,
        qty,
        price,
        subtotal,
      });
    }

    // Create order
    const [order] = await trx("orders")
      .insert({
        invoice_number: invoiceNumber,
        customer_id,
        employee_id,
        order_date,
        pickup_date,
        status: "Pending",
        total_amount: totalAmount,
        notes,
      })
      .returning("*");

    // Create order details
    for (const detail of orderDetails) {
      await trx("order_details").insert({
        order_id: order.id,
        ...detail,
      });
    }

    await trx.commit();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        ...order,
        details: orderDetails,
      },
    });
  } catch (error) {
    await trx.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const trx = await db.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Measurement",
      "Cutting",
      "Sewing",
      "Finishing",
      "Ready Pickup",
      "Completed",
      "Cancelled",
    ];

    if (!status) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await trx("orders").where("id", id).first();

    if (!order) {
      await trx.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Completed" || order.status === "Cancelled") {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: `Order is already ${order.status}`,
      });
    }

    const statusFlow = {
      Pending: ["Measurement", "Cancelled"],
      Measurement: ["Cutting", "Cancelled"],
      Cutting: ["Sewing", "Cancelled"],
      Sewing: ["Finishing", "Cancelled"],
      Finishing: ["Ready Pickup"],
      "Ready Pickup": ["Completed"],
    };

    const nextStatuses = statusFlow[order.status] || [];

    if (!nextStatuses.includes(status)) {
      await trx.rollback();

      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    const [updatedOrder] = await trx("orders")
      .where("id", id)
      .update({
        status,
        updated_at: trx.fn.now(),
      })
      .returning(["id", "invoice_number", "status", "updated_at"]);

    // Simpan riwayat perubahan status
    await trx("order_status_histories").insert({
      order_id: id,
      status,
    });

    await trx.commit();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    await trx.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

const getOrderStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db("orders").where("id", id).first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const history = await db("order_status_histories")
      .select("id", "status", "created_at")
      .where("order_id", id)
      .orderBy("created_at", "asc");

    res.json({
      success: true,
      data: {
        order_id: id,
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
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStatusHistory,
};
