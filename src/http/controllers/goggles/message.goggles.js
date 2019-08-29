var abstractGoggles = require('./abstract.goggles')

module.exports = (message) => {
  const filter = ['id', 'content', 'created_by', 'created_at']
  return abstractGoggles(message, filter)
}
