const mysql = require('mysql') 
const {database} = require('./config')() 
const logger = require("../startup/logger")()

module.exports = function () { 
  if (!database) {
    logger.log('No database credentials provided')
    process.exit(0) 
  }

  const dbConnection = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
  })
 
  dbConnection.connect((err) => {
    if (err) {
      logger.log('No database connection extablished')
      process.exit(1) 
    }
    logger.log({level:'info',message:'Connection established'})
  })

  return dbConnection
}
