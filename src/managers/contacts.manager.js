var database = require('../core/database')
var creator = require('./contacts/creator.js')
var remover = require('./contacts/remover.js')

var connection = database.getConnection()

var {
  ContactNotFoundError,
  ContactAlreadyExistsError,
  GroupNotFoundError,
} = require('../core/errors')

const fetchAllContacts = () => {
  return connection.query('SELECT * FROM contact WHERE deleted_at IS NULL')
}

const fetchContact = async (id) => {
  const results = await connection
    .query('SELECT * FROM contact WHERE contact_id=? AND deleted_at IS NULL', [id])

  if (results.length === 0) {
    throw new ContactNotFoundError()
  }

  return results
}

const fetchContactsForGroup = (groupId) => {
  return connection.query(
    `SELECT * FROM (group_membership LEFT JOIN contact USING (contact_id))
     WHERE contact_group_id=?
       AND group_membership.deleted_at IS NULL
       AND contact.deleted_at IS NULL`,
    [groupId]
  )
}

const createContact = creator.createContact
const deleteContact = remover.deleteContact

module.exports = {
  fetchAllContacts,
  fetchContact,
  fetchContactsForGroup,
  createContact,
  deleteContact,
}
