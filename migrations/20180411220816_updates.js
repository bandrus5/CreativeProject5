exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('updates', function(table) {
      table.increments('id').primary();
      table.string('type');
      table.string('old');
      table.string('new');
      table.dateTime('updated');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('authors');
      table.integer('story_id').unsigned().notNullable().references('id').inTable('stories');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('updates'),
  ]);
};
