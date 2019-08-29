var responder = require('../../core/responder')

var config = require('../../core/config')

const index = (req, res) => {
  responder.successResponse(
    res,
    {
      name: config.get('app.name'),
      description: config.get('app.desc'),
      version: config.get('app.api.version'),
    },
    'API Index',
  )
}

module.exports = {
  index,
}
