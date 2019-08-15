var config = require('./config')

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = config.get('twilio.accountSid')
const authToken = config.get('twilio.authToken')
const client = require('twilio')(accountSid, authToken)

module.exports = {
  client,
}
