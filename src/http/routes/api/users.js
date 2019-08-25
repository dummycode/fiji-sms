var express = require('express')
var router = express.Router()

var { validate } = require('../../controllers/validators/users.validator')

var controller = require('../../controllers/users.controller')

router.get('/', controller.index)
router.post('/', validate('register'), controller.register)
router.post('/login', validate('login'), controller.login)

module.exports = router
