const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
    case 'fetch': {
      return [
        param('id', validationError('id', 'id is required')).exists(),
        param('id', validationError('id', 'id must be an integer')).isInt(),
      ]
    }
    case 'create': {
      return [
        body('name', validationError('name', 'Name is required')).isString(),
        body(
          'phone_number',
          validationError('phone_number', 'Phone number is required'),
        ).isString(),
        body(
          'phone_number',
          validationError('phone_number', 'Phone number is not valid'),
        ).isMobilePhone(),
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
