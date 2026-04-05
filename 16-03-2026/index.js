const express = require('express')
const env = require('dotenv')
const db = require('./config/db.js')
const signupRoutes = require('./auth-models/auth-routes.js')

env.config()
const app = express()

app.use(express.urlencoded({ extended: true })); 

app.use(express.json())
app.use('/auth/v1' , signupRoutes);




const PORT = process.env.PORT || 7000; 

db.query('SELECT 1').then(() => {
    console.log("DataBase Connected Successfully");
}).catch((error) => {
    console.log(error , "Error Connecting to Database");
}); 

app.get('/' , (req , res) => {
    res.send("this is test url")
})

app.listen(PORT , () => {
    console.log(`Server Running At http://localhost:${PORT}`)
})
