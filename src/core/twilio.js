var config = require('./config')

const authToken = config.get('twilio.authToken')
const client = require('twilio')(
  config.get('twilio.accountSid'),
  config.get('twilio.authToken'),
)

const sendMessage = (to, body) => {
  return client.messages.create({
    body,
    from: '+12073053886',
    to,
  })
}

// TODO should export helper functions
module.exports = {
  sendMessage,
}
