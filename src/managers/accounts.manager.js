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

const createAccount = async (name) => {
  const results = await connection
    .query(
      'INSERT INTO account (name, created_at) VALUES (?, CURRENT_TIMESTAMP(3))',
      [name],
    )

  const user = await connection.query(
    'SELECT * FROM account WHERE account_id=?',
    [results.insertId],
  )

  return user
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
