const route = require("express").Router()

const { Categories } = require('../startup/models')
const auth = require('../middleware/auth')

//::: GET ALL CATEGORIES :::
route.get('/', auth, (req, res) => {
  Categories.get(null, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')

    return res.send(result)
  })
})

//::: GET A SINGLE CATEGORY :::
route.get('/:id', auth, (req, res) => {
  const { id } = req.params
  Categories.get(id, (error, result) => {
    if (error) return res.status(500).send('Something went wrong')
    if (result.length === 0) return res.send({})
    const category = result[0]
    return res.send(category)
  })
})

//::: ADD CATEGORY :::
route.post('/', auth, (req, res) => {
  Categories.add(null, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    req.body.id = result.insertId
    return res.send(req.body)
  })
})

//::: UPDATE CATEGORY :::
route.put('/:id', auth, (req, res) => {
  const { id } = req.params

  Categories.add(id, req.body, (error, result) => {
    if (error) return res.status(400).send(error)
    return res.send(req.body)
  })
})

//::: DELETE Category :::
route.delete('/:id', auth, (req, res) => {
  const { id } = req.params
  Categories.delete(id, (error, result) => {
    if (error) return res.status(500).send('Could not delete role')
    return res.send(result)
  })
})



module.exports = route