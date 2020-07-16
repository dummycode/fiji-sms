var database = require('../../core/database')
var connection = database.getConnection()

var {
  ContactAlreadyExistsError,
} = require('../../core/errors')

const createContact = async (name, number) => {
  const contactExists = await connection
    .query(
      'SELECT contact_id FROM contact WHERE phone_number=? AND deleted_at IS NULL',
      [number],
    )

  if (contactExists.length !== 0) {
    throw new ContactAlreadyExistsError()
  }

  const results = await connection.query(
    'INSERT INTO contact (name, phone_number, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
    [name, number],
  )

  return connection.query('SELECT * FROM contact WHERE contact_id=?', [
    results.insertId,
  ])
}

module.exports = {
  createContact,
}
