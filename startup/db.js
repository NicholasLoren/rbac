const mysql = require('mysql')

module.exports = function(){
  const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rbac',
  })

   dbConnection.connect((err)=>{
    if(err){
        console.log("No database connection extablished")
        return
    } 
    console.log("Connection established")

  })

  return dbConnection

}
