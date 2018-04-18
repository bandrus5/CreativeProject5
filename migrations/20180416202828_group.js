exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('groups', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('owner').unsigned().notNullable().references('id').inTable('authors');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('groups'),
  ]);
};
