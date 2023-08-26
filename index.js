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
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

mongoose.set('strictQuery', false)

app.get('/info', async (req, res) => {
    try {
        const maxId = await Person.countDocuments({ })
        console.log(maxId)

        const date = new Date();
        
        res.send(`
            <div>
                <p>Phonebook has info for ${maxId} people</p>
                <p>${date}</p>
            </div>
        `)
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => res.json(people))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch (error => next(error)) 
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name && !body.number) {
        return res.status(400).json({
            error: 'Name and phone number missing.'
        })
    } else if (!body.name) {
        return res.status(400).json({
            error: "No name added."
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "No phone number added."
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    console.log(person)
    
    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch (error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
    
    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },        
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})