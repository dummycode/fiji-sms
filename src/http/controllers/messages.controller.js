var responder = require('../../core/responder')
var twilio = require('../../core/twilio')
var { validationResult } = require('express-validator')
var contactsManager = require('../../managers/contacts.manager')

const index = (req, res) => {
  responder.successResponse(res, { message: 'messages index page' })
}

const send = (req, res) => {
  if (validationResult(req).errors.length !== 0) {
    responder.badRequestResponse(
      res,
      'invalid parameters',
      validationResult(req).errors.map((error) => {
        return error.msg
      }),
    )
  } else {
    const contacts = contactsManager.fetchAllContacts().then((contacts) => {
      const phoneNumbers = contacts.map((contact) => contact.phone_number)
      twilio
        .sendMassMessage(phoneNumbers, req.body.message)
        .then((message) =>
          responder.successResponse(res, {
            message: 'message successfully sent',
          }),
        )
        .catch((err) => responder.ohShitResponse(res, err))
    })
  }
}

module.exports = {
  index,
  send,
}
