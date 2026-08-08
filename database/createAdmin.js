require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../src/config/db");

const createAdmin = async () => {
  try {
    const existingUser = await db("users").where("username", "admin").first();

    if (existingUser) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const password = await bcrypt.hash("admin123", 10);

    await db("users").insert({
      username: "admin",
      password,
      role: "Admin",
    });

    console.log("Admin user created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
