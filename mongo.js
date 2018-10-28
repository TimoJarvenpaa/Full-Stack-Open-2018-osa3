const mongoose = require('mongoose')

const url = 'mongodb://*:*@ds219641.mlab.com:19641/fullstack-puhelinluettelo'

mongoose.connect(url, {
  useNewUrlParser: true
})

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
}

if (process.argv.length === 2) {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length === 3 || process.argv.length > 4) {
  console.log('error: invalid input');
  mongoose.connection.close()
}