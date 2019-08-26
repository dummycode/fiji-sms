var express = require('express')
var router = express.Router()

var controller = require('../../controllers/messages.controller')
var { validate } = require('../../controllers/validators/messages.validator')

var authenticate = require('../../middleware/auth.middleware')

router.get('/', [authenticate], controller.index)
router.post('/', [authenticate, validate('send')], controller.send)

module.exports = router
