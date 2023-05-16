import supertest from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { execSync } from 'child_process'
import { Db } from '../../../database/base-database'

class FakeDb extends Db {
  async reset() {
    await Db.connection('users').del()
  }
}

describe('Register Controller', () => {
  let server: supertest.SuperTest<supertest.Test>

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
    app.removeAllListeners()
  })

  afterEach(async () => {
    const db = new FakeDb()
    await db.reset()
  })

  it('should return status code 400 bad request when no body is provided', async () => {
    await server
      .post('/users/register')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Validation error')
      })
  })

  it('should register a new user when receive a properly body', async () => {
    await server
      .post('/users/register')
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBeDefined()
        expect(response.body.name).toBe('test')
        expect(response.body.email).toBe('test@gmail.com')
      })
  })
  it('should return status code 409 conflict when create user with same email', async () => {
    const userThatAlreadyExists = user

    await server.post('/users/register').send(user)

    await server
      .post('/users/register')
      .send(userThatAlreadyExists)
      .expect(409)
      .then((response) => {
        expect(response.body).toBe('E-mail already exists')
      })
  })
})
