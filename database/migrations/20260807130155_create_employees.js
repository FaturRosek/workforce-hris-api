/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("employees", (table) => {
    table.increments("id").primary();

    table.string("employee_code", 20).unique().notNullable();

    table.string("full_name", 100).notNullable();

    table.string("email").unique().notNullable();

    table.string("phone", 20);

    table.text("password").notNullable();

    table
      .integer("position_id")
      .unsigned()
      .references("id")
      .inTable("positions")
      .onDelete("RESTRICT");

    table.enu("status", ["Active", "Inactive"]).defaultTo("Active");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("employees");
};
