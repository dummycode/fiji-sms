var responder = require('../../core/responder')
var manager = require('../../managers/contacts.manager')
var { validationResult } = require('express-validator')

var { ContactNotFound, ContactAlreadyExists } = require('../../core/errors')

const index = (req, res) => {
  manager
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
  } else {
    return manager
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
}

const remove = (req, res) => {
  responder.successResponse(res, { message: 'delete contact' })
}

module.exports = {
  index,
  fetch,
  create,
  remove,
}
