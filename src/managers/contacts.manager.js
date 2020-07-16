var database = require('../core/database')
var creator = require('./contacts/creator.js')

var connection = database.getConnection()

var {
  ContactNotFoundError,
  ContactAlreadyExistsError,
  GroupNotFoundError,
} = require('../core/errors')

const fetchAllContacts = () => {
  return connection.query('SELECT * FROM contact WHERE deleted_at IS NULL')
}

const fetchContact = (id) => {
  return connection
    .query('SELECT * FROM contact WHERE id=? AND deleted_at IS NULL', [id])
    .then((results) => {
      if (results.length === 0) {
        throw new ContactNotFoundError()
      }
      return results
    })
}

const fetchContactsForGroup = (groupId) => {
  return connection.query('SELECT * FROM (group_membership JOIN contact) WHERE group_id=? AND group_membership.deleted_at IS NULL', [groupId])
}

const createContact = creator.createContact

const deleteContact = (id) => {
  return connection
    .query('SELECT * FROM contact WHERE contact_id=? AND deleted_at IS NULL', [id])
    .then((results) => {
      if (results.length === 0) {
        throw new ContactNotFoundError()
      }
      // Delete the contact
      return connection.query(
        'UPDATE contact SET deleted_at = CURRENT_TIMESTAMP(3) WHERE contact_id = ?',
        [id],
      )
    })
}

module.exports = {
  fetchAllContacts,
  fetchContact,
  fetchContactsForGroup,
  createContact,
  deleteContact,
}
