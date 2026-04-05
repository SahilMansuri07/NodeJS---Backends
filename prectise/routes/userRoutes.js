const express = require('express');
const router = express.Router();

// imported controllers
const { getUsers, getUserById , addUsers, deleteUser } = require('../controllers/userControllers');


//get Details of all user from this routes
router.get('/getUsers', getUsers)

//get single user with id 
router.get('/userByid/:id', getUserById)

//Add new user data
router.post('/addUser', addUsers)


//delete User
router.get('/deleteuser/:id', deleteUser)

//export routes 
module.exports = router