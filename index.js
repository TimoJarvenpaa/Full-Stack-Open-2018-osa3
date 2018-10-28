const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

let persons = [{
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/info', (req, res) => {
  res.send(
    `
    <p> puhelinluettelossa ${persons.length} henkilön tiedot </p>
    <p> ${new Date()} </p>
    `
  )
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(formatPerson(person))
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 123456789)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  //const nameExists = persons.find(person => person.name === body.name)

  // if (nameExists) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(savedPerson))
    })

  // persons = persons.concat(person)

  // response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})