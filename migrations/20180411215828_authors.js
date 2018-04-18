exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('authors', function(table) {
      table.increments('id').primary();
      table.string('hash');
      table.string('username');
      table.string('name');
      table.string('gender');
      table.string('location');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('authors'),
  ]);
};
