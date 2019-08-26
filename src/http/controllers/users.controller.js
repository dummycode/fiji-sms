var { validationResult } = require('express-validator')

var responder = require('../../core/responder')

var {
  UserNotFoundError,
  InvalidPasswordError,
  UserAlreadyExistsError,
} = require('../../core/errors')

var userManager = require('../../managers/users.manager')

var userGoggles = require('./goggles/user.goggles')

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
  return userManager
    .fetchUser(req.body.user.id)
    .then((results) => {
      if (results.length === 0) {
        throw new UserNotFoundError()
      }
      return responder.successResponse(res, userGoggles(results[0]))
    })
    .catch((err) => {
      switch (err.constructor) {
        case UserNotFoundError:
          responder.badRequestResponse(res, 'Invalid parameters')
          return
        default:
          console.log(err)
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

  userManager
    .createUser(req.body.username, req.body.password, req.body.email)
    .then((results) => {
      const user = results[0]
      responder.itemCreatedResponse(res, userGoggles(user), 'User created')
    })
    .catch((err) => {
      switch (err.constructor) {
        case UserAlreadyExistsError:
          responder.badRequestResponse(res, 'User already exists')
          return
        default:
          console.log(err)
          responder.ohShitResponse(res, 'Unknown error occurred')
      }
    })
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

  userManager
    .login(req.body.username, req.body.password)
    .then((token) => {
      console.log(token)
      responder.successResponse(res, { token }, 'Logged in')
    })
    .catch((err) => {
      switch (err.constructor) {
        case UserNotFoundError:
        case InvalidPasswordError:
          responder.unauthorizedResponse(res, 'invalid login')
          return
        default:
          console.log(err)
          responder.ohShitResponse(res, 'unknown error occurred')
      }
    })
}

module.exports = {
  index,
  register,
  login,
  whoami,
}
