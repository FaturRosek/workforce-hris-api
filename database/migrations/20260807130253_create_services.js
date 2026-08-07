/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("services", (table) => {
    table.increments("id").primary();

    table.string("service_name");

    table.decimal("price", 12, 2);

    table.integer("estimated_days");

    table.text("description");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("services");
};
