const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const common = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")
const md5 = require("md5")
const dotenv = require("dotenv")

dotenv.config()


const signUp = async (req, res) => {
    try {
        const userObj = {
            username: req.body.username,
            email: req.body.email,
            country_code: req.body.country_code,
            mobile_number: req.body.mobile_number,
            password: md5(req.body.password)
        }

        const userExistResult = await db.query("SELECT * from tbl_user where username=? or email=? or (country_code=? and phone=?)", [userObj.username, userObj.email, userObj.country_code, userObj.mobile_number])

        if (userExistResult && userExistResult[0].length > 0) {

            if (userExistResult[0][0].username == userObj.username) {
                return sendResponse(req, res, 200, 0, 'Username Already Exist', {})
            }

            if (userExistResult[0][0].email == userObj.email) {
                return sendResponse(req, res, 200, 0, 'Email Already Exist', {})
            }

            if (userExistResult[0][0].country_code == userObj.country_code && userExistResult[0][0].phone == userObj.mobile_number) {
                return sendResponse(req, res, 200, 0, 'Phone Number Already Exist', {})
            }
        }

        const newUser = await db.query(
            "INSERT INTO tbl_user(username,email,country_code,phone,password) values(?,?,?,?,?)",
            [userObj.username, userObj.email, userObj.country_code, userObj.mobile_number, userObj.password]
        )
        // console.log(newUser)
        if (newUser[0].insertId > 0) {

            const userData = await common.getUser(newUser[0].insertId)
            // console.log(userData)

            if (userData && userData != null) {
                return sendResponse(req, res, 201, 4, "Profile Set Up Pending", {
                    "userData": userData
                })
            }
            return sendResponse(req, res, 200, 3, "Could Not Be Able To Fetch Data For The Given User", {})

        }
        return sendResponse(req, res, 200, 0, "Error During Performing Insert In User Registration Table", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 400, 0, "Error During Registration", {})
    }
}

const profileSetUp = async (req, res) => {
    // console.log("hello")
    try {
        let updateObjUser = {
            id: req.body.user_id,
            full_name: req.body.full_name,
            dob: req.body.dob,
            completed_step: 2
        }
        console.log(updateObjUser)
        const userExist = await common.getUser(updateObjUser.id);

        console.log(userExist)

        if (!userExist || userExist.length === 0) {
            return sendResponse(req, res, 200, 3, "User Not Found", {})
        }

        if (userExist.completed_step == 2) {
            return sendResponse(req, res, 200, 1, "User Already Completed The Setup Steps", {})
        }

        const updateResult = await db.query(
            "UPDATE tbl_user SET full_name=?, dob=?, completed_step=? WHERE id=?",
            [updateObjUser.full_name, updateObjUser.dob, updateObjUser.completed_step, updateObjUser.id]
        );

        const userData = await common.getUser(updateObjUser.id);
        console.log(userData)
        console.log(updateResult)

        if (updateResult[0].affectedRows > 0) {
            console.log(updateResult)
            const token = common.jwt_sign({
                "user_id": updateObjUser.id,
                "username": userData.username,
                "phone": userData.phone
            }, "365d")

            const bearerToken = token.replace("Bearer ", "").trim();

            const deviceObj = {
                user_id: updateObjUser.id,
                token: bearerToken,
                device_type: req.body.device_type,
                device_name: req.body.device_name,
                device_model: req.body.device_model,
                os_version: req.body.os_version,
                ip: req.body.ip
            }

            let deviceResult = await common.addDeviceData(deviceObj)

            if (deviceResult == null) {
                return sendResponse(req, res, 200, 0, "Error While Adding Device Data", {})
            }

            return sendResponse(req, res, 200, 1, "Sign Up Successfull", {
                "userData": userData,
                "token": token
            })


        } else {
            return sendResponse(req, res, 500, 0, "Error During Updating User Profile", {})
        }

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Error While Profile Set Up", {})
    }
}

