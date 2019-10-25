var config = require('./config')

const authToken = config.get('twilio.authToken')
const client = require('twilio')(
  config.get('twilio.accountSid'),
  config.get('twilio.authToken'),
)

const sendMessage = (to, body) => {
  return client.messages.create({
    body,
    from: config.get('twilio.phoneNumber'),
    to,
  })
}

const sendMassMessage = (tos, body) => {
  return Promise.all(
    tos.map((to) => {
      sendMessage(to, body)
    }),
  )
}

module.exports = {
  sendMessage,
  sendMassMessage,
}
