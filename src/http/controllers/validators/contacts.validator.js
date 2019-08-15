const { body, param } = require('express-validator')

exports.validate = function validate(method) {
  switch (method) {
    case 'fetch': {
      return [param('id', 'id must be an int').isInt()]
    }
    case 'create': {
      return [
        body('name', 'name does not exist').isString(),
        body('phone_number', 'phone_number does not exist').isString(),
      ]
    }
    case 'remove': {
      return [param('id', 'id must be a int').isInt()]
    }
    default: {
      return () => true
    }
  }
}
