const dotenv = require('dotenv')
const express  = require("express");

const signupRoutes = require('./auth/routes.js')
const homeRoutes = require('./deals/routes.js')
const app = express();
const db = require('./database/database.js')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config();

app.use('/api', signupRoutes) 
app.use('/api/home', homeRoutes)

const PORT = process.env.PORT || 9090; 

db.query("select 1", async (error, result) => {
    if (error) {
        console.log(error , "Error Connnecting to Database");
    } else {
        console.log("DataBase Connected Successfully");
    }
})
 
app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});