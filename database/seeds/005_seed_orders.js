exports.seed = async function (knex) {
  await knex("orders").del();

  await knex("orders").insert([
    {
      invoice_number: "INV-20260808-001",
      customer_id: 1,
      employee_id: 4,
      order_date: "2026-08-08",
      pickup_date: "2026-08-15",
      status: "Sewing",
      total_amount: 750000,
      notes: "Jas warna hitam, model slim fit",
    },
    {
      invoice_number: "INV-20260808-002",
      customer_id: 2,
      employee_id: 4,
      order_date: "2026-08-08",
      pickup_date: "2026-08-12",
      status: "Measurement",
      total_amount: 350000,
      notes: "Kemeja putih lengan panjang",
    },
    {
      invoice_number: "INV-20260808-003",
      customer_id: 3,
      employee_id: 4,
      order_date: "2026-08-08",
      pickup_date: "2026-08-10",
      status: "Ready Pickup",
      total_amount: 50000,
      notes: "Permak celana bagian pinggang",
    },
  ]);
};
