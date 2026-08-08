exports.seed = async function (knex) {
  await knex("order_details").del();

  await knex("order_details").insert([
    {
      order_id: 1,
      service_id: 1,
      qty: 1,
      price: 750000,
      subtotal: 750000,
    },
    {
      order_id: 2,
      service_id: 2,
      qty: 1,
      price: 350000,
      subtotal: 350000,
    },
    {
      order_id: 3,
      service_id: 3,
      qty: 1,
      price: 50000,
      subtotal: 50000,
    },
  ]);
};
