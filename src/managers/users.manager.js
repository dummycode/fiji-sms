var bcrypt = require('bcyrptjs')
var database = require('../core/database')
var connection = database.getConnection()

var {
  UserAlreadyExists,
  UserNotFoundError,
  EncryptionFailedError,
} = require('../core/errors')

const createUser = (username, password) => {
  bcrypt.hash(password, 8, (err, hash) => {
    if (err) {
      throw new EncryptionFailedError()
    }
  })

  return connection
    .query('SELECT id FROM user WHERE username=? AND deleted_at IS NULL', [
      username,
    ])
    .then((results) => {
      if (results.length !== 0) {
        throw new UserAlreadyExistsError()
      }
      return connection.query(
        'INSERT INTO contact (username, password, created_at) VALUES (?, ?, CURRENT_TIMESTAMP(3))',
        [username, password],
      )
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

module.exports = {
  createUser,
  deleteUser,
}
