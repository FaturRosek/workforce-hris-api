/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("order_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    table.string("type", 50).notNullable();

    table.string("title", 150).notNullable();

    table.text("message").notNullable();

    table.boolean("is_read").notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("notifications");
};
