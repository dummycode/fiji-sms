var responder = require('../../core/responder')

const index = (req, res) => {
  responder.successResponse(res, { message: 'index page' })
}

module.exports = {
  index,
}
