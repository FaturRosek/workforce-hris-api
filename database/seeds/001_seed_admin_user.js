const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  const existingUser = await knex("users").where("username", "admin").first();

  if (existingUser) {
    console.log("Admin user already exists");
    return;
  }

  const password = await bcrypt.hash("admin123", 10);

  await knex("users").insert({
    username: "admin",
    password,
    role: "Admin",
  });

  console.log("Admin user created");
};
