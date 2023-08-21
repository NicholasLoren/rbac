const logger = require('../startup/logger')()

module.exports = function (error, req, res, next) { 
  logger.log({level:'error',message:error})
  res.status(500).send("Internal server error")
}
