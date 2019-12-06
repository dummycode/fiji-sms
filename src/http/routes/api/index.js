var express = require('express')
var router = express.Router()

var { validate } = require('../../controllers/validators/index.validator')

var controller = require('../../controllers/index.controller')
var userController = require('../../controllers/users.controller')

var { authenticate } = require('../../middleware/auth.middleware')

router.get('/', controller.index)
router.get('/whoami', authenticate, userController.whoami)
router.post('/login', validate('login'), userController.login)

module.exports = router
