require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
var morgan = require('morgan')

const app = express()

morgan.token('body', function returnBody (req) {
    return JSON.stringify(req.body) 
})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

mongoose.set('strictQuery', false)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5325323"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const maxId = Person.length > 0
        ? Math.max(...Person.map(p => p.id))
        : 0

    const date = new Date();
    
    res.send(`
        <div>
            <p>Phonebook has info for ${maxId} people</p>
            <p>${date}</p>
        </div>
    `)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => res.json(people))
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => res.json(person))

    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
})

generateId = () => {
    const id = Math.floor(Math.random() * (10 - 4) + 5)
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name && !body.number) {
        return res.status(400).json({
            error: 'Name and number missing.'
        })
    } else if (!body.name) {
        return res.status(400).json({
            error: "Name missing."
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "Number missing."
        })
    }

    // const duplicate = persons.filter(p => p.name === body.name)

    // if (duplicate[0] !== undefined) {
    //         return res.status(400).json({
    //         error: "Name must be unique."
    //     })
    // }

    const person = new Person({
        // id: generateId(),
        name: body.name,
        number: body.number
    })
    console.log(person)
    
    person.save().then(savedPerson => {
        console.log('saven jälkeen')
        res.json(savedPerson)        
        console.log('res.jsonin jälkeen')
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})