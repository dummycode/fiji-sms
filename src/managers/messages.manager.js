var database = require('../core/database')
var connection = database.getConnection()

var { MessageNotFoundError } = require('../core/errors')

const fetchAllMessages = () => {
  return connection.query('SELECT * FROM message WHERE deleted_at IS NULL')
}

const createMessage = (content, creator) => {
  return connection
    .query(
      'INSERT INTO message(content, created_by, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
      [content, creator],
    )
    .then((results) => {
      return connection.query('SELECT * FROM message WHERE id = ?', [
        results.insertId,
      ])
    })
}

const deleteMesasge = (id) => {
  return connection
    .query('SELECT * FROM message WHERE id=? AND deleted_at IS NULL', [id])
    .then((results) => {
      if (results.length === 0) {
        throw new MessageNotFoundError()
      }
      // Delete the message
      return connection.query(
        'UPDATE message SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ?',
        [id],
      )
    })
}

module.exports = {
  fetchAllMessages,
  createMessage,
  deleteMesasge,
}
