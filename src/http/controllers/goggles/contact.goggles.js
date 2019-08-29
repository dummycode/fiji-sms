var abstractGoggles = require('./abstract.goggles')

module.exports = (contact) => {
  const filter = ['id', 'name', 'phone_number', 'created_at']
  return abstractGoggles(contact, filter)
}
