var database = require('../core/database')
var connection = database.getConnection()

var { GroupNotFoundError } = require('../core/errors')

const fetchAllGroups = () => {
  return connection.query(
    'SELECT * FROM contact_group WHERE deleted_at IS NULL',
  )
}

const createGroup = (name) => {
  return connection
    .query(
      'INSERT INTO contact_group (name, created_at) VALUES (?, CURRENT_TIMESTAMP(3))',
      [name],
    )
    .then((results) => {
      return connection.query(
        'SELECT * FROM contact_group WHERE contact_group_id = ?',
        [results.insertId],
      )
    })
}

const deleteGroup = (id) => {
  return connection
    .query(
      'SELECT * FROM contact_group WHERE contact_group_id=? AND deleted_at IS NULL',
      [id],
    )
    .then((results) => {
      if (results.length === 0) {
        throw new GroupNotFoundError()
      }
      // Delete the group
      return connection.query(
        'UPDATE contact_group SET deleted_at = CURRENT_TIMESTAMP(3) WHERE contact_group_id = ?',
        [id],
      )
    })
}

module.exports = {
  fetchAllGroups,
  createGroup,
  deleteGroup,
}
