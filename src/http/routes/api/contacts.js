var express = require('express')
var router = express.Router()

var controller = require('../../controllers/contacts.controller')
var { validate } = require('../../controllers/validators/contacts.validator')

router.get('/', controller.index)
router.get('/', controller.fetch)
router.post('/', [validate('create')], controller.create)
router.delete('/:id', [validate('remove')], controller.remove)

module.exports = router
