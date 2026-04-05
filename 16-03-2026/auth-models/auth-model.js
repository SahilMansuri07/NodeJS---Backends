const md5 = require("md5")
const db = require("../config/db.js")
const { sendResponse } = require("../utils/middleware.js")


const signup = async (req, res) => {
    try {

        const {
            username,
            email,
            mobile,
            password
        } = req.body
        
        const [existingData] = await db.query(`SELECT username , email , mobile FROM tbl_user WHERE (username = ? OR email = ? OR mobile = ?) AND is_active = 1`,[username , email , mobile])
        let message = ""
        if(existingData.length > 0){
            const user = existingData[0]
            if(user.username === username){
                message += "Username Already Exist"
            }
            else if(user.email === email){
                message += "Email Already Exist"
            }
            else if(user.mobile === mobile){
                message += "Mobile Already Exist"
            }
            return sendResponse(req, res, 401 , 0 , message )
        }else{
            const [signupData] = await db.query(`INSERT INTO tbl_user (username , email , mobile , password) VALUES(?,?,?,?)`, [username, email, mobile, md5(password)])
    
            if (signupData.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, "User Register SuccessFully")
            }
        }

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

const updateDetails = async (req ,res) => {
    try{
     
    const {

    } = req.body

        
    }catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
}

module.exports = { signup }