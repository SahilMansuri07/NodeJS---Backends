const db = require('../../config/config.js');
const md5 = require('md5');
const { commonApiFunctions, common } = require('../../utils/common.js');
const { sendResponse } = require('../../utils/middleware.js');
const jwt = require("jsonwebtoken");

// Signup API
    const signUp = async (req, res) => {
        try {
            const { username, country_code, mobile, email, password, referral_code } = req.body;

            // Check if user already exists
            const [result1] = await db.query(
                `SELECT username, email, mobile 
                FROM tbl_user 
                WHERE (username = ? OR email = ? OR mobile = ?) 
                AND status = 'Active'`,
                [username, email, mobile]
            );

            if (result1.length > 0) {
                const user = result1[0];
                let message = "";

                if (username === user.username) {
                    message = "Username Already Exists";
                } else if (mobile === user.mobile) {
                    message = "Mobile Already Exists";
                } else if (email === user.email) {
                    message = "Email Already Exists";
                }

                return sendResponse(res, 200, 0, message);
            }

            // Insert new user
            const hashedPassword = md5(password);
            const is_steps = 1;

            const [result] = await db.query(
                `INSERT INTO tbl_user 
                (username, country_code, mobile, email, password, referral_code, is_steps)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [username, country_code, mobile, email, hashedPassword, referral_code, is_steps]
            );

            if (result.affectedRows > 0) {
                const user_id = result.insertId;
                return commonApiFunctions.otpFunction(req, res, user_id, 'register');
            }

            return sendResponse(res, 200, 0, "Failed To Register User");

        } catch (error) {
            console.log(error);
            return sendResponse(res, 500, 0, "Internal Server Error");
        }
    };


// OTP verification based on mobile number
const otpVerification = async (req, res) => {
    try {
        const { otp, mobile } = req.body;

        // Check user by mobile
        const [userData] = await db.query(
            `SELECT * FROM tbl_user WHERE mobile = ? AND status = 'Active'`,
            [mobile]
        );

        if (userData.length === 0) {
            return sendResponse(res, 200, 3, "No Data Found");
        }

        const userOtpID = userData[0].id;

        // Check OTP
        const [otpData] = await db.query(
            `SELECT * FROM tbl_user_otp 
             WHERE otp = ? AND user_id = ?`,
            [otp, userOtpID]
        );

        if (otpData.length === 0) {
            return sendResponse(res, 200, 0, "Invalid OTP");
        }

        if (otpData[0].is_verified === 1) {
            return sendResponse(res, 200, 0, "OTP Already Used");
        }
        const purpose = otpData[0].otp_through;

        // Update user verification if register
        if (purpose === "register") {
            const [updateUser] = await db.query(
                `UPDATE tbl_user 
                 SET is_phone_verified = 1, is_steps = 2 
                 WHERE id = ?`,
                [userOtpID]
            );

            if (updateUser.affectedRows === 0) {
                return sendResponse(res, 200, 0, "User Verification Failed");
            }
        }

        // Mark OTP as verified
        await db.query(
            `UPDATE tbl_user_otp 
             SET is_verified = 1 
             WHERE otp = ? AND user_id = ?`,
            [otp, userOtpID]
        );

        
        // Fetch clean user data
        const user = await common.getUserById(userOtpID);
        
        return sendResponse(res, 200, 1, "OTP Verified Successfully", {
            user: user
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// Update personal details and update step
const setUserDetails = async (req, res) => {
    try {
        const { first_name, last_name , latitude , longitude , bio, profile_pic, banner_pic, user_id } = req.body;
        
        const [result] = await db.query(
            `UPDATE tbl_user 
            SET first_name = ?, last_name = ?, latitude = ? , longitude = ? , bio = ?, profile_pic = ?, banner_pic = ? , is_steps = 3
            WHERE id = ?`,
            [first_name, last_name,latitude,longitude ,bio, profile_pic, banner_pic, user_id]
        );
        
        // Generate login token
        const user = await common.getUserById(user_id);
        const token = await common.generateToken(user, req , res);

        if (result.affectedRows > 0) {
            return sendResponse(res, 200, 1, "User Register Successfully" , {
                token : token ,
                user : user
            });
        }
        
        return sendResponse(res, 200, 3, "User Not Found");
        
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// Forget password API
const forgetPass = async (req, res) => {
    try {
        const any = req.body.any;

        if (!any || any.length === 0) {
            return sendResponse(res, 200, 2, "Username Or Email Is Required");
        }

        const [result] = await db.query(
            `SELECT id, mobile FROM tbl_user WHERE (username = ? OR email = ?) AND status = 'Active'`,
            [any, any]
        );

        if (result.length === 0) {
            return sendResponse(res, 200, 3, "No Account Found With The Provided Details");
        }

        const userForgetId = result[0].id;
        return commonApiFunctions.otpFunction(req, res, userForgetId, 'forgot_password');

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// Resend OTP
const resendOtp = (req, res) => {
    const type = req.body.type;
    const userId = req.body.userId;

    if (type === "forgot_password") {
        return commonApiFunctions.otpFunction(req, res, userId, 'forgot_password');
    } else {
        return commonApiFunctions.otpFunction(req, res, userId, 'register');
    }
};


// Call otpVerification function to verify OTP for password reset
const passwordVerify = (req, res) => {
    otpVerification(req, res);
};


// Update password after OTP verification
const updatePassword = async (req, res) => {
    try {
        
        const { forgetuserid , password } = req.body;
        
        const [result] = await db.query(
            `UPDATE tbl_user SET password = ? WHERE id = ?`,
            [md5(password), forgetuserid]
        );

        if (result.affectedRows > 0) {
            const userData = await common.getUserById(forgetuserid)
         
            return sendResponse(res, 200, 1, "Password Updated Successfully" , {
                userData : userData
            });
        }
        return sendResponse(res, 200, 3, "User Not Found");
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// SignIn API
const signIn = async (req, res) => {
    try {
        // Get username and password from request body
        const { username, password } = req.body;

        // Check if username or password is missing
        if (!username || !password) {
            return sendResponse(res, 200, 2, "Username And Password Are Required");
        }

        // Check user in database with username and encrypted password
        const [loginData] = await db.query(
            `SELECT * FROM tbl_user WHERE username = ? AND password = ?`,
            [username, md5(password)]
        );

        // If no user found
        if (loginData.length === 0) {
            return sendResponse(res, 200, 0, "Invalid Username Or Password");
        }

        // Check if mobile is verified
        if (loginData[0].is_phone_verified === 0) {
            return sendResponse(res, 200, 4, "Mobile Verification Is Pending");
        }

        // Check if profile setup steps are completed
        if (loginData[0].is_steps < 3) {
            return sendResponse(res, 200, 5, "Profile Setup Is Pending");
        }

        // Generate JWT token
        const token = await common.generateToken(loginData, req, res);

        // Send success response with user details and token
        return sendResponse(res, 200, 1, "Login Successful", {
            token: token,
            loginData
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// Logout API
const logOut = async (req, res) => {
    try {

        // Get token from headers
        const token = req.headers['token'];

        // Check if token is missing
        if (!token) {
            return sendResponse(res, 401, 0, "Token is Missing");
        }

        // Update device table to mark user as logged out
        const [logoutQuery] = await db.query(
            `UPDATE tbl_user_device 
             SET is_active = 0 
             WHERE user_token = ? AND is_active = 1`,
            [token]
        );

        // If logout successful
        if (logoutQuery.affectedRows > 0) {
            return sendResponse(res, 200, 1, "Logout Successful");
        }

        // If already logged out
        return sendResponse(res, 200, 0, "User Already Logged Out");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// Edit Profile API
const editProfile = async (req, res) => {
    try {
        // Get user id from decoded token (middleware)
        const userId = req.loginUser.id;

        // Fetch current user details from database
        const [getUserDetails] = await db.query(
            `SELECT username,first_name,last_name,country_code,mobile,email,bio,profile_pic FROM tbl_user WHERE id = ?`,
            [userId]
        );

        console.log(getUserDetails);

        // Get updated fields from request body
        const {
            username,
            first_name,
            last_name,
            country_code,
            mobile,
            email,
            bio,
            profile_pic
        } = req.body;

        // Update user details in database
        const [updateDetails] = await db.query(
            `UPDATE tbl_user 
             SET username = ?, first_name = ?, last_name = ?, country_code = ?, mobile = ?, email = ?, bio = ?, profile_pic = ?
             WHERE id = ?`,
            [username, first_name, last_name, country_code, mobile, email, bio, profile_pic, userId]
        );

        // If update successful
        if (updateDetails.affectedRows > 0) {
            return sendResponse(res, 200, 1, "Details Updated Successfully");
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// Change Password API
const changePassword = async (req, res) => {
    try {
        // Get user id from token
        const userId = req.loginUser.id;

        const {
            old_pass,
            new_pass
        } = req.body;

        // Check if old password is correct
        const [getPassword] = await db.query(
            `SELECT id FROM tbl_user WHERE password = ? AND id = ?`,
            [md5(old_pass), userId]
        );

        if (getPassword.length > 0) {

            // Update new password
            const [updatePass] = await db.query(
                `UPDATE tbl_user SET password = ? WHERE id = ?`,
                [md5(new_pass), userId]
            );

            // If password updated successfully
            if (updatePass.affectedRows > 0) {
                return sendResponse(res, 200, 1, "Password Changed Succesfully");
            }

        } else {
            // If old password is incorrect
            return sendResponse(res, 400, 0, "Wrong Password Entered");
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


module.exports = {
    signUp,
    otpVerification,
    setUserDetails,
    forgetPass,
    signIn,
    resendOtp,
    passwordVerify,
    updatePassword,
    logOut,
    editProfile,
    changePassword
};