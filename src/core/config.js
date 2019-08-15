var json = require('../../config.json')

const get = (path) => {
  let jsonData = json

  if (typeof path === 'undefined') {
    throw Error('invalid argument')
  }

  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indices to properties
  path = path.replace(/^\./, '') // strip a leading dot
  const pathArray = path.split('.')

  for (var i = 0, n = pathArray.length; i < n; i++) {
    const key = pathArray[i]
    if (key in jsonData) {
      if (jsonData[key] !== null) {
        jsonData = jsonData[key]
      } else {
        return null
      }
    } else {
      return key
    }
  }

  return jsonData
}

module.exports = {
  get,
}
