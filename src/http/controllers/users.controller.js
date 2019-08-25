var { validationResult } = require('express-validator')

var responder = require('../../core/responder')

var { UserNotFoundError } = require('../../core/errors')

const index = (req, res) => {
  responder.successResponse(res, { message: 'users index page' })
}

const whoami = (req, res) => {
  // TODO this should live on index controller
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'Invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  return connection
    .query('SELECT * FROM user WHERE id = ? AND deleted_at IS NULL', [
      req.body.user_id,
    ])
    .then((results) => {
      if (results.length === 0) {
        throw new UserNotFoundError()
      }
      return responder.successResponse(res, userGoggles(user))
    })
    .catch((err) => {
      switch (err.constructor) {
        case UserNotFoundError:
          responder.badRequestResponse(res, 'Invalid parameters')
          return
        default:
          responder.ohShitResponse(res, err)
      }
    })
}

const register = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'Invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }
  responder.successResponse(req, 'register')
}

const login = (req, res) => {
  // TODO this should live on index controller
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'Invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  responder.successResponse(req, 'login')
}

module.exports = {
  index,
  register,
  login,
  whoami,
}
