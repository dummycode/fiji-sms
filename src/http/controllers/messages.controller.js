var responder = require('../../core/responder')
var twilio = require('../../core/twilio')
var { validationResult } = require('express-validator')

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
    twilio.client.messages
      .create({
        body: req.body.message,
        from: '+12073053886',
        to: '+17202567244',
      })
      .then((message) =>
        responder.successResponse(res, {
          message: 'message successfully sent',
        }),
      )
      .catch((err) => responder.ohShitResponse(res))
  }
}

module.exports = {
  index,
  send,
}
