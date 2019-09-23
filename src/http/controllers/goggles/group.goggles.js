var abstractGoggles = require('./abstract.goggles')

module.exports = (group) => {
  const filter = ['group_id', 'name']
  return abstractGoggles(group, filter)
}
