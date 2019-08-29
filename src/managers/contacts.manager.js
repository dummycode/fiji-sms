var database = require('../core/database')
var connection = database.getConnection()

var {
  ContactNotFoundError,
  ContactAlreadyExistsError,
} = require('../core/errors')

const fetchAllContacts = () => {
  return connection.query('SELECT * FROM contact WHERE deleted_at IS NULL')
}

const createContact = (name, number) => {
  return connection
    .query(
      'SELECT id FROM contact WHERE phone_number=? AND deleted_at IS NULL',
      [number],
    )
    .then((results) => {
      if (results.length !== 0) {
        throw new ContactAlreadyExistsError()
      }
      return connection.query(
        'INSERT INTO contact (name, phone_number, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
        [name, number],
      )
    })
    .then((results) => {
      return connection.query('SELECT * FROM contact WHERE id = ?', [
        results.insertId,
      ])
    })
}

const deleteContact = (id) => {
  return connection
    .query('SELECT * FROM contact WHERE id=? AND deleted_at IS NULL', [id])
    .then((results) => {
      if (results.length === 0) {
        throw new ContactNotFoundError()
      }
      // Delete the contact
      return connection.query(
        'UPDATE contact SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ?',
        [id],
      )
    })
}

module.exports = {
  fetchAllContacts,
  createContact,
  deleteContact,
}
