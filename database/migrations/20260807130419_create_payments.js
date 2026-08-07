/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();

    table.integer("order_id").references("id").inTable("orders");

    table.date("payment_date");

    table.enu("payment_method", ["Cash", "Transfer", "QRIS"]);

    table.decimal("amount", 12, 2);

    table.enu("payment_status", ["Pending", "Paid"]).defaultTo("Pending");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("payments");
};
