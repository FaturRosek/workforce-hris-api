exports.seed = async function (knex) {
  await knex("employees").del();

  await knex("employees").insert([
    {
      employee_code: "EMP001",
      full_name: "Andi Pratama",
      email: "andi@mmtailor.com",
      phone: "081234567890",
      password: "temporary_password",
      position_id: 1,
      status: "Active",
    },
    {
      employee_code: "EMP002",
      full_name: "Siti Rahma",
      email: "siti@mmtailor.com",
      phone: "081234567891",
      password: "temporary_password",
      position_id: 2,
      status: "Active",
    },
    {
      employee_code: "EMP003",
      full_name: "Budi Santoso",
      email: "budi@mmtailor.com",
      phone: "081234567892",
      password: "temporary_password",
      position_id: 3,
      status: "Active",
    },
    {
      employee_code: "EMP004",
      full_name: "Dimas Saputra",
      email: "dimas@mmtailor.com",
      phone: "081234567893",
      password: "temporary_password",
      position_id: 4,
      status: "Active",
    },
  ]);
};
