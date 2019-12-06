var express = require('express')
var router = express.Router()

var controller = require('../../controllers/contacts.controller')

var { validate } = require('../../controllers/validators/contacts.validator')

var { authenticate } = require('../../middleware/auth.middleware')

router.get('/', [authenticate], controller.index)
router.get('/:id', [authenticate], controller.fetch)
router.post('/', [authenticate, validate('create')], controller.create)
router.delete('/:id', [authenticate, validate('remove')], controller.remove)

module.exports = router
