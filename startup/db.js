const mysql = require('mysql')
const {database} = require('./config')()

module.exports = function () {
  if (!database) {
    console.log('No database credentials provided')
    return
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
      return 
    }
    console.log('Connection established')
  })

  return dbConnection
}
