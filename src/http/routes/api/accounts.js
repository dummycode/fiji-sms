var express = require('express')
var router = express.Router()

var controller = require('../../controllers/accounts.controller')

var { validate } = require('../../controllers/validators/groups.validator')

var { authenticate, isAdmin } = require('../../middleware/auth.middleware')

router.get('/', [authenticate, isAdmin], controller.index)
router.get('/:id', [authenticate], controller.fetch)
router.post('/', [authenticate, validate('create')], controller.create)
router.delete('/:id', [authenticate, validate('remove')], controller.remove)

module.exports = router
