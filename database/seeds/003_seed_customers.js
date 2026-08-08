exports.seed = async function (knex) {
  await knex("customers").del();

  await knex("customers").insert([
    {
      customer_code: "CUS001",
      full_name: "Fajar Hidayat",
      phone: "081300000001",
      email: "fajar@gmail.com",
      address: "Bangkalan",
    },
    {
      customer_code: "CUS002",
      full_name: "Rina Wulandari",
      phone: "081300000002",
      email: "rina@gmail.com",
      address: "Surabaya",
    },
    {
      customer_code: "CUS003",
      full_name: "Ahmad Fauzi",
      phone: "081300000003",
      email: "ahmad@gmail.com",
      address: "Madura",
    },
  ]);
};
