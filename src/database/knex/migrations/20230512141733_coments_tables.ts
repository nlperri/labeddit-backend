import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('likes_dislikes')

  await knex.schema.createTable('comments', (table) => {
    table.text('id').primary().notNullable().unique()
    table.text('creator_id').notNullable().references('id').inTable('users')
    table.text('post_id').notNullable().references('id').inTable('posts')
    table.text('content').notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at')
    table.integer('likes')
    table.integer('dislikes')
  })

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
  await knex.schema.dropTableIfExists('comments')
}
