const Router = require('express')
const router = new Router()
const usersController = require('../controllers/users.controller')

router.post('/', usersController.createUser) // Создать юзера
router.get('/', usersController.getAllUsersName) // Вывести всех юзеров
router.get('/role', usersController.getAllUsersRole) // вывести все роли юзеров
// router.get('/:id', usersController.getOneUser) // Вывести одного юзера
router.put('/', usersController.updateUser) // Обновить юзера
router.delete('/:id', usersController.deleteUser) // Удалить юзера
router.post('/check/:user/:door', usersController.checkUserDoor) // Проверить привязку юзера к дверям

module.exports = router