// signIn Api
const signIn = async (req, res) => {
    try {
        const isUserExist = await db.query("SELECT id from tbl_user where username=? and password=?", [req.body.username, md5(req.body.password)])
        // console.log(isUserExist[0][0].id)
        if (isUserExist && isUserExist[0].length > 0 && isUserExist[0][0].id > 0) {
            const userData = await common.getUser(isUserExist[0][0].id)
            // console.log(userData)
            let token = ""

            if (userData.is_active == 0 || userData.is_delete == 1) {
                return sendResponse(req, res, 200, 0, "User Locked", {})
            }

            if (userData.completed_step == 1) {
                return sendResponse(req, res, 200, 4, "Pending Profile Setup", {
                    "userData": userData,
                    "token": token
                })
            }

            token = common.jwt_sign({
                "user_id": userData.id,
                "username": userData.username,
                "phone": userData.phone
            }, "365d")

            const bearerToken = token.replace("Bearer ", "").trim();
            const user_id = isUserExist[0][0].id
            const deviceObj = {
                user_id: user_id,
                token: bearerToken,
                device_type: req.body.device_type,
                device_name: req.body.device_name,
                device_model: req.body.device_model,
                os_version: req.body.os_version,
                ip: req.body.ip
            }

            let deviceResult = await common.addDeviceData(deviceObj)
            if (deviceResult == null) {
                return sendResponse(req, res, 200, 0, "Error While Adding Device Data", {})
            }

            return sendResponse(req, res, 200, 1, "Login Success", {
                "userData": userData,
                "token": token
            })

        }
        return sendResponse(req, res, 200, 3, "User Not Exist", {})
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Login", {})
    }
}



const forgotPassword = async (req, res) => {

    try {
        if (!req.body || (!req.body.email && !req.body.country_code && !req.body.phone)) {
            return sendResponse(req, res, 400, 0, "Email or Phone Number Required", {})
        }
        const { email, country_code, phone } = req.body
        const isUserExist = await db.query("SELECT id from tbl_user where (email=? or (country_code=? and phone=?)) and is_active=1 and is_delete=0", [email, country_code, phone])
        console.log(isUserExist)
        if (isUserExist && isUserExist[0] && isUserExist[0].length > 0 && isUserExist[0][0].id > 0) {

            const userData = await common.getUser(isUserExist[0][0].id)
            console.log(userData)
            let otpData = null
            if (email && !country_code && !phone) {
                
                otpData = await generateOtp(userData.id, userData.email, null, 'F')
                // console.log(otpData);
            } else if (!email && country_code && phone) {
                otpData = await generateOtp(userData.id, null, userData.country_code + userData.phone, 'F')
                // console.log(otpData);
            }

            if (otpData && otpData.otp === null) {
                return sendResponse(req, res, 200, 0, otpData.err, {})
            }
            else if (otpData && otpData.otp != null) {
                return sendResponse(req, res, 200, 1, "OTP Sent", {
                    "otpData": otpData
                })
            }
            else {
                return sendResponse(req, res, 200, 0, "Couldn't Generate OTP", {})
            }
        }
        return sendResponse(req, res, 200, 3, "User Not Found", {})


    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, `Error During Forgot Password`, {})
    }

}

const resendOtp = async (req, res) => {

    try {
        const otpObj = {
            "phone": req.body.phone,
            "email": req.body.email
        }
        if (!otpObj.email && !otpObj.phone) {
            return sendResponse(req, res, 400, 0, "Email or Phone Required", {})
        }

        const phoneExistData = await db.query("SELECT id from tbl_user where email=? or concat(country_code,phone)=?", [otpObj.email, otpObj.phone])

        // console.log(phoneExistData)
        if (phoneExistData && phoneExistData[0].length > 0 && phoneExistData[0][0].id > 0) {

            userData = await common.getUser(phoneExistData[0][0].id)
            // console.log(userData)

            if (userData && Object.keys(userData).length > 0) {

                let otpData = ""
                if (otpObj.phone && !otpObj.email) {
                    otpData = await generateOtp(userData.id, null, userData.country_code + userData.phone, 'F')
                } else if (otpObj.email && !otpObj.phone) {
                    otpData = await generateOtp(userData.id, userData.email, null, 'F')
                }

                if (otpData && Object.keys(otpData).length > 0 && otpData.otp === null) {
                    return sendResponse(req, res, 500, 0, otpData.err, {})
                }
                else if (otpData && Object.keys(otpData).length > 0 && otpData.otp != null) {
                    return sendResponse(req, res, 200, 1, "New Otp Sent", {
                        "otpData": otpData
                    })
                }
                return sendResponse(req, res, 500, 0, "Error During Resend Otp", {})
            }
            return sendResponse(req, res, 500, 0, "Error During Resend Otp When Fetching Data ", {})
        }
        return sendResponse(req, res, 200, 3, "Phone Number or Email Not Found", {})


    } catch (err) {
        // console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Resend Otp", {})
    }
}

