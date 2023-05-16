import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('likes_dislikes')
  await knex.schema.dropTableIfExists('comments_posts')

  await knex.schema.createTable('comments_posts', (table) => {
    table.text('id').primary().notNullable().unique()
    table.text('provider_id').notNullable()
    table.boolean('is_post').notNullable()
    table
      .foreign('provider_id')
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    table
      .foreign('provider_id')
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comments_posts')
}
