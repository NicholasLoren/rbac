const app = require('express')()
const PORT = process.env.PORT || 3000 
const routes = require("./startup/routes")

/** 
 * App middleware functions here 
 * Custom routes and error handlers
**/
routes(app)

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})



