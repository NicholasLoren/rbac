const express = require('express')
const route = express.Router()
const db = require('../startup/db')()
const UsersModel = require('../models/Users')
const Users = new UsersModel(db)

/*Getting all users */
route.get('/', (req, res) => {
  Users.get(null, (err, results) => {
    if (err) return res.status(500).send('Server error: Something bad happened')
    res.send(results)
  })
})

/*Getting a user by a specific id*/
route.get('/:id', (req, res) => {
  if (req.params.id == '') {
    return res.status(400).send('Invalid user id')
  }

  Users.get(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).send('Someting went wrong')
    }
    res.send(result)
  })
})

/*Adding a new user*/

route.post("/",(req,res)=>{
     
    Users.add(req.body,null,(err,result)=>{
        if(err){
            return res.status(400).send(err)
        }
        req.body['id'] = result.insertId
        res.send(req.body)
    })
})

module.exports = route
