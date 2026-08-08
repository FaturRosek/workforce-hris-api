exports.seed = async function (knex) {
  await knex("payments").del();

  await knex("payments").insert([
    {
      order_id: 1,
      payment_date: "2026-08-08",
      payment_method: "Cash",
      amount: 300000,
      payment_status: "Paid",
    },
    {
      order_id: 2,
      payment_date: "2026-08-08",
      payment_method: "Transfer",
      amount: 350000,
      payment_status: "Paid",
    },
    {
      order_id: 3,
      payment_date: "2026-08-08",
      payment_method: "QRIS",
      amount: 50000,
      payment_status: "Paid",
    },
  ]);
};
