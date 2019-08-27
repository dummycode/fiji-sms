var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var database = require('../core/database')
var connection = database.getConnection()
var config = require('../core/config')

var {
  UserAlreadyExistsError,
  UserNotFoundError,
  EncryptionFailedError,
  InvalidPasswordError,
} = require('../core/errors')

const fetchUser = (id) => {
  return connection.query(
    'SELECT * FROM user WHERE id = ? AND deleted_at IS NULL',
    [id],
  )
}

const createUser = (username, password, email) => {
  return connection
    .query('SELECT id FROM user WHERE username=? AND deleted_at IS NULL', [
      username,
    ])
    .then((results) => {
      if (results.length !== 0) {
        throw new UserAlreadyExistsError()
      }

      return bcrypt
        .hash(password, 8)
        .then((hash) => {
          password = hash

          return connection.query(
            'INSERT INTO user (username, password, email, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP(3))',
            [username, password, email],
          )
        })
        .catch((err) => {
          throw new EncryptionFailedError()
        })
    })
    .then((results) => {
      return connection.query('SELECT * FROM user WHERE id = ?', [
        results.insertId,
      ])
    })
}

const deleteUser = (id) => {
  return connection
    .query('SELECT * FROM user WHERE id=? AND deleted_at IS NULL', [id])
    .then((results) => {
      const user = results[0]
      if (!user) {
        throw new UserNotFoundError()
      }
      // Delete the contact
      return connection.query(
        'UPDATE user SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ?',
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
          const token = jwt.sign({ id: user.id }, config.get('auth.secret'), {
            expiresIn: config.get('auth.timeout'),
          })
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
  deleteUser,
  login,
}
