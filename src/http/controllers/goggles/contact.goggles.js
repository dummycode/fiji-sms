var abstractGoggles = require('./abstract.goggles')

module.exports = (contact) => {
  const filter = ['contact_id', 'name', 'phone_number', 'created_at']
  return abstractGoggles(contact, filter)
}
