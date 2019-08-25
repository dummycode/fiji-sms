var abstractGoggles = require('abstract.goggles')

module.exports = (user) => {
  const filter = ['id', 'username', 'email', 'created_at']
  return abstractGoggles(user, filter)
}
