const express = require("express");

const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
} = require("../controllers/positionController");

const router = express.Router();

router.get("/", getPositions);

router.get("/:id", getPositionById);

router.post("/", createPosition);

router.put("/:id", updatePosition);

router.delete("/:id", deletePosition);

module.exports = router;
