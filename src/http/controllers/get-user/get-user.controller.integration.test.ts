import supertest from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { execSync } from 'child_process'
import { Db } from '../../../database/base-database'
import { hash } from 'bcryptjs'
import { KnexUsersRepository } from '../../../repositories/knex/users-knex-repository'

class FakeDb extends Db {
  constructor() {
    super()
  }
  async reset() {
    await Db.connection('likes_dislikes').del()
    await Db.connection('comments_posts').del()
    await Db.connection('posts').del()
    await Db.connection('users').del()
  }
}

describe('Get User Controller', async () => {
  let server: supertest.SuperTest<supertest.Test>
  const usersRepository = new KnexUsersRepository()

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
      .get('/users/:id')
      .expect(401)
      .then((response) => {
        expect(response.body).toBe('Not authorizated')
      })
  })

  it('should receive user', async () => {
    const createdUser = await usersRepository.create({
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
    })

    authToken = await getToken(user.email, user.password)

    await server
      .get(`/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
          }),
        )
      })
  })
})
