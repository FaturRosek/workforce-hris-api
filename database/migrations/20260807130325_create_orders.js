/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();

    table.string("invoice_number").unique();

    table.integer("customer_id").references("id").inTable("customers");

    table.integer("employee_id").references("id").inTable("employees");

    table.date("order_date");

    table.date("pickup_date");

    table
      .enu("status", [
        "Pending",
        "Measurement",
        "Cutting",
        "Sewing",
        "Finishing",
        "Ready Pickup",
        "Completed",
        "Cancelled",
      ])
      .defaultTo("Pending");

    table.decimal("total_amount", 12, 2);

    table.text("notes");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("orders");
};
