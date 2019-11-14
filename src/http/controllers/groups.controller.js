var responder = require('../../core/responder')
var groupsManager = require('../../managers/groups.manager')
var { validationResult } = require('express-validator')

var groupGoggles = require('./goggles/group.goggles')
var groupMembershipGoggles = require('./goggles/group_membership.goggles')

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
  groupsManager
    .fetch(req.params.id)
    .then((results) => {
      const group = results[0]
      responder.successResponse(res, groupGoggles(group))
    })
    .catch((err) => {
      switch (err.constructor) {
        case GroupNotFoundError:
          responder.notFoundResponse(res, 'Group not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res)
      }
    })
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
      responder.itemDeletedResponse(res, 'Successfully deleted group')
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

const addMember = (req, res) => {
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
    .addMember(req.params.id, req.body.contact_id)
    .then((results) => {
      const groupMembership = results[0]
      responder.itemCreatedResponse(res, groupMembership, {
        message: 'Member added',
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case GroupNotFoundError:
          responder.badRequestResponse(res, 'Group not found')
          break
        case ContactNotFoundError:
          responder.badRequestResponse(res, 'Group not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res, err)
      }
    })
}

const removeMember = (req, res) => {
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
    .removeMember(req.params.id)
    .then((results) => {
      const groupMembership = results[0]
      responder.itemDeletedResponse(res, 'Group membership deleted')
    })
    .catch((err) => {
      switch (err.constructor) {
        case GroupMembershipNotFoundError:
          responder.badRequestResponse(res, 'Group membership not found')
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
  addMember,
}
