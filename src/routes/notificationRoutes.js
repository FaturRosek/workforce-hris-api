const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  generatePickupNotifications,
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

router.post(
  "/generate-pickup",
  authenticate,
  authorize("Admin", "Staff"),
  generatePickupNotifications,
);

module.exports = router;
