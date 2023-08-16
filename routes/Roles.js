const express = require('express')
const route = express.Router()
const { Roles } = require('../startup/models')
const auth = require('../middleware/auth')

//::: GET ALL ROLES :::
route.get('/', auth, (req, res) => {
  Roles.get(null, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')

    return res.send(result)
  })
})

//::: GET A SINGLE ROLE :::
route.get('/:id', auth, (req, res) => {
  const { id } = req.params

  if (!id) return res.status(400).send('No role id provided')

  Roles.get(id, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')
    if (result.length === 0) return res.send({})
    const role = result[0]
    return res.send(role)
  })
})

//::: ADD ROLE :::
route.post('/', (req, res) => {
  Roles.add(null, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    req.body.id = result.insertId
    return res.send(req.body)
  })
})

//::: UPDATE ROLE :::
route.put('/:id', (req, res) => {
  const { id } = req.params

  Roles.add(id, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    return res.send(req.body)
  })
})

//::: DELETE ROLE :::

route.delete('/:id', (req, res) => {
  const { id } = req.params
  Roles.delete(id, (error, result) => {
    if (error) return res.status(500).send(error)
    return res.send(result)
  })
})

module.exports = route
