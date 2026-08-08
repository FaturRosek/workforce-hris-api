const express = require("express");

const employeeRoutes = require("./routes/employeeRoutes");
const customerRoutes = require("./routes/customerRoutes");
const positionRoutes = require("./routes/positionRoutes");

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

module.exports = app;
