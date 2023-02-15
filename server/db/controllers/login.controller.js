const db = require('../postgres')
const jwt = require('jsonwebtoken')

const tokenSecret = process.env.T_SECRET

class LoginController {
  async authUser(req, res) {
    try {
      const {login, password} = req.body

      const userAuth = await db.query('SELECT id, login, role from users WHERE login = $1 AND password = $2', [login, password])

      console.log(userAuth.rows[0])
      if(userAuth.rows[0]) {
        console.log('Найден')
        res.status(200).json({token: jwt.sign({ id: userAuth.rows[0].id }, tokenSecret),
        })
      } else {
        console.log('Не найден')
        res.status(200).send('Пользователь не найден')
      }
      
    } catch (error) {
      res.status(500).send(error)
    }
    

    

    
  }
}

module.exports = new LoginController();