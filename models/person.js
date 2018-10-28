const mongoose = require('mongoose')

const url = 'mongodb://Timo:zireael7@ds219641.mlab.com:19641/fullstack-puhelinluettelo'

mongoose.connect(url, {
  useNewUrlParser: true
})

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person