const verifyOtp = async (req, res) => {
    try {

        const otpObj = {
            "email": req.body.email,
            "phone": req.body.phone,
            "otp": req.body.otp
        }

        // console.log(otpObj)
        if (!otpObj.email && !otpObj.phone) {
            return sendResponse(req, res, 400, 0, "Email or Phone Required", {})
        }

        const phoneExistData = await db.query("SELECT id from tbl_user where email=? or concat(country_code,phone)=?", [otpObj.email, otpObj.phone])

        if (phoneExistData && phoneExistData[0] && Object.keys(phoneExistData[0]).length > 0) {

            let query = ""

            if (otpObj.email && !otpObj.phone) {
                query = `SELECT user_id,phone,email,otp,created_at,expired_on from tbl_otp where email='${otpObj.email}' and type='F' and created_at=(SELECT created_at from tbl_otp where email='${otpObj.email}' and type='F' ORDER BY created_at desc limit 1)`
            }
            else if (otpObj.phone && !otpObj.email) {
                query = `SELECT user_id,phone,email,otp,created_at,expired_on from tbl_otp where phone='${otpObj.phone}' and type='F' and created_at=(SELECT created_at from tbl_otp where phone='${otpObj.phone}' and type='F' ORDER BY created_at desc limit 1)`
            }
            const otpExistData = await db.query(query)

            // console.log(otpExistData[0])
            if (otpExistData && Object.keys(otpExistData[0]).length > 0 && otpExistData[0][0].user_id > 0) {

                if (otpExistData[0][0].otp != otpObj.otp) {
                    return sendResponse(req, res, 200, 0, "OTP Invalid", {})
                }

                if (otpExistData[0][0].expired_on < new Date()) {
                    return sendResponse(req, res, 200, 0, "OTP Expired", {})
                }

                userData = await common.getUser(otpExistData[0][0].user_id)
                // console.log(userData)

                if (userData) {

                    let query = ""

                    if (otpObj.email && !otpObj.phone) {
                        query = `DELETE FROM tbl_otp where user_id=${otpExistData[0][0].user_id} and email='${otpExistData[0][0].email}' and type='F'`
                    }
                    else if (otpObj.phone && !otpObj.email) {
                        query = `DELETE FROM tbl_otp where user_id=${otpExistData[0][0].user_id} and phone='${otpExistData[0][0].phone}' and type='F'`
                    }


                    const dltOtp = await db.query(query)

                    // console.log("Deleted")
                    // console.log(dltOtp)
                    if (dltOtp[0].affectedRows > 0) {
                        // console.log("Success")
                        return sendResponse(req, res, 200, 5, "Otp Verified & Enter New Password", {})
                    }
                    return sendResponse(req, res, 500, 0, "OTP Verified But Error At Deleting Old Otp", {})

                }
                return sendResponse(req, res, 500, 0, "OTP Verified But Error At Getting User", {})
            }
            return sendResponse(req, res, 200, 3, "No OTP Data Found", {})

        }
        return sendResponse(req, res, 200, 3, "Phone Number Or Email Not Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Otp Verification", {})
    }
}

