const config = require('config')

module.exports = function () {
  return config.has('database') ? config.get('database') : null
}
