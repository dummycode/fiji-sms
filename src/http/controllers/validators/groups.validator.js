const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
    case 'fetch': {
      return [
        param('id', validationError('id', 'Id is required')).exists(),
        param('id', validationError('id', 'Id must be an integer')).isInt(),
      ]
    }
    case 'create': {
      return [
        body('name', validationError('name', 'Name is required')).isString(),
      ]
    }
    case 'remove': {
      return [
        param('id', validationError('id', 'Id is required')).exists(),
        param('id', validationError('id', 'Id must be an integer')).isInt(),
      ]
    }
    default: {
      return () => true
    }
  }
}