const generateOtp = async (userId, email = null, phone = null, purpose) => {

    try {

        const otpResult = await db.query("SELECT id,phone,otp,created_at from tbl_otp where user_id=? and type=? ORDER BY created_at DESC LIMIT 1", [userId, purpose])

        // console.log(otpResult)
        // console.log(otpResult[0])

        const MinutesAgo = new Date(Date.now() - 60 * 1000);

        if (otpResult && otpResult[0].length > 0 && new Date(otpResult[0][0].created_at) > MinutesAgo) {
            // console.log("Success")
            return {
                otp: null,
                err: "Please Wait 1 Minutes"
            }
        }
        const otp = "123123"


        let newOtp = null
        if (email && !phone) {
            newOtp = await db.query("INSERT INTO tbl_otp(user_id,email,otp,type,created_at,expired_on) values (?,?,?,?,now(),now()+INTERVAL 5 MINUTE)", [userId, email, otp, purpose])
        }
        else if (!email && phone) {
            newOtp = await db.query("INSERT INTO tbl_otp(user_id,phone,otp,type,created_at,expired_on) values (?,?,?,?,now(),now()+INTERVAL 5 MINUTE)", [userId, phone, otp, purpose])
        }

        // console.log(newOtp)
        let otpData = {}
        if (newOtp && newOtp[0].insertId > 0) {
            const newOtpResult = await db.query("SELECT * from tbl_otp where id=?", [newOtp[0].insertId])

            if (newOtpResult && newOtpResult[0].length > 0) {
                otpData = newOtpResult[0][0]
            }
        }
        // console.log(otpData)

        if (Object.keys(otpData).length === 0) {
            return {
                otp: null,
                err: "Error During Otp Generate"
            }
        } else {
            return otpData
        }
    } catch (err) {
        return {
            otp: null,
            err: err
        }
    }

}

const updatePassword = async (req, res) => {
    try {
        const id = req.body.id
        const newPassword = md5(req.body.newPassword)

        const user = await common.getUser(id)
        // console.log(user)
        if (user == null) {
            return sendResponse(req, res, 200, 3, "User Not Found", {})
        }

        const updatePassResult = await db.query("UPDATE tbl_user set password=? where id=?", [newPassword, id])

        const updatedUser = await common.getUser(id)

        if (updatePassResult[0].affectedRows > 0 && updatedUser != null) {
            return sendResponse(req, res, 200, 1, "Password Updated Successfully", {
                "userData": updatedUser
            })
        }
        return sendResponse(req, res, 200, 0, "Password Update Failed", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Password Update", {})
    }
}

const changePassword = async (req, res) => {
    try {

        if (!req.loginUser) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }
        // console.log(req.loginUser)
        let id = req.loginUser.data.user_id
        console.log(id)
        const oldPass = md5(req.body.oldPass)
        const newPass = md5(req.body.newPass)
        const isUserExist = await db.query("SELECT id,password from tbl_user where id=? and is_active=1 and is_delete=0", [id])

        if (isUserExist && isUserExist[0].length > 0 && isUserExist[0][0].id > 0) {
            if (isUserExist[0][0].password != oldPass) {

                return sendResponse(req, res, 200, 0, "Old Password Does Not Match", {})
            }
            if (isUserExist[0][0].password === newPass) {
                return sendResponse(req, res, 200, 0, "New Password Must Be Diffrant from Old Password", {})
            }
            const updateResult = await db.query("UPDATE tbl_user SET password=? where id=?", [newPass, id])
            if (updateResult && updateResult[0].affectedRows > 0) {
                const userData = await common.getUser(id)
                return sendResponse(req, res, 200, 1, "Password Changed Successfully", { "userData": userData })
            }
            return sendResponse(req, res, 500, 0, "Error While Changing Password", {})
        }
        return sendResponse(req, res, 200, 3, "User Not Found", {})


    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, "0", `Error During Changing Password At Checking User Credentials`, {})
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        // console.log(bearerToken)
        const decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);

        // console.log(decoded)

        const result = await db.query("Delete From tbl_user_device where token=? and user_id=?", [bearerToken, decoded.data.user_id])
        // console.log(result)
        if (result && result[0].affectedRows > 0) {
            return sendResponse(req, res, 200, "0", `Logout Successfull`, {})
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, "0", `Error During Logout`, {})
    }
}

module.exports = { signUp, profileSetUp, signIn, forgotPassword, resendOtp, verifyOtp, updatePassword, changePassword, logout }