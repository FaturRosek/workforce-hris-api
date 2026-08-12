const db = require("../config/db");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await db("notifications")
      .select(
        "notifications.id",
        "notifications.order_id",
        "notifications.type",
        "notifications.title",
        "notifications.message",
        "notifications.is_read",
        "notifications.created_at",
      )
      .where(function () {
        this.where("notifications.user_id", userId).orWhereNull(
          "notifications.user_id",
        );
      })
      .orderBy("notifications.created_at", "desc");

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db("notifications")
      .where(function () {
        this.where("user_id", userId).orWhereNull("user_id");
      })
      .where("is_read", false)
      .count("id as total")
      .first();

    res.json({
      success: true,
      data: {
        unread: Number(result.total || 0),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get unread notification count",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await db("notifications")
      .where("id", id)
      .where(function () {
        this.where("user_id", userId).orWhereNull("user_id");
      })
      .first();

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const [updatedNotification] = await db("notifications")
      .where("id", id)
      .update({
        is_read: true,
        updated_at: db.fn.now(),
      })
      .returning([
        "id",
        "order_id",
        "type",
        "title",
        "message",
        "is_read",
        "updated_at",
      ]);

    res.json({
      success: true,
      message: "Notification marked as read",
      data: updatedNotification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
};
