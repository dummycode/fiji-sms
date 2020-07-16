const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body(
          'username',
          validationError('username', '`username` is required'),
        ).isString(),
        body(
          'password',
          validationError('password', '`password` is required'),
        ).isString(),
        body('email', validationError('email', '`email` is required')).isString(),
        body('email', validationError('email', '`email` is not valid')).isEmail(),
        body('accountId', validationError('accountId', '`accountId` must be an account id')).optional().isInt(),
      ]
    }
    case 'login': {
      return [
        body(
          'username',
          validationError('username', '`username` is required'),
        ).isString(),
        body(
          'password',
          validationError('password', '`password` is required'),
        ).isString(),
      ]
    }
    case 'remove': {
      return [
        param('id', validationError('id', '`id` is required')).exists(),
        param('id', validationError('id', '`id` must be an integer')).isInt(),
      ]
    }
    default: {
      return () => true
    }
  }
}
