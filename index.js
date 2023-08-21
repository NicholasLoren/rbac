const app = require('express')()
const PORT = process.env.PORT || 3000 
const routes = require('./startup/routes')
const logger = require("./startup/logger")()

/**
 * App middleware functions here
 * Custom routes and error handlers
 **/
routes(app) 
  

app.listen(PORT, () => {
  logger.log({level:'info',message:`listening on port ${PORT}`}) 
})
