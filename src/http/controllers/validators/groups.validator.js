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
    case 'addMember': {
      return [
        body('groupId', validationError('groupId', 'Group id is required')).exists(),
        body(
          'groupId',
          validationError('groupId', 'Group id must be an integer'),
        ).isInt(),
        body(
          'contactId',
          validationError('contactId', 'Contact id is required'),
        ).exists(),
        body(
          'contactId',
          validationError('contactId', 'Contact id must be an integer'),
        ).isInt(),
      ]
    }
    case 'removeMember': {
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
