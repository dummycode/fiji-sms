var responder = require('../../core/responder')

const index = (req, res) => {
  responder.successResponse(res, { message: 'messages index page' })
}

const send = (req, res) => {
  responder.successResponse(res, { message: 'message successfully sent' })
}

module.exports = {
  index,
  send,
}
