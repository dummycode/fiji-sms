const { body, param } = require('express-validator')

exports.validate = function validate(method) {
  switch (method) {
    case 'fetch': {
      return [param('id', 'id must be an int').isInt()]
    }
    case 'send': {
      return [body('message', 'message does not exist').isString()]
    }
    default: {
      return () => true
    }
  }
}
