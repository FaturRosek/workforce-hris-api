const express = require("express");

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "MM Tailor API is running",
  });
});

app.use("/api/employees", employeeRoutes);

module.exports = app;
