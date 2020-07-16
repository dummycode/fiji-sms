let client = require('twilio')
const config = require('./config')
const { TwilioError } = require('./errors')

const accountSid = config.get('twilio.accountSid')
const authToken = config.get('twilio.authToken')
client = client(
  accountSid,
  authToken,
)

const phoneNumber = config.get('twilio.phoneNumber')

const sendMessage = (to, body) => client.messages.create({
  body,
  from: phoneNumber,
  to,
})

const sendMassMessage = (tos, body) => {
  Promise.all(
    tos.map((to) => sendMessage(to, body)),
  )
    .catch((err) => {
      console.log(err)
      throw new TwilioError()
    })
}

module.exports = {
  sendMessage,
  sendMassMessage,
}
