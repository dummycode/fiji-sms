var abstractGoggles = require('./abstract.goggles')

module.exports = (message) => {
  const filter = [
    'message_id',
    'content',
    'created_by',
    'username',
    'created_at',
  ]
  return abstractGoggles(message, filter)
}
