var { validationResult } = require('express-validator')

var responder = require('../../core/responder')

var { AccountNotFoundError } = require('../../core/errors')

var accountManager = require('../../managers/accounts.manager')

var accountGoggles = require('./goggles/account.goggles')

const index = (req, res) => {
  responder.successResponse(res, { message: 'accounts index page' })
}

// const index = (req, res) => {
//   accountsManager
//     .fetchAllAccounts()
//     .then((results) => {
//       responder.successResponse(res, results.map(accountGoggles))
//     })
//     .catch((err) => {
//       switch (err.constructor) {
//         default:
//           console.log(err)
//           responder.ohShitResponse(res, err)
//       }
//     })
// }

const fetch = (req, res) => {
  accountsManager
    .fetch(req.params.id)
    .then((results) => {
      const account = results[0]
      responder.successResponse(res, accountGoggles(account))
    })
    .catch((err) => {
      switch (err.constructor) {
        case AccountNotFoundError:
          responder.notFoundResponse(res, 'Account not found')
          break
        default:
          console.log(err)
          responder.ohShitResponse(res)
      }
    })
  responder.successResponse(res, { message: 'get account' })
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

  accountsManager
    .createAccount(req.body.name)
    .then((results) => {
      responder.itemCreatedResponse(res, accountGoggles(results[0]), {
        message: 'Account created',
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

  accountsManager
    .deleteAccount(req.params.id)
    .then((results) => {
      const contact = results[0]
      responder.itemDeletedResponse(res, 'Successfully deleted account')
    })
    .catch((err) => {
      switch (err.constructor) {
        case AccountNotFoundError:
          responder.notFoundResponse(res, 'Account not found')
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
  accountsManager
    .addMember(req.params.id, req.body.contact_id)
    .then((results) => {
      const accountMembership = results[0]
      responder.itemCreatedResponse(res, accountMembership, {
        message: 'Member added',
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case AccountNotFoundError:
          responder.badRequestResponse(res, 'Account not found')
          break
        case ContactNotFoundError:
          responder.badRequestResponse(res, 'Account not found')
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

  accountsManager
    .removeMember(req.params.id)
    .then((results) => {
      const accountMembership = results[0]
      responder.itemDeletedResponse(res, 'Account membership deleted')
    })
    .catch((err) => {
      switch (err.constructor) {
        case AccountMembershipNotFoundError:
          responder.badRequestResponse(res, 'Account membership not found')
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
