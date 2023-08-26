const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name is too short."],
        required: [true, "No name added."]
    },
    number: {
        type: String,
        minlength: [8, 'Phone number is too short.'],
        required: [true, 'No phone number added.'],
        validate: {
            validator: function(v) {
                return /[0-9]{3}-[0-9]{7}/.test(v) || /[0-9]{2}-[0-9]{7}/.test(v)
            },
            message: props => `${props.value} is not a valid format for a phone number.`
        },
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)