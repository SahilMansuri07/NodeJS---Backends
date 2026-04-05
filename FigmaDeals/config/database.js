//import mysql database
const mysql = require('mysql');
const credential = require('./credential');

// create object for connection
const connection = {
    host : credential.host,
    password : credential.password,
    user : credential.user,
    database : credential.database
}


//create connection pool 
const database = mysql.createPool(connection);


//export module 
module.exports = database;