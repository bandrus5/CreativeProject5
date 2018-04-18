exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('stories', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('link');
      table.string('status');
      table.string('genre');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('authors');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('stories'),
  ]);
};
