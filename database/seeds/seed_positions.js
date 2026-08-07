/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Hapus data lama
  await knex("positions").del();

  // Reset auto increment (PostgreSQL)
  await knex.raw(`ALTER SEQUENCE positions_id_seq RESTART WITH 1`);

  // Insert data baru
  await knex("positions").insert([
    {
      position_name: "Owner",
      description: "Business Owner",
    },
    {
      position_name: "Admin",
      description: "System Administrator",
    },
    {
      position_name: "Cashier",
      description: "Handle Payment",
    },
    {
      position_name: "Tailor",
      description: "Sewing Staff",
    },
  ]);
};
