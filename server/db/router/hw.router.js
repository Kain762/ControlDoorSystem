const Router = require('express')
const router = new Router()
const hwController = require('../controllers/hw.controller')

router.get('/:id', hwController.getKeyList) // отправить список ключей

module.exports = router