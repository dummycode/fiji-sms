var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var database = require('../core/database')
var connection = database.getConnection()
var config = require('../core/config')
var accountsManager = require('./accounts.manager')

var {
  UserAlreadyExistsError,
  UserNotFoundError,
  EncryptionFailedError,
  InvalidPasswordError,
  AccountNotFoundError,
} = require('../core/errors')

const fetchUser = (id) => {
  return connection.query(
    'SELECT * FROM user WHERE user_id = ? AND deleted_at IS NULL',
    [id],
  )
}

const createUser = async (username, password, email, account) => {
  const results = await connection
    .query('SELECT user_id FROM user WHERE username=? AND deleted_at IS NULL', [
      username,
    ])

  if (results.length !== 0) {
    throw new UserAlreadyExistsError()
  }

  // Account not specified, create one now
  if (!account) {
    const results = await accountsManager
      .createAccount(username)
      .catch((err) => {
        throw new AccountNotFoundError()
      })
    account = results[0].account_id
  }

  return bcrypt
    .hash(password, 8)
    .then((hash) => {
      password = hash

      return connection.query(
        `INSERT INTO user (username, password, email, is_admin, account, created_at)
         VALUES (?, ?, ?, false, ?, CURRENT_TIMESTAMP(3))`,
        [username, password, email, account],
      )
    })
    .catch((err) => {
      console.log(err)
      throw new EncryptionFailedError()
    })
    .then((results) => {
      return connection.query('SELECT * FROM user WHERE user_id = ?', [
        results.insertId,
      ])
    })
}

const deleteUser = (id) => {
  return connection
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
}

const login = (username, password) => {
  return connection
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
              return
            default:
              throw new EncryptionFailedError()
          }
        })
    })
}

module.exports = {
  fetchUser,
  createUser,
  login,
  deleteUser,
}
