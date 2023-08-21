const mongoose = require('mongoose')

mongoose.set('strictQuery')

const url = `mongodb+srv://tomimsalminen:${password}@puhelinluettelo.x11l7sc.mongodb.net/?retryWrites=true&w=majority`

console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB:', error.message))