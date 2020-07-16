const contactsManager = require('../contacts.manager')
const messagesCreator = require('./creator')
const twilio = require('../../core/twilio')

const contacts = async (groupId) => {
  if (groupId) {
    return contactsManager.fetchContactsForGroup(groupId)
  }

  return contactsManager.fetchAllContacts()
}

const send = async (message, groupId, userId) => {
  const contactList = await contacts(groupId)
  const phoneNumbers = contactList.map((contact) => contact.phone_number)

  console.log(phoneNumbers)

  await twilio.sendMassMessage(phoneNumbers, message)

  return messagesCreator.create(message, userId)
}

module.exports = {
  send,
}
