const db = require("../config/db");

const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, position_id } = req.query;

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

    const query = db("employees").leftJoin(
      "positions",
      "employees.position_id",
      "positions.id",
    );

    if (search) {
      query.where(function () {
        this.whereILike("employees.full_name", `%${search}%`)
          .orWhereILike("employees.employee_code", `%${search}%`)
          .orWhereILike("employees.phone", `%${search}%`)
          .orWhereILike("employees.email", `%${search}%`);
      });
    }

    if (status) {
      query.where("employees.status", status);
    }

    if (position_id !== undefined) {
      const positionIdNumber = Number(position_id);

      if (!Number.isInteger(positionIdNumber) || positionIdNumber < 1) {
        return res.status(400).json({
          success: false,
          message: "position_id must be a positive integer",
        });
      }

      query.where("employees.position_id", positionIdNumber);
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count("employees.id as total")
      .first();

    const offset = (pageNumber - 1) * limitNumber;

    const employees = await query
      .clone()
      .select(
        "employees.id",
        "employees.employee_code",
        "employees.full_name",
        "employees.email",
        "employees.phone",
        "employees.position_id",
        "positions.position_name",
        "employees.status",
        "employees.created_at",
        "employees.updated_at",
      )
      .orderBy("employees.id", "desc")
      .limit(limitNumber)
      .offset(offset);

    const total = Number(countResult.total || 0);

    res.json({
      success: true,
      data: employees,
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
      message: "Failed to get employees",
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await db("employees")
      .select(
        "employees.id",
        "employees.employee_code",
        "employees.full_name",
        "employees.email",
        "employees.phone",
        "employees.status",
        "positions.position_name",
      )
      .leftJoin("positions", "employees.position_id", "positions.id")
      .where("employees.id", id)
      .first();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get employee",
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      employee_code,
      full_name,
      email,
      phone,
      password,
      position_id,
      status,
    } = req.body;

    if (!employee_code || !full_name || !email || !password || !position_id) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const [employee] = await db("employees")
      .insert({
        employee_code,
        full_name,
        email,
        phone,
        password,
        position_id,
        status: status || "Active",
      })
      .returning([
        "id",
        "employee_code",
        "full_name",
        "email",
        "phone",
        "position_id",
        "status",
      ]);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employee_code,
      full_name,
      email,
      phone,
      password,
      position_id,
      status,
    } = req.body;

    const employee = await db("employees").where("id", id).first();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updateData = {
      employee_code,
      full_name,
      email,
      phone,
      position_id,
      status,
      updated_at: db.fn.now(),
    };

    if (password) {
      updateData.password = password;
    }

    const [updatedEmployee] = await db("employees")
      .where("id", id)
      .update(updateData)
      .returning([
        "id",
        "employee_code",
        "full_name",
        "email",
        "phone",
        "position_id",
        "status",
      ]);

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("employees").where("id", id).del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
