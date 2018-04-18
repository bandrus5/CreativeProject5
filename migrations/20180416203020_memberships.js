exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('memberships', function(table) {
      table.increments('id').primary();
      table.integer('author').unsigned().notNullable().references('id').inTable('authors');
      table.integer('group').unsigned().notNullable().references('id').inTable('groups');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('groups'),
  ]);
};
