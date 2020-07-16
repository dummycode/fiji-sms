const { body, param } = require('express-validator')
const { validationError } = require('../../../core/utils')

exports.validate = (method) => {
  switch (method) {
    case 'fetch': {
      return [
        param('id', validationError('id', '`id` is required')).exists(),
        param('id', validationError('id', '`id` must be an integer')).isInt(),
      ]
    }
    case 'create': {
      return [
        body('name', validationError('name', '`name` is required')).isString(),
      ]
    }
    case 'remove': {
      return [
        param('id', validationError('id', '`id` is required')).exists(),
        param('id', validationError('id', '`id` must be an integer')).isInt(),
      ]
    }
    case 'addMember': {
      return [
        body('groupId', validationError('groupId', '`groupId` is required')).exists(),
        body(
          'groupId',
          validationError('groupId', '`groupId` must be an integer'),
        ).isInt(),
        body(
          'contactId',
          validationError('contactId', '`contactId` is required'),
        ).exists(),
        body(
          'contactId',
          validationError('contactId', '`contactId` must be an integer'),
        ).isInt(),
      ]
    }
    case 'removeMember': {
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
