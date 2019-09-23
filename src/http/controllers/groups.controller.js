var responder = require('../../core/responder')
var groupsManager = require('../../managers/groups.manager')
var { validationResult } = require('express-validator')

var groupGoggles = require('./goggles/group.goggles')

var { GroupNotFoundError } = require('../../core/errors')

const index = (req, res) => {
  groupsManager
    .fetchAllGroups()
    .then((results) => {
      responder.successResponse(res, results.map(groupGoggles))
    })
    .catch((err) => {
      switch (err.constructor) {
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const fetch = (req, res) => {
  responder.successResponse(res, { message: 'get group' })
}

const create = (req, res) => {
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

  groupsManager
    .createGroup(req.body.name)
    .then((results) => {
      responder.itemCreatedResponse(res, groupGoggles(results[0]), {
        message: 'Group created',
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const remove = (req, res) => {
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

  groupsManager
    .deleteGroup(req.params.id)
    .then((results) => {
      const contact = results[0]
      responder.itemDeletedResponse(res, {
        message: 'Successfully deleted group',
        data: contact,
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case GroupNotFoundError:
          responder.notFoundResponse(res, 'Group not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

module.exports = {
  index,
  fetch,
  create,
  remove,
}
