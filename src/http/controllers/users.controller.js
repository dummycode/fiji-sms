var responder = require('../../core/responder')

const index = (req, res) => {
  responder.successResponse(res, { message: 'users index page' })
}

module.exports = {
  index,
}
