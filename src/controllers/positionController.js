const db = require("../config/db");

const getPositions = async (req, res) => {
  try {
    const positions = await db("positions")
      .select("id", "position_name", "description", "created_at")
      .orderBy("id", "asc");

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get positions",
    });
  }
};

const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;

    const position = await db("positions")
      .select("id", "position_name", "description", "created_at")
      .where("id", id)
      .first();

    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    res.json({
      success: true,
      data: position,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get position",
    });
  }
};

const createPosition = async (req, res) => {
  try {
    const { position_name, description } = req.body;

    if (!position_name) {
      return res.status(400).json({
        success: false,
        message: "Position name is required",
      });
    }

    const [position] = await db("positions")
      .insert({
        position_name,
        description,
      })
      .returning(["id", "position_name", "description"]);

    res.status(201).json({
      success: true,
      message: "Position created successfully",
      data: position,
    });
  } catch (error) {
    console.error(error);

    // Karena position_name UNIQUE
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Position already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create position",
    });
  }
};

const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position_name, description } = req.body;

    const existingPosition = await db("positions").where("id", id).first();

    if (!existingPosition) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    if (!position_name) {
      return res.status(400).json({
        success: false,
        message: "Position name is required",
      });
    }

    const [position] = await db("positions")
      .where("id", id)
      .update({
        position_name,
        description,
        updated_at: db.fn.now(),
      })
      .returning(["id", "position_name", "description"]);

    res.json({
      success: true,
      message: "Position updated successfully",
      data: position,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Position already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update position",
    });
  }
};

const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db("positions").where("id", id).del();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    res.json({
      success: true,
      message: "Position deleted successfully",
    });
  } catch (error) {
    console.error(error);

    // Position masih digunakan employee
    if (error.code === "23503") {
      return res.status(409).json({
        success: false,
        message:
          "Position cannot be deleted because it is still used by employees",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete position",
    });
  }
};

module.exports = {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
};
