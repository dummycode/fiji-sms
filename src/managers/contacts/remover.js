var database = require('../../core/database')
var connection = database.getConnection()

var {
  ContactNotFoundError,
} = require('../../core/errors')

const deleteContact = async (id) => {
  const results = await connection
    .query('SELECT * FROM contact WHERE contact_id=? AND deleted_at IS NULL', [id])

  if (results.length === 0) {
    throw new ContactNotFoundError()
  }

  // Delete the contact
  return connection.query(
    'UPDATE contact SET deleted_at = CURRENT_TIMESTAMP(3) WHERE contact_id = ?',
    [id],
  )
}

module.exports = {
  deleteContact,
}
