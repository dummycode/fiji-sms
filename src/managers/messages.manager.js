const database = require('../core/database')
const sender = require('./messages/sender')
const creator = require('./messages/creator')

const { MessageNotFoundError } = require('../core/errors')

const connection = database.getConnection()

const send = sender.send

const fetchAllMessages = () => {
  return connection.query(
    'SELECT * FROM (message LEFT JOIN user ON user_id = created_by) WHERE message.deleted_at IS NULL ORDER BY message.created_at DESC',
  )
}

const createMessage = creator.create

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
  send,
  fetchAllMessages,
  createMessage,
  deleteMesasge,
}
