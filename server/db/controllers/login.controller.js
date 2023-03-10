const db = require('../postgres')
const jwt = require('jsonwebtoken')

const tokenSecret = process.env.T_SECRET

class LoginController {
  async authUser(req, res) {
    try {
      const { login, password } = req.body

      const userAuth = await db.query('SELECT id, login, role from users WHERE login = $1 AND password = $2', [login, password])

      // console.log(userAuth.rows[0])
      if (userAuth.rows[0]) {
        // console.log('Найден')
        res.status(200).json({
          token: jwt.sign({ id: userAuth.rows[0].id, role: userAuth.rows[0].role }, tokenSecret),
        })
      } else {
        // console.log('Не найден')
        res.status(502).json({ message: 'Пользователь не найден', token: undefined })
      }

    } catch (error) {
      res.status(500).send(`Ошибка входа пользователя ${error}`) // Ошибка
    }
  }

  async authCeck(req, res) {
    try {
      const token = req.headers.authorization

      // console.log('Верификация')
      jwt.verify(token, tokenSecret, { maxAge: "24 hours" })
      const tokenDecode = jwt.decode(token)
      // console.log('Декодирование')
      // console.log(tokenDecode)

      res.status(200).json(tokenDecode)

    } catch (error) {
      res.status(501).send(`Ошибка при проверке токена ${error}`)
    }
  }
}

module.exports = new LoginController();