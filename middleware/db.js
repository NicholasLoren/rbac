const mysql = require('mysql')
const { database } = require('../startup/config')()
const logger = require("../startup/logger")()

module.exports = function (req, res, next) {
    logger.log({level:"info",message:"Establishing database connection..."})
    if (!database) { 
      throw new Error(
        'Internal server error, No database connection can be made'
      )
    }

    const dbConnection = mysql.createConnection({
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.name,
    }) 

    dbConnection.connect((err) => {
      if (err) { 
        throw new Error('No database connection extablished')
      } 
    })
 
    logger.log({
      level: 'info',
      message: 'Database connection established!',
    })
    next()

}
