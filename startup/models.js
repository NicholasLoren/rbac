const dbConnection = require('./db')()
const UsersModel = require('../models/Users')
const RolesModel = require('../models/Roles')
const CategoriesModel = require('../models/Categories')
const PermissionsModel = require('../models/Permissions')

module.exports = {
  Users: new UsersModel(dbConnection),
  Roles: new RolesModel(dbConnection),
  Categories: new CategoriesModel(dbConnection),
  Permissions: new PermissionsModel(dbConnection),
}
