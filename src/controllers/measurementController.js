const db = require("../config/db");

const createMeasurement = async (req, res) => {
  try {
    const { order_id } = req.params;

    const {
      chest,
      waist,
      hip,
      shoulder,
      sleeve_length,
      shirt_length,
      neck,
      armhole,
      notes,
    } = req.body;

    // Cek order
    const order = await db("orders").where("id", order_id).first();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Cek apakah measurement sudah ada
    const existingMeasurement = await db("measurements")
      .where("order_id", order_id)
      .first();

    if (existingMeasurement) {
      return res.status(409).json({
        success: false,
        message: "Measurement for this order already exists",
      });
    }

    const [measurement] = await db("measurements")
      .insert({
        order_id,
        chest,
        waist,
        hip,
        shoulder,
        sleeve_length,
        shirt_length,
        neck,
        armhole,
        notes,
      })
      .returning("*");

    res.status(201).json({
      success: true,
      message: "Measurement created successfully",
      data: measurement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create measurement",
    });
  }
};

const getMeasurementByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const measurement = await db("measurements")
      .select(
        "measurements.*",
        "orders.invoice_number",
        "customers.full_name as customer_name",
        "customers.phone as customer_phone",
      )
      .leftJoin("orders", "measurements.order_id", "orders.id")
      .leftJoin("customers", "orders.customer_id", "customers.id")
      .where("measurements.order_id", order_id)
      .first();

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Measurement not found",
      });
    }

    res.json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get measurement",
    });
  }
};

const updateMeasurement = async (req, res) => {
  try {
    const { order_id } = req.params;

    const {
      chest,
      waist,
      hip,
      shoulder,
      sleeve_length,
      shirt_length,
      neck,
      armhole,
      notes,
    } = req.body;

    const existingMeasurement = await db("measurements")
      .where("order_id", order_id)
      .first();

    if (!existingMeasurement) {
      return res.status(404).json({
        success: false,
        message: "Measurement not found",
      });
    }

    const [measurement] = await db("measurements")
      .where("order_id", order_id)
      .update({
        chest,
        waist,
        hip,
        shoulder,
        sleeve_length,
        shirt_length,
        neck,
        armhole,
        notes,
        updated_at: db.fn.now(),
      })
      .returning("*");

    res.json({
      success: true,
      message: "Measurement updated successfully",
      data: measurement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update measurement",
    });
  }
};

module.exports = {
  createMeasurement,
  getMeasurementByOrder,
  updateMeasurement,
};
