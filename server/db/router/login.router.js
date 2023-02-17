const Router = require('express')
const router = new Router()
const loginController = require('../controllers/login.controller')

router.post('/', loginController.authUser) //Залогинить юзера
router.post('/checkAuth', loginController.authCeck) // проверить токен

module.exports = router