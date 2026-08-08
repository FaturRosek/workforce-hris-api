exports.seed = async function (knex) {
  await knex("positions").del();

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
      description: "Handle customer payments",
    },
    {
      position_name: "Tailor",
      description: "Handle tailoring and sewing",
    },
  ]);
};
