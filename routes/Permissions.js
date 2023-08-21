const express = require('express')
const route = express.Router()
const { Permissions } = require('../startup/models')
const auth = require('../middleware/auth')

//::: GET ALL PERMISSIONS :::
route.get('/', auth, (req, res) => {
  Permissions.get(null, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')
    return res.send(result)
  })
})

//::: GET A SINGLE PERMISSION :::
route.get('/:id', auth, (req, res) => {
  const { id } = req.params
  Permissions.get(id, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')
    if (result.length === 0) return res.send({})
    const role = result[0]
    return res.send(role)
  })
})

//::: ADD PERMISSION :::
route.post('/', auth, (req, res) => {
  Permissions.add(null, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    req.body.id = result.insertId
    return res.send(req.body)
  })
})

//::: UPDATE PERMISSION :::
route.put('/:id', auth, (req, res) => {
  const { id } = req.params

  Permissions.add(id, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    return res.send(req.body)
  })
})

//::: DELETE PERMISSION :::
route.delete('/:id', auth, (req, res) => {
  const { id } = req.params
  Permissions.delete(id, (error, result) => {
    if (error) return res.status(500).send('Could not delete permission')

    return res.send({"message":result.affectedRows===1 ?"Record deleted successfully":"No record found"})
  })
})

module.exports = route
