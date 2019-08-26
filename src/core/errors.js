/**
 * Contact errors
 */
exports.ContactNotFoundError = class ContactNotFoundError extends Error {}
exports.ContactAlreadyExistsError = class ContactAlreadyExistsError extends Error {}

/**
 * User errors
 */
exports.UserNotFoundError = class UserNotFoundError extends Error {}
exports.UserAlreadyExistsError = class UserAlreadyExistsError extends Error {}
exports.InvalidPasswordError = class InvalidPasswordError extends Error {}

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
