var abstractGoggles = require('./abstract.goggles')

module.exports = (contact) => {
  const filter = ['group_membership_id', 'group_id', 'contact_id', 'created_at']
  return abstractGoggles(contact, filter)
}
