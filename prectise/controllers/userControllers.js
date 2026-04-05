const db = require("../config/db_config.js");

//get data details 
const getUsers = async (req, res) => {
    try {
        const data = await db.query("select * from tbl_user u JOIN tbl_user")
            .then((rows) => {
                res.json({
                    message: "successfully getting the data",
                    data: rows[0]
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Error Geting data",
                    error: err.message
                })
            });

    } catch (error) {
        res.status(500).json({
            message: "Error Geting data",
            error: error.message
        })
    }
};


//get single user details
const getUserById = async (req, res) => {
    try {
        //getting userid from parameters
        const userID = req.params.id

        const data = await db.query(`SELECT * FROM tbl_user where id = ?`, [userID])
            .then((rows) => {
                res.status(200).json({
                    message: "Student Details With Id",
                    data: rows[0]
                })
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error Geting data",
                    error: error.message
                })
            })

    } catch (error) {
        res.status(500).json({
            message: "Error Getting Students Data",
            error: error.message
        })
    }
}


//add new students into database
const addUsers = async (req, res) => {
    try {
        const userData = {
            username ,
            first_name ,
            last_name,
            country_code ,
            mobile,
            email ,
            password ,
            bio ,
            profile_pic ,
            banner_pic ,
            referral_code ,
            latitude ,
            longitude
        }
        const { userData} = req.body
        const result = await db.query('INSERT INTO tbl_user (username , first_name , last_name , country_code ,mobile ,email  ,password, bio, profile_pic, banner_pic, referral_code, latitude, longitude) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [username, first_name, last_name, country_code, mobile, email, password, bio, profile_pic, banner_pic, referral_code, latitude, longitude])
            .then((rows) => {
                res.status(200).json({
                    message: "User added Successfully"
                })
            })
            .catch((error) => {
                res.status(500).json({
                    message: "Error Adding User Data",
                    error: error
                })
            })

    } catch (error) {
        res.status(500).json({
            message: "Error Getting Students Data",  
            error: error.message
        })      
    }
}

//delete user based on ID

const deleteUser = async (req , res) => {
    try {
        const userID = req.params.id
        const result = await db.query(`DELETE FROM tbl_user WHERE id = ?`, [userID])
        .then((rows) => {
            res.status(200).json({
                message : "User Deleted Successfully"
            })           
        })
        .catch((error) => {
            res.status(500).json({
            message : "error Getting Id or Invailid userId ",
            error : error
        })
        })
    } catch (error) {
        res.status(500).json({
            message : "error Getting Id or Invailid userId ",
            error : error
        })
    }
}
module.exports = { getUsers, getUserById, addUsers , deleteUser };