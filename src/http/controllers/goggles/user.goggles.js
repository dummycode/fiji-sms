var abstractGoggles = require('./abstract.goggles')

module.exports = (user) => {
  const filter = ['user_id', 'username', 'email', 'created_at']
  return abstractGoggles(user, filter)
}
