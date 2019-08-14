var express = require('express')
var router = express.Router()

var controller = require('../../controllers/messages.controller')

router.get('/', controller.index)

router.post('/', controller.send)

module.exports = router
