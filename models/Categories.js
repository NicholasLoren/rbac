const Joi = require("joi")

class Categories {
  constructor(connection) {
    this.connection = connection
  }
  //::: GET CATEGORY(S):::
  get(id = null, callback) {
    if (id) {
      this.connection.query(
        'SELECT * FROM `permissionscategory` WHERE `id` = ? LIMIT 1',
        [id],
        callback
      )
      return
    }

    this.connection.query('SELECT * FROM `permissionscategory`', callback)
  }

  //::: ADD or UPDATE CATEGORY :::
  add(id = null, category, callback) {
    const validation = this.validate(category)
    if (validation.error)
      return callback(validation.error.details[0].message, null)

    const { name } = category

    if (id) {
      //Update category
      this.connection.query(
        'UPDATE `permissionscategory` SET `name`=? WHERE `id` = ? LIMIT 1',
        [name, id],
        callback
      )
      return
    }

    this.connection.query(
      'INSERT INTO `permissionscategory`(name) VALUES(?)',
      [name],
      callback
    )
  }

  //::: DELETE CATEGORY :::
  delete(id, callback) {
    return this.connection.query(
      'DELETE FROM `permissionscategory` WHERE `id`=? LIMIT 1',
      [id],
      callback
    )
  }

  //::: VALIDATE CATEGORY :::
  validate(category) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).trim().required().label('Name'), 
    })

    return schema.validate(category)
  }
}

module.exports = Categories