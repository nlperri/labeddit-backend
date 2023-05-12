export default {
  client: 'sqlite3',
  connection: {
    filename:
      process.env.NODE_ENV != 'test' ? '../labeddit.db' : '../labeddit-test.db',
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
}
