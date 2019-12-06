var responder = require('../../core/responder')
var twilio = require('../../core/twilio')
var { validationResult } = require('express-validator')

var contactsManager = require('../../managers/contacts.manager')
var messagesManager = require('../../managers/messages.manager')

var messageGoggles = require('./goggles/message.goggles')

const index = (req, res) => {
  messagesManager
    .fetchAllMessages()
    .then((messages) => {
      responder.successResponse(res, messages.map(messageGoggles))
    })
    .catch((err) => {
      switch (err.constructor) {
        default:
          responder.ohShitResponse(res, err)
      }
    })
}

const send = (req, res) => {
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

  const contacts = () => {
    if (req.body.groupId) {
      return contactsManager.fetchContactsForGroup(req.body.groupId)
    } else {
      return contactsManager.fetchAllContacts()
    }
  }

  contacts().then((contacts) => {
    const phoneNumbers = contacts.map((contact) => contact.phone_number)
    twilio
      .sendMassMessage(phoneNumbers, req.body.message)
      .then((message) =>
        messagesManager
          .createMessage(req.body.message, req.body.user.user_id)
          .then((results) => {
            responder.successResponse(
              res,
              { message: results[0] },
              'Message successfully sent',
            )
          }),
      )
      .catch((err) => {
        console.log(err)
        responder.ohShitResponse(res, err)
      })
  })
}

module.exports = {
  index,
  send,
}
