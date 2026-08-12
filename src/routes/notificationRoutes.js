const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
} = require("../controllers/notificationController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getNotifications,
);

router.get(
  "/unread-count",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  getUnreadCount,
);

router.put(
  "/:id/read",
  authenticate,
  authorize("Admin", "Staff", "Tailor"),
  markAsRead,
);

module.exports = router;
