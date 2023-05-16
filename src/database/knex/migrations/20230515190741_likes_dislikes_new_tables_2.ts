import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('likes_dislikes', (table) => {
    table.text('user_id').notNullable().references('id').inTable('users')
    table.text('content_id').references('provider_id').inTable('comments_posts')
    table.integer('like').notNullable()
    table.primary(['user_id', 'content_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('likes_dislikes')
  await knex.schema.dropTableIfExists('comments_posts')
}
