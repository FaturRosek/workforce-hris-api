const db = require("../config/db");

const getCustomers = async (req, res) => {
  try {
    const customers = await db("customers")
      .select(
        "id",
        "customer_code",
        "full_name",
        "phone",
        "email",
        "address",
        "created_at",
      )
      .orderBy("id", "asc");

    res.json({
      success: true,
      data: customers,
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
