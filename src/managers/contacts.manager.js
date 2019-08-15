var database = require('../core/database')
var connection = database.getConnection()

var { ContactNotFound, ContactAlreadyExists } = require('../core/errors')

const fetchAllContacts = () => {
  return connection.query('SELECT * FROM contact WHERE deleted_at IS NULL')
}

const createContact = (name, number) => {
  return connection
    .query(
      'INSERT INTO contact (name, phone_number, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
      [name, number],
    )
    .then((results) => {
      return connection.query('SELECT * FROM contact WHERE id = ?', [
        results.insertId,
      ])
    })
}

module.exports = {
  fetchAllContacts,
  createContact,
}
