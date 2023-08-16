const mysql = require('mysql')
const database = require('./config')()
module.exports = function () {
  if (!database) throw new Error('No database credentials provided')

  const dbConnection = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
  })

  dbConnection.connect((err) => {
    if (err) {
      console.log('No database connection extablished')
      throw err
    }
    console.log('Connection established')
  })

  return dbConnection
}
