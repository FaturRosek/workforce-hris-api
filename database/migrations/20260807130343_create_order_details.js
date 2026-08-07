/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("order_details", (table) => {
    table.increments("id").primary();

    table
      .integer("order_id")
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    table.integer("service_id").references("id").inTable("services");

    table.integer("qty").defaultTo(1);

    table.decimal("price", 12, 2);

    table.decimal("subtotal", 12, 2);

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("order_details");
};
