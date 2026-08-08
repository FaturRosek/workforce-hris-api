const db = require("../config/db");

const getServices = async (req, res) => {
  try {
    const services = await db("services")
      .select(
        "id",
        "service_name",
        "price",
        "estimated_days",
        "description",
        "created_at",
      )
      .orderBy("id", "asc");

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get services",
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await db("services")
      .select(
        "id",
        "service_name",
        "price",
        "estimated_days",
        "description",
        "created_at",
      )
      .where("id", id)
      .first();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get service",
    });
  }
};

const createService = async (req, res) => {
  try {
    const { service_name, price, estimated_days, description } = req.body;

    if (!service_name || price === undefined || !estimated_days) {
      return res.status(400).json({
        success: false,
        message: "Service name, price, and estimated days are required",
      });
    }

    const [service] = await db("services")
      .insert({
        service_name,
        price,
        estimated_days,
        description,
      })
      .returning([
        "id",
        "service_name",
        "price",
        "estimated_days",
        "description",
      ]);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const { service_name, price, estimated_days, description } = req.body;

    const existingService = await db("services").where("id", id).first();

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const [service] = await db("services")
      .where("id", id)
      .update({
        service_name,
        price,
        estimated_days,
        description,
        updated_at: db.fn.now(),
      })
      .returning([
        "id",
        "service_name",
        "price",
        "estimated_days",
        "description",
      ]);

    res.json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("services").where("id", id).del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
