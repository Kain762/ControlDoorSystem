const jwt = require('jsonwebtoken')
const tokenSecret = process.env.T_SECRET

class checkAccess {
  checkToken(req, res, next) {
    try {
      const token = req.headers.authorization
      // console.log(token)
      jwt.verify(token, tokenSecret, { maxAge: "24 hours" })
      // console.log('111111111111111111111111111111111111111111111111111')
      next()
    } catch (error) {
      console.log('Middleware Access error')
      // next()
      res.status(401).send('Неавторизированный запрос')
    }

  }
}

module.exports = new checkAccess()