const jwt = require('jsonwebtoken')
const { jwtPrivateKey } = require('../startup/config')()
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token)
    return res
      .status(401)
      .send('Access denied. No auth token provided')

  try {
    //verify auth token
    if (!jwtPrivateKey)
      return res
        .status(500)
        .send('Something went wrong.', 'No jwt private key found')
    const decoded = jwt.verify(token, jwtPrivateKey)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(400).send('Invalid authorization token')
  }
}
