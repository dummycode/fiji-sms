const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const database = require('../core/database')
const config = require('../core/config')
const accountsManager = require('./accounts.manager')
const {
  UserAlreadyExistsError,
  UserNotFoundError,
  EncryptionFailedError,
  InvalidPasswordError,
  AccountNotFoundError,
} = require('../core/errors')

const connection = database.getConnection()

const fetchUser = (id) => connection.query(
  'SELECT * FROM user WHERE user_id = ? AND deleted_at IS NULL',
  [id],
)

const createUser = async (username, password, email, account) => {
  let results = await connection
    .query('SELECT user_id FROM user WHERE username=? AND deleted_at IS NULL', [
      username,
    ])

  if (results.length !== 0) {
    throw new UserAlreadyExistsError()
  }

  let accountId = account

  // Account not specified, create one now
  if (!account) {
    results = await accountsManager
      .createAccount(username)
      .catch(() => {
        throw new AccountNotFoundError()
      })
    accountId = results[0].account_id
  } else {
    // Ensure the account exists
    results = await accountsManager
      .fetchAccount(accountId)

    if (results.length === 0) {
      throw new AccountNotFoundError()
    }
  }

  return bcrypt
    .hash(password, 8)
    .then((hash) => {
      const passwordHashed = hash

      return connection.query(
        `INSERT INTO user (username, password, email, is_admin, account, created_at)
         VALUES (?, ?, ?, false, ?, CURRENT_TIMESTAMP(3))`,
        [username, passwordHashed, email, accountId],
      )
    })
    .catch((err) => {
      console.log(err)
      throw new EncryptionFailedError()
    })
    .then((insertResults) => connection.query('SELECT * FROM user WHERE user_id = ?', [
      insertResults.insertId,
    ]))
}

const deleteUser = (id) => connection
  .query('SELECT * FROM user WHERE user_id=? AND deleted_at IS NULL', [id])
  .then((results) => {
    if (results.length === 0) {
      throw new UserNotFoundError()
    }
    // Delete the user
    return connection.query(
      'UPDATE user SET deleted_at = CURRENT_TIMESTAMP(3) WHERE user_id = ?',
      [id],
    )
  })

const login = (username, password) => connection
  .query('SELECT * FROM user WHERE username = ? AND deleted_at IS NULL', [
    username,
  ])
  .then((results) => {
    if (results.length === 0) {
      throw new UserNotFoundError()
    }
    const user = results[0]
    return bcrypt
      .compare(password, user.password)
      .then((valid) => {
        if (!valid) {
          throw new InvalidPasswordError()
        }
        const token = jwt.sign(
          { id: user.user_id },
          config.get('auth.secret'),
          {
            expiresIn: config.get('auth.timeout'),
          },
        )
        return token
      })
      .catch((err) => {
        switch (err.constructor) {
          case InvalidPasswordError:
            throw new InvalidPasswordError()
          default:
            throw new EncryptionFailedError()
        }
      })
  })

module.exports = {
  fetchUser,
  createUser,
  login,
  deleteUser,
}
