const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

app.get('/info', (request, response) => {
  Person
    .countDocuments({})
    .then(result => {
      response.send(
        `
        <p> puhelinluettelossa ${result} henkilön tiedot </p>
        <p> ${new Date()} </p>
        `
      )
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({
        error: 'malformed id'
      })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(response.status(204).end())
    .catch(error => {
      console.log(error)
      response.status(400).send({
        error: 'malformed id'
      })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).send({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  Person
    .findOne({
      name: person.name
    })
    .then(foundPerson => {
      if (foundPerson) {
        response.status(409).send({
          error: 'name must be unique'
        })
      } else {
        person
          .save()
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {
      new: true
    })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({
        error: 'malformed id'
      })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})