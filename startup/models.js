const dbConnection = require('./db')()
const UsersModel = require('../models/Users')
const RolesModel = require('../models/Roles')

module.exports = {
  Users: new UsersModel(dbConnection),
  Roles: new RolesModel(dbConnection),
}
