/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();

    table.string("customer_code", 20).unique();

    table.string("full_name", 100).notNullable();

    table.string("phone", 20);

    table.string("email");

    table.text("address");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("customers");
};
