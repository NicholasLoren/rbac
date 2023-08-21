const express = require('express')
const helmet = require('helmet')
const Users = require('../routes/Users')
const Roles = require('../routes/Roles')
const Categories = require('../routes/Categories')
const Permissions = require('../routes/Permissions')
const dbMiddleware = require("../middleware/db")
const error = require("../middleware/error")

module.exports = function (app) {
  app.use(helmet())
  app.use(express.json())
  app.use(dbMiddleware)
  app.use('/users', Users)
  app.use('/roles', Roles)
  app.use('/categories', Categories)
  app.use('/permissions', Permissions)
  app.use(error)
  //DEFAULT ROUTE
  app.get('/', (req, res) => {
    return res.send('RBAC - Role Based Accessed Control with MySQL and Node JS')
  })
}
