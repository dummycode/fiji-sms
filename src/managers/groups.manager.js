var database = require('../core/database')
var connection = database.getConnection()

var {
  GroupNotFoundError,
  ContactNotFoundError,
  GroupMembershipNotFoundError,
} = require('../core/errors')

const fetchAllGroups = () => {
  return connection.query(
    'SELECT * FROM contact_group WHERE deleted_at IS NULL',
  )
}

const fetch = (groupId) => {
  return connection.query(
    'SELECT * from contact_group WHERE group_id=? AND deleted_at IS NULL', [groupId]
  ).then((results) => {
    if (results.length === 0) {
      throw new GroupNotFoundError()
    }
    return results[0]
  })
}

const createGroup = (name) => {
  return connection
    .query(
      'INSERT INTO contact_group (name, created_at) VALUES (?, CURRENT_TIMESTAMP(3))',
      [name],
    )
    .then((results) => {
      return connection.query(
        'SELECT * FROM contact_group WHERE group_id=?',
        [results.insertId],
      )
    })
}

const deleteGroup = (id) => {
  return connection
    .query(
      'SELECT * FROM contact_group WHERE group_id=? AND deleted_at IS NULL',
      [id],
    )
    .then((results) => {
      if (results.length === 0) {
        throw new GroupNotFoundError()
      }
      // Delete the group
      return connection.query(
        'UPDATE contact_group SET deleted_at=CURRENT_TIMESTAMP(3) WHERE group_id=?',
        [id],
      )
    })
}

const addMember = (groupId, contactId) => {
  return connection
    .query(
      'SELECT * FROM contact_group WHERE group_id=? AND deleted_at IS NULL',
      [groupId],
    )
    .then((results) => {
      if (results.length === 0) {
        throw new GroupNotFoundError()
      }

      return connection.query(
        'SELECT * FROM contact WHERE contact_id=? AND deleted_at IS NULL',
        [contactId],
      )
    })
    .then((results) => {
      if (results.length === 0) {
        throw new ContactNotFoundError()
      }

      return connection.query(
        'INSERT INTO group_membership (group_id, contact_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
        [groupId, contactId],
      )
    })
    .then((results) => {
      return connection.query(
        'SELECT * FROM group_membership WHERE group_membership_id=?',
        [results.insertId],
      )
    }).then((results) => {
      return results[0]
    })
}

const removeMember = (id) => {
  return connection
    .query(
      'SELECT * FROM group_membership WHERE group_membership_id=? AND deleted_at IS NULL',
      [id],
    )
    .then((results) => {
      if (results.length === 0) {
        throw new GroupMembershipNotFoundError()
      }

      return connection.query(
        'UPDATE group_membership SET deleted_at=CURRENT_TIMESTAMP(3) WHERE group_membership_id=?',
        [id],
      )
    })
}

module.exports = {
  fetchAllGroups,
  fetch,
  createGroup,
  deleteGroup,
  addMember,
  removeMember,
}
