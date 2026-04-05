const dotenv = require('dotenv')
const express  = require("express");

const signupRoutes = require('./routes/v1/auth.routes.js')
const dealsRoutes = require('./routes/v1/deals.routes.js')
const getuserRoute = require('./routes/v1/user.routes.js')


const app = express();
const db = require('./config/config.js')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config();

app.use('/auth/v1', signupRoutes) 
app.use('/api/deals', dealsRoutes)
app.use('/api/user', getuserRoute)

const PORT = process.env.PORT || 9090; 

db.query("SELECT 1").then(() => {
    console.log("DataBase Connected Successfully");
}).catch((error) => {
    console.log(error , "Error Connecting to Database");
});
 
app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});