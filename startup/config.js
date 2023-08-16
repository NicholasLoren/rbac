const config = require('config')

module.exports = function () {
  const database =  config.has('database') ? config.get('database') : null
  const jwtPrivateKey =  config.has('jwtPrivateKey') ? config.get('jwtPrivateKey') : null 
  return { database, jwtPrivateKey }
}
