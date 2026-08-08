exports.seed = async function (knex) {
  await knex("services").del();

  await knex("services").insert([
    {
      service_name: "Jahit Jas",
      price: 750000,
      estimated_days: 7,
      description: "Pembuatan jas custom",
    },
    {
      service_name: "Jahit Kemeja",
      price: 350000,
      estimated_days: 4,
      description: "Pembuatan kemeja custom",
    },
    {
      service_name: "Permak Celana",
      price: 50000,
      estimated_days: 2,
      description: "Permak ukuran celana",
    },
    {
      service_name: "Permak Kemeja",
      price: 50000,
      estimated_days: 2,
      description: "Permak ukuran kemeja",
    },
    {
      service_name: "Jahit Seragam",
      price: 300000,
      estimated_days: 5,
      description: "Pembuatan seragam custom",
    },
  ]);
};
