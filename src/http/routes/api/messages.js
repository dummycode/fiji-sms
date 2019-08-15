var express = require('express')
var router = express.Router()

var controller = require('../../controllers/messages.controller')
var { validate } = require('../../controllers/validators/messages.validator')

router.get('/', controller.index)
router.post('/', [validate('send')], controller.send)

module.exports = router
