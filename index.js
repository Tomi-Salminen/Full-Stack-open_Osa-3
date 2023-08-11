const express = require('express')
const app = express()

let phoneContacts = [
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
    const maxId = phoneContacts.length > 0
        ? Math.max(...phoneContacts.map(p => p.id))
        : 0

    const date = new Date();
    
    res.send(`
        <div>
            <p>Phonebook has info for ${maxId} people </p>
            <p>${date}</p>
        </div>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(phoneContacts)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
