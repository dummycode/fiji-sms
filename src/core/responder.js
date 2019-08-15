const baseResponse = (res, code, message = '') => {
  const content = {
    code,
    message,
  }
  res.status(code).json({ content })
}

const baseErrorResponse = (res, code, message, errors = []) => {
  const content = {
    code,
    message,
    errors,
  }
  res.status(code).json({ content })
}

const badRequestResponse = (res, message = 'invalid request', errors = []) =>
  baseErrorResponse(res, 400, message, errors)

const notFoundResponse = (res, message = 'not found') =>
  baseErrorResponse(res, 404, message)

const ohShitResponse = (res, message = 'oh shit') =>
  baseErrorResponse(res, 500, message)

const successResponse = (res, data = [], message = '') => {
  const content = {
    code: 200,
    message,
    data,
  }

  res.status(200).json({ content })
}

itemCreatedResponse = (res, data = [], message = '') => {
  const content = {
    code: 201,
    message,
    data,
  }

  res.status(201).json({
    content,
  })
}

module.exports = {
  notFoundResponse,
  successResponse,
  ohShitResponse,
  itemCreatedResponse,
  badRequestResponse,
}
