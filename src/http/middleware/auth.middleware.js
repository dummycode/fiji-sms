var jwt = require('jsonwebtoken')

var responder = require('../../core/responder')

var config = require('../../core/config')

var database = require('../../core/database')
var connection = database.getConnection()

const { UserNotFoundError } = require('../../core/errors')

exports.authenticate = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return responder.unauthorizedResponse(res, 'No token provided')
  }

  jwt.verify(token, config.get('auth.secret'), (err, decoded) => {
    if (err) {
      return responder.unauthorizedResponse(res, 'Failed to authenticate token')
    }
    // otherwise, good to go
    connection
      .query('SELECT * FROM user WHERE user_id = ?', [decoded.id])
      .then((results) => {
        if (results.length === 0) {
          throw new UserNotFoundError()
        }
        // set user in request payload
        req.body.user = results[0]
        return next()
      })
      .catch((err) => {
        switch (err.constructor) {
          case UserNotFoundError:
            return responder.badRequestResponse(res, 'User not found')
          default:
            console.log(err)
            return responder.ohShitResponse(res, 'Unknown error occurred')
        }
      })
  })
}

exports.isAdmin = (req, res, next) => {
  if (req.body.user.is_admin) {
    return next()
  } else {
    return responder.unauthorizedResponse(res, 'Permission denied')
  }
}

