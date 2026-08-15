const db = require("../config/db");

const getServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, is_active } = req.query;

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

    if (is_active !== undefined && !["true", "false"].includes(is_active)) {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    const offset = (pageNumber - 1) * limitNumber;

    const query = db("services");

    if (search) {
      query.where(function () {
        this.whereILike("service_name", `%${search}%`);
      });
    }

    if (is_active !== undefined) {
      query.where("is_active", is_active === "true");
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count("id as total")
      .first();

    const services = await query
      .clone()
      .select(
        "id",
        "service_name",
        "description",
        "price",
        "is_active",
        "created_at",
      )
      .orderBy("id", "desc")
      .limit(limitNumber)
      .offset(offset);

    const total = Number(countResult.total || 0);

    res.json({
      success: true,
      data: services,
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
