var express = require('express')
var router = express.Router()

var controller = require('../../controllers/groups.controller')

var { validate } = require('../../controllers/validators/groups.validator')

var { authenticate } = require('../../middleware/auth.middleware')

router.post('/', [authenticate, validate('create')], controller.addMember)
router.delete(
  '/:id',
  [authenticate, validate('removeMember')],
  controller.removeMember,
)

module.exports = router
