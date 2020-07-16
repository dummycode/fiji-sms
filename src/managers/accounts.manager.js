var database = require('../core/database')
var connection = database.getConnection()

var {
  AccountNotFoundError,
} = require('../core/errors')

const fetchAllAccounts = () => {
  return connection.query(
    'SELECT * FROM account WHERE deleted_at IS NULL',
  )
}

const createAccount = (name) => {
  return connection
    .query(
      'INSERT INTO account (name, created_at) VALUES (?, CURRENT_TIMESTAMP(3))',
      [name],
    )
    .then((results) => {
      return connection.query(
        'SELECT * FROM account WHERE account_id=?',
        [results.insertId],
      )
    })
}

const deleteAccount = (id) => {
  return connection
    .query(
      'SELECT * FROM account WHERE account_id=? AND deleted_at IS NULL',
      [id],
    )
    .then((results) => {
      if (results.length === 0) {
        throw new AccountNotFoundError()
      }
      // Delete the account
      return connection.query(
        'UPDATE account SET deleted_at=CURRENT_TIMESTAMP(3) WHERE account_id=?',
        [id],
      )
    })
}

module.exports = {
  fetchAllAccounts,
  createAccount,
  deleteAccount,
}
