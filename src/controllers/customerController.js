const db = require("../config/db");

const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

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

    const offset = (pageNumber - 1) * limitNumber;

    const query = db("customers");

    if (search) {
      query.where(function () {
        this.whereILike("full_name", `%${search}%`)
          .orWhereILike("phone", `%${search}%`)
          .orWhereILike("email", `%${search}%`);
      });
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count("id as total")
      .first();

    const customers = await query
      .clone()
      .select("id", "full_name", "phone", "email", "address", "created_at")
      .orderBy("id", "desc")
      .limit(limitNumber)
      .offset(offset);

    const total = Number(countResult.total || 0);

    res.json({
      success: true,
      data: customers,
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
      message: "Failed to get customers",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await db("customers")
      .select(
        "id",
        "customer_code",
        "full_name",
        "phone",
        "email",
        "address",
        "created_at",
      )
      .where("id", id)
      .first();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get customer",
    });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { customer_code, full_name, phone, email, address } = req.body;

    if (!customer_code || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Customer code and full name are required",
      });
    }

    const [customer] = await db("customers")
      .insert({
        customer_code,
        full_name,
        phone,
        email,
        address,
      })
      .returning([
        "id",
        "customer_code",
        "full_name",
        "phone",
        "email",
        "address",
      ]);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const { customer_code, full_name, phone, email, address } = req.body;

    const existingCustomer = await db("customers").where("id", id).first();

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const [customer] = await db("customers")
      .where("id", id)
      .update({
        customer_code,
        full_name,
        phone,
        email,
        address,
        updated_at: db.fn.now(),
      })
      .returning([
        "id",
        "customer_code",
        "full_name",
        "phone",
        "email",
        "address",
      ]);

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("customers").where("id", id).del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
