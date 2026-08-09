const express = require("express");

const {
  login,
  getMe,
  assignEmployee,
} = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.put(
  "/users/:id/employee",
  authenticate,
  authorize("Admin"),
  assignEmployee,
);

module.exports = router;
