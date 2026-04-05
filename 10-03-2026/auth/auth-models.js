const db = require('../database/database.js')
const md5 = require('md5')
const otpFunction = require('../constrain.js');

//signup API 
const signup = (req, res) => {

    try {

        const { username, country_code, mobile, email, password, referral_code } = req.body;

        //check missing Fields
        if (!username || !country_code || !mobile || !email || !password) {
            return res.send({
                code: 0,
                message: "All Fields Required"
            })
        }

        //check existing data 
        const q1 = `
        SELECT username , email , mobile 
        FROM tbl_user 
        WHERE (username = ? OR email = ? OR mobile = ?) 
        AND status='Active'
        `;

        db.query(q1, [username, email, mobile], (error, result1) => {

            if (error) {
                return res.json({ code: 0, message: "Database Error", error })
            }

            if (result1.length > 0) {

                let user = result1[0];
                let message = ""

                if (username === user.username) {
                    message = "Username"
                }
                else if (mobile === user.mobile) {
                    message = "Mobile"
                }
                else if (email === user.email) {
                    message = "Email"
                }

                return res.send({
                    code: 0,
                    message: `${message} Already Exist`
                })
            }

            //if data is not exist then insert data into table 
            const hashedPassword = md5(password)
            const is_steps = 1

            const insertUser = `
            INSERT INTO tbl_user 
            (username, country_code, mobile, email, password, referral_code , is_steps)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `

            db.query(
                insertUser,
                [username, country_code, mobile, email, hashedPassword, referral_code, is_steps],
                (error, result) => {

                    if (error) {
                        return res.json({
                            code: 0,
                            message: "Failed to register user",
                            error
                        })
                    }

                    const user_id = result.insertId

                    return otpFunction(req, res, user_id, 'register')
                }
            )

        })

    } catch (error) {

        res.json({
            message: "Catch Error",
            error
        })

    }

}

//otp verify based on mobile number 
const otpVerification = (req, res) => {

    const otp = req.body.otp
    const mobile = req.body.mobile
    // check missing fields
    if (!otp) {
        return res.json({
            code: 0,
            message: "Enter OTP FIrst"
        })
    }
    
    // check user mobile 
    const userQuery = `SELECT id FROM tbl_user WHERE mobile = ? AND status = 'Active';`

    db.query(userQuery, [mobile], (error, userData) => {

        if (error) return res.json({ error })

        if(userData.length === 0) {
            return res.json({
                code: 0,
                message: "User not found"
                })
        }

        const userOtpID = userData[0].id
        // match user otp with generated otp 
        const otpQuery = `SELECT * FROM tbl_user_otp WHERE otp = ? AND user_id = ? AND  is_verified = 0;`

        db.query(otpQuery, [otp, userOtpID], (error, result) => {
            console.log(error)
            if (result.length === 0) {
                return res.json({
                    code: 0,
                    message: "Invalid OTP or OTP is Used"
                })
            }

            const purpose = result[0].otp_through
            // if user verify otp view register then only steps will be updated
            if (purpose === "register") {
                const updateuserFlag = `UPDATE tbl_user SET is_phone_verified = 1 , is_steps = 2 WHERE id = ?;`
                db.query(updateuserFlag, [userOtpID], (error, updateuserResult) => {

                    if (updateuserResult.affectedRows <= 0) {
                        return res.json({
                            code: 0,
                            message: "User verfication Failed",
                            user_id: userOtpID
                        })
                    }
                })
            }

            //update user flags
            const updateOtpFlag = `UPDATE tbl_user_otp SET is_verified = 1 WHERE otp = ? AND user_id = ? `
            db.query(updateOtpFlag, [otp, userOtpID], (error, updateResult) => {

                if (updateResult.affectedRows > 0) {
                    return res.json({
                        code: 1,
                        message: "OTP Verified Successfully",
                        data: otp,
                        user_id: userOtpID
                    })
                }
            })
        })
    })
}

//update personal details and update step
const personalDetails = (req, res) => {

    const { first_name, last_name, bio, profile_pic, banner_pic, id } = req.body

    const query = `
    UPDATE tbl_user 
    SET first_name=?, last_name=?, bio=?, profile_pic=?, banner_pic=?  , is_steps = 3
    WHERE id=?
    `
    
    db.query(query, [first_name, last_name, bio, profile_pic, banner_pic, id], (error, result) => {

        if (error) {
            return res.json({ code: 0, message: "Database error", error })
        }
        const updateuserFlag = `UPDATE tbl_user SET is_steps = 4 WHERE id = ?;`
        db.query(updateuserFlag, [id], (error, updateuserResult) => {
        
            if (updateuserResult.affectedRows > 0) {
                return res.json({ code: 1, message: "Details updated successfully" })
            }
            return res.json({ code: 0, message: "User not found" })
            })
    })
}

//forget password api 
const forgetpass = (req, res) => {
    const any = req.body.any

    if (any.length === 0) {
        return res.json({ code: 0, message: "error Getting Data " })
    }
    // get username and email 
    const forgetQ = (`SELECT id , mobile FROM tbl_user WHERE (username = ? OR email = ?) AND status = 'Active' `)
    db.query(forgetQ, [any, any], (error, result) => {
        console.log(error, result)
        const userForgetId = result[0].id
        if (result.length > 0) {
            otpFunction(req, res, userForgetId, 'forgot_password')
        }
    })
}

// resend otp for perticular time 
const resendOtp = (req, res) => {
    const type = req.body.type
    const userId = req.body.userId

    if (type === "forgot_password") {
        return otpFunction(req, res, userId, 'forgot_password')
    } else {
        return otpFunction(req, res, userId, 'register')
    }
}

// call otpverification fucntion to verify password
const passwordverify = (req, res) => {
    otpVerification(req, res);
}

//match updatepassword api
const matchpassword = (req, res) => {

    const forgetuserid = req.body.forgetuserid
    const password = req.body.password
    //update password based on user id 
    const passquery = `UPDATE tbl_user u SET u.password = ?  WHERE u.id = ?`

    db.query(passquery, [md5(password), forgetuserid], (error, oldpassData) => {
        console.log(oldpassData)
        if (!error && oldpassData.affectedRows > 0) {
            return res.send({
                code: 0,
                message: "PassWord Updated Successfully"
            })
        } else {
            res.send({
                error: error
            })
        }
    })
}

//login api 
const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username && !password) {
        return res.send({
            code: 0,
            message: "All Filed Is Required"
        })
    }

    const loginQ = (`SELECT * FROM tbl_user u WHERE u.username = ? AND u.password = ?;`)
    db.query(loginQ, [username, md5(password)], (error, loginData) => {
        console.log(error, loginData)
        if (!error && loginData.length > 0) {
            return res.send({
                code: 1,
                message: "Login SuccessFull",
                data: loginData,
                user_id: loginData[0].id
            })
        } else {
            return res.send({
                code: 0,
                message: "Invailid Username or Password",
            })
        }
    })
}

module.exports = { signup, otpVerification, personalDetails, forgetpass, login, resendOtp, passwordverify, matchpassword }