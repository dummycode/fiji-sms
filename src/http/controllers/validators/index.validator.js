const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
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
    default: {
      return () => true
    }
  }
}
