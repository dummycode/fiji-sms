var database = require('../../core/database')
var connection = database.getConnection()

const create = async (content, creator) => {
  const results = await connection
    .query(
      'INSERT INTO message(content, created_by, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
      [content, creator],
    )

  return connection.query('SELECT * FROM message WHERE message_id = ?', [
    results.insertId,
  ])
}

module.exports = {
  create,
}
