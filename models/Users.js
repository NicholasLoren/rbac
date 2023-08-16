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
    const validation = this.validate(user, { allowUnknown: true })
    if (validation.error) {
      return callback(validation.error.details[0].message, null)
    }

    const { username, displayName, contact, email, password } = user
    //check if an email or username or contact already exists
    this.connection.query(
      'SELECT * FROM `users` WHERE email=? OR username=? OR contact=? LIMIT 1',
      [email, username, contact],
      (err, result) => {
        if (err) return callback(err, null)

        if (result.length === 1) {
          const existingUser = result[0]
          const conflictField =
            email == existingUser.email
              ? 'Email'
              : username == existingUser.username
              ? 'Username'
              : 'Contact'

          return callback(`${conflictField} already existing`, null)
        }

        if (id) {
          //perform an update
          const { username, displayName, contact, email } = user
          this.connection.query(
            'UPDATE `users` SET `username`=?,`displayName`=?,`email`=?,`contact`=? WHERE `id` = ?',
            [username, displayName, contact, email, id],
            callback
          )
        } else {
          //add new user
          this.connection.query(
            'INSERT INTO `users` (username,displayName,email,contact,password) VALUES (?,?,?,?,?)',
            [username, displayName, email, contact, password],
            (err, result) => {
              return err ? callback(err, null) : callback(null, result)
            }
          )
        }
      }
    )
  }


  delete(id,callback){
    return this.connection.query("DELETE FROM `users` WHERE `id` = ?",[id],callback);
  }

  validate(user, options = null) {
    const schema = Joi.object({
      username: Joi.string().min(3).max(255).trim().label('Username'),
      displayName: Joi.string().min(3).max(255).trim().label('Display name'),
      contact: Joi.string().min(3).max(255).trim().label('Contact'),
      email: Joi.string().email().trim().label('Email'),
      password: Joi.string().min(6).max(255).trim().label('Password'),
    })

    return options ? schema.validate(user, options) : schema.validate(user)
  }
}

module.exports = Users
