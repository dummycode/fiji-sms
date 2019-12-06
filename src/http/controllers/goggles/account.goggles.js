var abstractGoggles = require('./abstract.goggles')

module.exports = (group) => {
  const filter = ['account_id', 'name']
  return abstractGoggles(group, filter)
}
