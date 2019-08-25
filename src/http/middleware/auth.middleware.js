var jwt = require('jsonwebtoken')

var responder = require('../../core/responder')

var config = require('../../core/config')

var database = require('../../core/database')
var connection = database.getConnection()

const { UserNotFoundError } = require('../../core/errors')

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return responder.unauthorizedResponse(res, 'No token provided')
  }

  jwt.verify(token, config.get('auth.secret'), (err, decoded) => {
    if (err) {
      return responder.unauthorizedResponse(res, 'failed to authenticate token')
    }
    // otherwise, good to go
    connection
      .query('SELECT * FROM user WHERE id = ?', [decoded.id])
      .then((results) => {
        if (results.length === 0) {
          throw new UserNotFoundError()
        }
        // set user in request payload
        req.body.user = user
        return next()
      })
      .catch((err) => {
        switch (err.constructor) {
          case UserNotFoundError:
            return responder.badRequestResponse(res, 'User not found')
          default:
            return responder.ohShitResponse(res, 'Unknown error occurred')
        }
      })
  })
}
