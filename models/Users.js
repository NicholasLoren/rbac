const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtPrivateKey } = require('../startup/config')()

class Users {
  validateSchema = {
    role_id: Joi.string().required().label('Role').trim(),
    username: Joi.string().min(3).max(255).trim().label('Username'),
    displayName: Joi.string().min(3).max(255).trim().label('Display name'),
    contact: Joi.string().min(3).max(255).trim().label('Contact'),
    email: Joi.string().required().email().trim().label('Email'),
    password: Joi.string().min(6).max(255).trim().label('Password'),
  }

  constructor(connection) {
    this.connection = connection
  }

  /**
   * This method get users or a user specified by an ID
   * If no ID is provided all users will be returned or else a user will be returned
   * @param {Number} id
   * @returns user[s]
   */

  // ::: GET USER(S) :::
  get(id = null, callback) {
    if (id) {
      this.connection.query(
        'SELECT * FROM `users` WHERE `id` = ?',
        [id],
        callback
      )
      return
    }
    this.connection.query(
      'SELECT `users`.userName,`users`.displayName,`users`.email,`users`.contact,`users`.role_id,`roles`.name AS roleName FROM `users` JOIN `roles` ON `roles`.id = `users`.role_id',
      callback
    )
  }

  //::: ADD AND UPDATE USER :::
  add(user, id, callback) {
    //validate the user object first
    const validation = this.validate(user,this.validateSchema, { allowUnknown: true })
    if (validation.error) {
      return callback(validation.error.details[0].message, null)
    }

    const { role_id, username, displayName, contact, email, password } = user

    //check if an email or username or contact already exists
    this.connection.query(
      'SELECT * FROM `users` WHERE email=? OR username=? OR contact=? LIMIT 1',
      [email, username, contact],
      async (err, result) => {
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
          const { role_id, username, displayName, contact, email } = user
          this.connection.query(
            'UPDATE `users` SET `username`=?,`displayName`=?,`email`=?,`contact`=? WHERE `id` = ?',
            [username, displayName, contact, email, id],
            callback
          )
        } else {
          //encrypt password before stored to the db
          this.hashPassword(password)
            .then((hashedPassword) => {
              //add new user
              this.connection.query(
                'INSERT INTO `users` (role_id,username,displayName,email,contact,password) VALUES (?,?,?,?,?,?)',
                [
                  role_id,
                  username,
                  displayName,
                  email,
                  contact,
                  hashedPassword,
                ],
                (err, result) => {
                  return err ? callback(err, null) : callback(null, result)
                }
              )
            })
            .catch((error) => {
              return callback(error, null)
            })
        }
      }
    )
  }

  //::: DELETE USER :::
  delete(id, callback) {
    return this.connection.query(
      'DELETE FROM `users` WHERE `id` = ?',
      [id],
      callback
    )
  }

  //::: LOGIN USER :::
  login(user, callback) { 
    const {email,password} = this.validateSchema 
    const validation = this.validate(user,{email,password}, { allowUnknown: true })
    //validate email and password
    if (validation.error)
      return callback(validation.error.details[0].message, null)

    //check if user exists
    this.connection.query(
      'SELECT users.*,roles.name AS roleName FROM `users` INNER JOIN roles ON roles.id = users.role_id WHERE `email` = ?',
      [user.email],
      (err, result) => {
        if (err) return callback(err, null)
        if (result.length === 0)
          return callback('Invalid user credentials..', null)

        const userDetails = result[0]
        //check the password if it's correct
        this.verifyPassword(user.password, userDetails['password'])
          .then(() => {
            //remove the password field
            delete userDetails['password']
            return callback(null, { token: this.generateAuthToken(user), user })
          })
          .catch((error) => {
            return callback('Invalid user credentials', null)
          })
      }
    )
  }

  //::: VALIDATE USER :::
  validate(user, validateSchema, options = null) {
    const schema = Joi.object(validateSchema)

    return options ? schema.validate(user, options) : schema.validate(user)
  }

  //::: HASH PASSWORD :::
  hashPassword(password) {
    return new Promise((resolve, reject) => {
      const saltRounds = 10
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  }

  //::: VERIFY PASSWORD :::
  verifyPassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (error, result) => {
        return error ? reject(error) : resolve(result)
      })
    })
  }

  //::: GENERATE USER AUTH TOKEN :::
  generateAuthToken(user) { 
    const secret = jwtPrivateKey
    if (!secret) throw new Error('No private key found for jwt')

    return jwt.sign(user, secret, { expiresIn: '6h' })
  }
}

module.exports = Users
