var responder = require('../../core/responder')
var contactsManager = require('../../managers/contacts.manager')
var { validationResult } = require('express-validator')

var { ContactNotFound, ContactAlreadyExists } = require('../../core/errors')

const index = (req, res) => {
  contactsManager
    .fetchAllContacts()
    .then((results) => {
      responder.successResponse(res, results)
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
  responder.successResponse(res, { message: 'get contact' })
}

const create = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  contactsManager
    .createContact(req.body.name, req.body.phone_number)
    .then((results) => {
      responder.itemCreatedResponse(res, results[0], {
        message: 'contact created',
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case ContactAlreadyExists:
          responder.ohShitResponse(res, 'contact already exists')
          break
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
      'invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
    return
  }

  contactsManager
    .deleteContact(req.params.id)
    .then((results) => {
      const contact = results[0]
      responder.itemDeletedResponse(res, {
        message: 'successfully deleted contact',
        data: contact,
      })
    })
    .catch((err) => {
      switch (err.constructor) {
        case ContactNotFound:
          responder.notFoundResponse(res, 'contact not found')
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
