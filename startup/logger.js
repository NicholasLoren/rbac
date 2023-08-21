const config = require('config')
const path = require("path")
const { createLogger, transports, format } = require('winston')
const { printf,  timestamp, combine } = format
const myFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

module.exports = ()=>{
    const format = combine(timestamp(), myFormat)
    const logDirectory = path.join(process.cwd(),'logs')
    const combinedLog = path.join(logDirectory,'combined.log')
    const exceptionsLog = path.join(logDirectory,'exceptions.log')
    if (config.has('NODE_ENV')) {
      //create alogger depending on the environment
      const environment = config.get('NODE_ENV')
      if (environment === 'production') { 
        return createLogger({ 
          transports: [
            new transports.File({ filename: combinedLog }),
          ],
          exceptionHandlers: [
            new transports.File({ filename: exceptionsLog }),
          ],
          format,
        }) 
      } 
    }


    return createLogger({ 
      transports: [new transports.Console()],
      exceptionHandlers: [new transports.Console()],
      format,
    })
}
