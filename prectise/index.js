// import express 
const express = require('express');
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes')

//configure .env file 
dotenv.config();

// use express framework  in app
const app = express();

// it enable use of json throught the application
app.use(express.json());
app.use('/api', userRoutes);
     
// get testing url 
// app.get('/test', (req, res) => {
//     res.status(200).send("<h1> Students details </h1>");
// })

//use port number from .env file
const PORT = process.env.PORT || 8080;

//listing application 
app.listen(PORT, () => {
    console.log(`Server is runnig on PORT ${process.env.PORT}`)
})