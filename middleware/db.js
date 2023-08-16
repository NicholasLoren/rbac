const mysql = require('mysql')
const { database } = require('../startup/config')()


module.exports = function (req, res, next) {
    console.log("Establishing database connection...")
    if (!database) { 
      return res.status(500).send("Internal server error, No database connection can be made")
    }

    const dbConnection = mysql.createConnection({
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.name,
    })

    dbConnection.connect((err) => {
      if (err) { 
        return res.send(500).send('No database connection extablished')
      } 
    })

    console.log("Database connection established!")
    next()

}
