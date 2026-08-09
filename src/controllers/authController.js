const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await db("users")
      .select(
        "users.id",
        "users.username",
        "users.password",
        "users.role",
        "users.employee_id",
        "employees.full_name as employee_name",
      )
      .leftJoin("employees", "users.employee_id", "employees.id")
      .where("users.username", username)
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        employee_id: user.employee_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          employee_id: user.employee_id,
          employee_name: user.employee_name,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await db("users")
      .select(
        "users.id",
        "users.username",
        "users.role",
        "users.employee_id",
        "employees.full_name as employee_name",
        "employees.email as employee_email",
        "employees.phone as employee_phone",
      )
      .leftJoin("employees", "users.employee_id", "employees.id")
      .where("users.id", req.user.id)
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

const assignEmployee = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const employee = await db("employees").where("id", employee_id).first();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const [user] = await db("users")
      .where("id", req.params.id)
      .update({
        employee_id,
        updated_at: db.fn.now(),
      })
      .returning(["id", "username", "role", "employee_id"]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Employee assigned successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign employee",
    });
  }
};

module.exports = {
  login,
  getMe,
  assignEmployee,
};
