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

const generatePickupNotifications = async (req, res) => {
  try {
    const { days = 3 } = req.query;

    const numberOfDays = Number(days);

    if (
      !Number.isInteger(numberOfDays) ||
      numberOfDays < 0 ||
      numberOfDays > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "Days must be an integer between 0 and 30",
      });
    }

    const today = new Date();

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + numberOfDays);

    const formatDate = (date) => {
      return date.toISOString().slice(0, 10);
    };

    const startDate = formatDate(today);
    const endDateFormatted = formatDate(endDate);

    // Ambil order yang mendekati pickup
    const orders = await db("orders")
      .select(
        "orders.id",
        "orders.invoice_number",
        "orders.pickup_date",
        "orders.status",
        "customers.full_name as customer_name",
      )
      .leftJoin("customers", "orders.customer_id", "customers.id")
      .whereBetween("orders.pickup_date", [startDate, endDateFormatted])
      .whereNotIn("orders.status", ["Completed", "Cancelled"]);

    let created = 0;

    for (const order of orders) {
      // Cegah duplicate notification
      const existingNotification = await db("notifications")
        .where("order_id", order.id)
        .where("type", "pickup_reminder")
        .where("is_read", false)
        .first();

      if (existingNotification) {
        continue;
      }

      await db("notifications").insert({
        user_id: null,
        order_id: order.id,
        type: "pickup_reminder",
        title: "Pickup Reminder",
        message: `Order ${order.invoice_number} untuk ${order.customer_name} dijadwalkan pickup pada ${order.pickup_date}.`,
        is_read: false,
      });

      created++;
    }

    res.json({
      success: true,
      message: "Pickup notifications generated successfully",
      data: {
        period: {
          start_date: startDate,
          end_date: endDateFormatted,
        },
        orders_found: orders.length,
        notifications_created: created,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate pickup notifications",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  generatePickupNotifications,
};
