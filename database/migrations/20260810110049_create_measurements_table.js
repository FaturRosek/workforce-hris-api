exports.up = function (knex) {
  return knex.schema.createTable("measurements", function (table) {
    table.increments("id").primary();

    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .unique()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    table.decimal("chest", 8, 2);
    table.decimal("waist", 8, 2);
    table.decimal("hip", 8, 2);
    table.decimal("shoulder", 8, 2);
    table.decimal("sleeve_length", 8, 2);
    table.decimal("shirt_length", 8, 2);
    table.decimal("neck", 8, 2);
    table.decimal("armhole", 8, 2);

    table.text("notes");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("measurements");
};
