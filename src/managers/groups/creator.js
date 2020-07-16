const database = require('../../core/database')

const connection = database.getConnection()

const createGroup = async (name) => {
  const results = await connection
    .query(
      'INSERT INTO contact_group (name, created_at) VALUES (?, CURRENT_TIMESTAMP(3))',
      [name],
    )

  return connection.query('SELECT * FROM contact_group WHERE contact_group_id=?', [
    results.insertId,
  ])
}

module.exports = {
  createGroup,
}
