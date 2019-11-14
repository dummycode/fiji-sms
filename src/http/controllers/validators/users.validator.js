const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body(
          'username',
          validationError('username', 'Username is required'),
        ).isString(),
        body(
          'password',
          validationError('password', 'Password is required'),
        ).isString(),
        body('email', validationError('email', 'Email is required')).isString(),
        body('email', validationError('email', 'Email is not valid')).isEmail(),
      ]
    }
    case 'login': {
      return [
        body(
          'username',
          validationError('username', 'Username is required'),
        ).isString(),
        body(
          'password',
          validationError('password', 'Password is required'),
        ).isString(),
      ]
    }
    case 'remove': {
      return [
        param('id', validationError('id', 'id is required')).exists(),
        param('id', validationError('id', 'id must be an integer')).isInt(),
      ]
    }
    default: {
      return () => true
    }
  }
}
