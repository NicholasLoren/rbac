const Joi = require('joi')
class Users {
  constructor(connection) {
    this.connection = connection
  }

  /**
   * This method get users or a user specified by an ID
   * If no ID is provided all users will be returned or else a user will be returned
   * @param {Number} id
   * @returns user[s]
   */

  get(id = null, callback) {
    if (id) {
      this.connection.query(
        'SELECT * FROM `users` WHERE `id` = ?',
        [id],
        callback
      )
      return
    }
    this.connection.query('SELECT * FROM `users`', callback)
  }

  add(user, id, callback) {
    //validate the user object first
    const validation = this.validate(user)
    if(validation.error){
        return callback(validation.error.details[0].message,null)
    }

    if (id) {
      //perform an update
    }

    //add new user
    const {username,displayName,contact,email,password} = user
    this.connection.query(
      'INSERT INTO `users` (username,displayName,email,contact,password) VALUES (?,?,?,?,?)',
      [username, displayName, email, contact, password],
      callback
    )
  }

  validate(user) {
    const schema = Joi.object({
      username: Joi.string().min(3).max(255).trim().label('Username'),
      displayName: Joi.string().min(3).max(255).trim().label('Display name'),
      contact: Joi.string().min(3).max(255).trim().label('Contact'),
      email: Joi.string().email().trim().label('Email'),
      password: Joi.string().min(6).max(255).trim().label('Password'),
    })

    return schema.validate(user)
  }
}

module.exports = Users
