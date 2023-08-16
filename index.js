const express = require("express")  
const Users = require("./routes/Users")
const app = express()
const PORT = process.env.PORT || 3000 



/** App middleware functions here 
 * Custoom routes and error handlers
**/
app.use(express.json())
app.use('/users',Users)

//DEFAULT ROUTE
app.get('/',(req,res)=>{
    return res.send("RBAC- Role Based Accessed Control with MySQL and Node JS")
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})



