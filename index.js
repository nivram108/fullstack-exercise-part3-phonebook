const express = require('express')
const { request, response } = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(morgan(function (tokens, req, res) {
  // console.log("token:", req.body)
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
let persons = 
[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook backend</h1>')
})

app.get('/persons', (request, response) => {
  const person = request.body
  // console.log("get/ :", person)
  response.json(persons)
})

app.get('/info', (request, response) => {
  const person = request.body
  // console.log("date :", request.headers)
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  // console.log("person :", person)
  if(person) {
    response.json(person)
  } else {
    response.status(404).end
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.send(204).end
})

const generateId = () => {
  const max = 999
  return Math.round(Math.random() * max)
}
const usedId = []
app.post('/persons', (request, response) => {
  const body = request.body
  // console.log("post body:", body)
  if(!body.name || !body.number) {
    return response.status(400).json({
      error:"name or number missing"
    })
  } else if(persons.findIndex(person => person.name === body.name) !== -1) {
    return response.status(400).json({
      error:"name must be unique"
    })
  }

  let id = generateId()
  while(usedId.findIndex(index => index === id) !== -1) {
    id = generateId()
  }

  const person = {
    name: body.name,
    number: body.number,
    id: body.id
  }

  persons = persons.concat(person)
  console.log("new persons:", persons)
  response.json(person)

})
const PORT=3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})