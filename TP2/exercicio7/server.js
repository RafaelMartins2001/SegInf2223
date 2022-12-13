const express = require('express')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const FormData = require('form-data');// more info at:
const { newEnforcer } = require('casbin');
const jwt = require('jsonwebtoken');
const client = require('./client')()
const roles = require('./roles')(newEnforcer)
let handlers = require('./api')(axios,client, roles, FormData, jwt)

const port = 3001

const app = express()
app.use(cookieParser());

app.get('/', handlers.getRedirect)

app.get('/login', handlers.getOAuth)


app.get('/'+client.CALLBACK, handlers.postLogin)

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})