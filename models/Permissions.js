const Joi = require('joi')

class Permissions {
  constructor(connection) {
    this.connection = connection
  }
  //::: GET PERMISSION(S):::
  get(id = null, callback) {
    if (id) {
      this.connection.query(
        'SELECT * FROM `permissions` WHERE `id` = ? LIMIT 1',
        [id],
        callback
      )
      return
    }

    this.connection.query('SELECT * FROM `permissions`', callback)
  }

  //::: ADD or UPDATE PERMISSION :::
  add(id = null, permission, callback) {
    const validation = this.validate(permission)
    if (validation.error)
      return callback(validation.error.details[0].message, null)

    const { permissions_category_id,name, description } = permission

    if (id) {
      //Update role
      this.connection.query(
        'UPDATE `permissions` SET `permissions_category_id`=?, `name`=?, `description`=? WHERE `id` = ? LIMIT 1',
        [permissions_category_id,name, description, id],
        callback
      )
      return
    }

    this.connection.query(
      'INSERT INTO `permissions`(`permissions_category_id`,`name`,`description`) VALUES(?,?,?)',
      [permissions_category_id,name, description],
      callback
    )
  }

  //::: DELETE PERMISSION :::
  delete(id, callback) {
    return this.connection.query(
      'DELETE FROM `permissions` WHERE `id`=? LIMIT 1',
      [id],
      callback
    )
  }

  //::: VALIDATE PERMISSION :::
  validate(role) {
    const schema = Joi.object({
      permissions_category_id: Joi.string()
        .trim()
        .required()
        .label('Permission Category Id'),
      name: Joi.string().min(3).max(255).trim().required().label('Name'),
      description: Joi.string().allow('').label('Description'),
    })

    return schema.validate(role)
  }
}

module.exports = Permissions
