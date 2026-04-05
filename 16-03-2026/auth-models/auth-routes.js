const express = require('express');
const { signup } = require('./auth-model');
const routes = express.Router()

routes.post('/signup' , signup);



module.exports  = routes