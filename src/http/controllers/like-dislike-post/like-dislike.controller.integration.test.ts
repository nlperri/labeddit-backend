import supertest from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { execSync } from 'child_process'
import { Db } from '../../../database/base-database'
import { hash } from 'bcryptjs'
import { KnexUsersRepository } from '../../../repositories/knex/users-knex-repository'
import { KnexPostsRepository } from '../../../repositories/knex/posts-knex-repository'

class FakeDb extends Db {
  constructor() {
    super()
  }
  async reset() {
    await Db.connection('likes_dislikes').del()
    await Db.connection('posts').del()
    await Db.connection('users').del()
  }
}

describe('Like Dislike Post Controller', async () => {
  let server: supertest.SuperTest<supertest.Test>
  const usersRepository = new KnexUsersRepository()
  const postsRepository = new KnexPostsRepository()
  let authToken

  const user = {
    name: 'test',
    password: 'testtest',
    email: 'test@gmail.com',
  }

  async function getToken(email: string, password: string): Promise<string> {
    const res = await server.post('/users/authenticate').send({
      email,
      password,
    })

    const token = res.body

    return token
  }

  beforeAll(() => {
    execSync('NODE_ENV=test && npm run knex:migrate')
    server = supertest(app)
  })

  afterAll(() => {
    execSync('NODE_ENV=test && npm run knex:rollback')
  })

  afterEach(async () => {
    const db = new FakeDb()
    await db.reset()
  })

  it('should return 401 not authorized when no token is provided', async () => {
    await server
      .put('/posts/:id/like')
      .expect(401)
      .then((response) => {
        expect(response.body).toBe('Not authorizated')
      })
  })

  it('should return 400 bad request when no body is provided', async () => {
    const userWithPost = await usersRepository.create({
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
    })

    const userWithoutPost = await usersRepository.create({
      name: 'some-name',
      email: 'someemail@email.com',
      password_hash: await hash('123123', 6),
    })

    authToken = await getToken(userWithoutPost.email, '123123')

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await server
      .put(`/posts/${post.id}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Validation error')
      })
  })

  it('should return 404 not found when receive invalid post id', async () => {
    const userWithoutPost = await usersRepository.create({
      name: 'some-name',
      email: 'someemail@email.com',
      password_hash: await hash('123123', 6),
    })

    authToken = await getToken(userWithoutPost.email, '123123')

    const wrongId = 'wrong-id'

    await server
      .put(`/posts/${wrongId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        like: true,
      })
      .expect(404)
      .then((response) => {
        expect(response.body).toBe('Resource not found')
      })
  })

  it('should like/dislike a post when receive a valid token, valid id param and properly body', async () => {
    const userWithPost = await usersRepository.create({
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
    })

    const userWithoutPost = await usersRepository.create({
      name: 'some-name',
      email: 'someemail@email.com',
      password_hash: await hash('123123', 6),
    })

    authToken = await getToken(userWithoutPost.email, '123123')

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await server
      .put(`/posts/${post.id}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        like: true,
      })
      .expect(204)
  })
})
