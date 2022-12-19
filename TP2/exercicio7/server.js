const express = require('express')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const FormData = require('form-data');// more info at:
const jwt = require('jsonwebtoken');
const client = require('./client')()
const roles = require('./roles.js');
const data = require('./data')
let handlers = require('./api')(axios,client, roles, FormData, jwt, data)


const port = 3001

const app = express()
app.use(cookieParser());

app.get('/', handlers.getRedirect)

app.get('/login', handlers.getOAuth)

app.get('/'+client.CALLBACK, handlers.postLogin)

app.get('/lists/:limit', handlers.getLists)

/*app.post('/lists/:listId&:listTitle', handlers.createList)

app.post('/task/:taskDescription', handlers.createTask)*/


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})