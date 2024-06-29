const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('body',(req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () =>{
    let newId
    do{
        newId = Math.floor(Math.random() * 10000000).toString()
    }while(persons.some(person => person.id === newId))
    return newId
}

app.get('/api', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info',(request,response)=>{
    const currentDate = new Date()
    const entries = persons.length 
    
    response.send(`<p>PhoneBook has info for  ${entries} people</p>
                    <p>${currentDate}</p>`)
})

app.get('/api/persons/:id' , (request,response)=>{
    const id= request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(400).end()
    }
})

app.delete('/api/persons/:id' ,(request,response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons',(request,response)=>{
    const body= request.body

    if(!body.name || !body.number){
       return response.status(400).json({
        error: 'name or number missing'
        })
    }

    const existingPerson = persons.find(person => person.name === body.name)

    if(existingPerson){
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const newPerson ={
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})