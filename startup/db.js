const mysql = require('mysql') 
const {database} = require('./config')()

module.exports = function () {
  if (!database) {
    console.log('No database credentials provided')
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
      console.log('No database connection extablished')
      process.exit(1) 
    }
    console.log('Connection established')
  })

  return dbConnection
}
