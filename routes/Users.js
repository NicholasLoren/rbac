const express = require('express')
const route = express.Router()
// const db = require('../startup/db')()
// const UsersModel = require('../models/Users')
const {Users} = require("../startup/models")
const auth = require("../middleware/auth")

//:::GET USERS:::
route.get('/',auth, (req, res) => {
  Users.get(null, (err, results) => {
    if (err) return res.status(500).send('Server error: Something bad happened')
    res.send(results)
  })
})

//:::GET USER:::
route.get('/:id',auth, (req, res) => {
  if (req.params.id == '') {
    return res.status(400).send('Invalid user id')
  }

  Users.get(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).send('Someting went wrong')
    }
    res.send(result.length==1?result[0]:{})
  })
})

//:::ADD USER:::
route.post('/',auth, (req, res) => {
  Users.add(req.body, null, (err, result) => {
    if (err) {
      if (typeof err === 'object') return res.status(500).send(err.sqlMessage)
      return res.status(400).send(err)
    }
    req.body['id'] = result.insertId
    //remove password field
    delete req.body['password']
    return res.send(req.body)
  })
})

//::: UPDATE USER :::
route.put('/:id',auth, (req, res) => {
  const { id } = req.params
  Users.add(req.body, id, (err, result) => {
    if (err) return res.status(400).send(err)

    return res.send('Changes saved successfully')
  })
})

//::: DELETE USER :::
route.delete('/:id',auth, (req, res) => {
  const { id } = req.params

  if (id)
    Users.delete(id, (err, result) => {
      if (err) {
        return res.status(400).send(err)
      }

      return res.send(
        result.affectedRows == 1 ? 'User deleted successfully' : 'No user found'
      )
    })
})

//::: LOGIN USER :::
route.post('/me', (req, res) => {
  const user = {email: req.body.email,password:req.body.password}
  Users.login(user,(err, result) => {
    if (err) return res.status(400).send(err)
    return res
      .header('x-auth-token', result.token)
      .header('x-access-control-expose-headers', 'x-auth-token')
      .send(result.user)
  })
})

module.exports = route
