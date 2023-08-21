const Joi = require('joi')

class Roles {
  constructor(connection) {
    this.connection = connection
  }
  //::: GET ROLE(S):::
  get(id = null, callback) {
    if (id) {
      this.connection.query(
        'SELECT * FROM `roles` WHERE `id` = ? LIMIT 1',
        [id],
        callback
      )
      return
    }

    this.connection.query('SELECT * FROM `roles`', callback)
  }

  //::: ADD or UPDATE ROLE :::
  add(id = null, role, callback) {
    const validation = this.validate(role)
    if(validation.error) return callback(validation.error.details[0].message,null)

    const { name, description } = role

    if (id) {
      //Update role
      this.connection.query(
        'UPDATE `roles` SET `name`=?, `description`=? WHERE `id` = ? LIMIT 1',
        [ name, description,id],
        callback
      )
      return 
    }

    this.connection.query(
      'INSERT INTO `roles`(name,description) VALUES(?,?)',
      [name, description],
      callback
    )
  }

  //::: DELETE ROLE :::
  delete(id,callback){
    return this.connection.query("DELETE FROM `roles` WHERE `id`=? LIMIT 1",[id],callback)
  }

  //::: VALIDATE ROLE :::
  validate(role) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).trim().required().label('Name'),
      description: Joi.string().allow('').label('Description'),
    })

    return schema.validate(role)
  }
}

module.exports = Roles
