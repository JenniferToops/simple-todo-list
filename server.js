const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'))
app.use(express.static('files'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo-list'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to ${dbName} Database')
        db = client.db(dbName)
    })

app.get('/', (request, response) => {
    db.collection('todo-list').find({}).sort().toArray()
    .then(data => {
        response.render('index.ejs', {info: data})
    })
    .catch(error => console.log(error))
})

app.post('addTodo'), (request, response) => {
    db.collection('todo').insertOne({todos: request.body.item})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
}

app.listen(process.env.PORT || PORT, () => {
        console.log('Server running on port ${PORT}')
    })