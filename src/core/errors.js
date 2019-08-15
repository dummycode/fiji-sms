/**
 * Contact errors
 */
exports.ContactNotFound = class ContactNotFound extends Error {}
exports.ContactAlreadyExists = class ContactAlreadyExists extends Error {}

/**
 * Validation errors
 */
exports.ValidationFailedError = class ValidationFailedError extends Error {
  constructor(errors = [], ...params) {
    super(...params)
    this.errors = errors
  }
}

/**
 * Encryption errors
 */
exports.EncryptionFailedError = class EncryptionFailedError extends Error {}
