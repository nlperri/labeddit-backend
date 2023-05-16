import { knex } from 'knex'
import { env } from '../env'

const DB_TEST_PATH = env.NODE_ENV === 'test'
const integrationTestDbPath = './src/database/labeddit-test.db'
export abstract class Db {
  protected static connection = knex({
    client: 'sqlite3',
    connection: {
      filename: DB_TEST_PATH ? integrationTestDbPath : env.DB_FILE_PATH,
    },
    useNullAsDefault: true,

    pool: {
      min: 0,
      max: 1,
      afterCreate: (conn: any, cb: any) => {
        conn.run('PRAGMA foreign_keys = ON', cb)
      },
    },

    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
  })
}
