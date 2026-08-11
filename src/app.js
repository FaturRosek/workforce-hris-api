const express = require("express");

const employeeRoutes = require("./routes/employeeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const positionRoutes = require("./routes/positionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const authenticate = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");
const measurementRoutes = require("./routes/measurementRoutes");
const orderStatusHistoryRoutes = require("./routes/orderStatusHistoryRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "MM Tailor API is running",
  });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/dashboard", authenticate, dashboardRoutes);
app.use(
  "/api/dashboard",
  authenticate,
  authorize("Admin", "Staff"),
  dashboardRoutes,
);
app.use("/api/order-status-history", orderStatusHistoryRoutes);

module.exports = app;
