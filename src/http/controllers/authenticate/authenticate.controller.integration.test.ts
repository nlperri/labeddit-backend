import supertest from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { execSync } from 'child_process'
import { Db } from '../../../database/base-database'
import { KnexUsersRepository } from '../../../repositories/knex/users-knex-repository'
import { hash } from 'bcryptjs'

class FakeDb extends Db {
  constructor() {
    super()
  }
  async reset() {
    await Db.connection('users').del()
  }
}

describe('Authenticate Controller', async () => {
  let server: supertest.SuperTest<supertest.Test>
  const usersRepository = new KnexUsersRepository()
  const user = {
    name: 'test',
    password: 'testtest',
    email: 'test@gmail.com',
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

  it('should return 400 bad request when no body is provided', async () => {
    await server
      .post('/users/authenticate')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Validation error')
      })
  })

  it('should receive a token to authenticate a user when receive a properly body', async () => {
    await usersRepository.create({
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
    })

    await server
      .post('/users/authenticate')
      .send({
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        expect(response.body).toEqual(expect.any(String))
      })
  })

  it('should return status code 405 user not allowed when receive invalid e-mail', async () => {
    await usersRepository.create({
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
    })

    await server
      .post('/users/authenticate')
      .send({
        email: 'some-email@email.com',
        password: user.password,
      })
      .expect(405)
      .then((response) => {
        expect(response.body).toBe('Method not allowed')
      })
  })

  it('should return status code 405 user not allowed when receive invalid password', async () => {
    await server
      .post('/users/authenticate')
      .send({
        email: user.email,
        password: 'some-password',
      })
      .expect(405)
      .then((response) => {
        expect(response.body).toBe('Method not allowed')
      })
  })
})
