var database = require('../core/database')
var connection = database.getConnection()

var { MessageNotFoundError } = require('../core/errors')

const fetchAllMessages = () => {
  return connection.query(
    'SELECT * FROM (message LEFT JOIN user ON user_id = created_by) WHERE message.deleted_at IS NULL ORDER BY message.created_at DESC',
  )
}

const createMessage = (content, creator) => {
  return connection
    .query(
      'INSERT INTO message(content, created_by, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
      [content, creator],
    )
    .then((results) => {
      return connection.query('SELECT * FROM message WHERE message_id = ?', [
        results.insertId,
      ])
    })
}

const deleteMesasge = (id) => {
  return connection
    .query('SELECT * FROM message WHERE message_id=? AND deleted_at IS NULL', [
      id,
    ])
    .then((results) => {
      if (results.length === 0) {
        throw new MessageNotFoundError()
      }
      // Delete the message
      return connection.query(
        'UPDATE message SET deleted_at = CURRENT_TIMESTAMP(3) WHERE message_id = ?',
        [id],
      )
    })
}

module.exports = {
  fetchAllMessages,
  createMessage,
  deleteMesasge,
}
