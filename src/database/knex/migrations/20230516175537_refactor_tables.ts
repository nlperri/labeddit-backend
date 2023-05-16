import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('likes_dislikes')
  await knex.schema.dropTableIfExists('comments_posts')
  await knex.schema.dropTableIfExists('comments')
  await knex.schema.dropTableIfExists('posts')
  await knex.schema.dropTableIfExists('users')

  await knex.schema.createTable('users', (table) => {
    table.text('id').primary().notNullable().unique()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.text('role').notNullable()
    table.text('created_at').notNullable()
  })

  await knex.schema.createTable('posts', (table) => {
    table.text('id').primary().notNullable().unique()
    table
      .text('creator_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.text('content').notNullable()
    table.integer('likes')
    table.integer('dislikes')
    table.text('created_at').notNullable()
    table.text('updated_at')
  })

  await knex.schema.createTable('comments', (table) => {
    table.text('id').primary().notNullable().unique()
    table
      .text('creator_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .text('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    table.text('content').notNullable()
    table.dateTime('created_at').notNullable()
    table.dateTime('updated_at')
    table.integer('likes')
    table.integer('dislikes')
  })

  await knex.schema.createTable('comments_posts', (table) => {
    table
      .text('post_id')
      .nullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE')
    table
      .text('comment_id')
      .nullable()
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE')
    table.primary(['post_id', 'comment_id'])
  })

  await knex.schema.createTable('likes_dislikes', (table) => {
    table
      .text('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.text('post_id').nullable()
    table.text('comment_id').nullable()
    table.primary(['user_id', 'post_id', 'comment_id'])
    table
      .foreign(['post_id', 'comment_id'])
      .references(['post_id', 'comment_id'])
      .inTable('comments_posts')
      .onDelete('CASCADE')
    table.integer('like').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('likes_dislikes')
  await knex.schema.dropTableIfExists('comments_posts')
  await knex.schema.dropTableIfExists('comments')
  await knex.schema.dropTableIfExists('posts')
  await knex.schema.dropTableIfExists('users')
}
