const db = require("../../../config/database.js")
const jwt = require("jsonwebtoken")
const md5 = require("md5")
const dotenv = require("dotenv")
const { sendResponse } = require("../../../utils/middelware.js")
const {common , commonApiFunction} = require("../../../utils/common.js")

dotenv.config()

//SgnUP API : POST // http://localhost:2000/api/v1/auth/signup
const signUp = async (req, res) => {
    try {
        const userObj = {
            email: req.body.email,
            country_code: req.body.country_code,
            mobile_number: req.body.mobile_number,
            password: req.body.password,
            login_type: req.body.login_type,
            social_id: req.body.social_id,
            first_name : req.body.full_name ,
            last_name : req.body.last_name,
            profile_image : req.body.profile_image
        }

        const userExistResult = await db.query("SELECT * from tbl_user where email=? or (country_code=? and mobile_number=?)", [userObj.email, userObj.country_code, userObj.mobile_number])

        if (userExistResult && userExistResult[0].length > 0) {

            if (userExistResult[0][0].email == userObj.email) {
                return sendResponse(req, res, 200, 0, 'Email Already Exist', {})
            }

            if (userExistResult[0][0].country_code == userObj.country_code && userExistResult[0][0].mobile_number == userObj.mobile_number) {
                return sendResponse(req, res, 200, 0, 'Mobile Number Already Exist', {})
            }
        }

        let step_no = 1
        let user_id;

        if (userObj.login_type === "s") {
            const [newSimpleUser] = await db.query(
                "INSERT INTO tbl_user(email,login_type , country_code,mobile_number,password , step_no) values(?,?,?,?,?,?)",
                [userObj.email, userObj.login_type, userObj.country_code, userObj.mobile_number, md5(userObj.password) , step_no]
            )
            if (newSimpleUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 3, "Could Not Be Able To Fetch Data For The Given User", {})
            }
            user_id = newSimpleUser.insertId;
        } else {
            const [newUser] = await db.query(
                "INSERT INTO tbl_user(login_type, country_code, mobile_number, first_name, last_name, profile_image, email, social_id , step_no , is_mobile_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,? , 1)",
                [
                    userObj.login_type,
                    userObj.country_code,
                    userObj.mobile_number,
                    userObj.first_name,
                    userObj.last_name,
                    userObj.profile_image,
                    userObj.email,
                    userObj.social_id,
                    step_no
                ]
            );
            if (newUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 3, "Could Not Be Able To Fetch Data For The Given User", {})
            }
            user_id = newUser.insertId;
        }

        const userData = await common.getUser(user_id);
        if (!userData) {
            return sendResponse(req, res, 200, 0, 'Failed to fetch user data', {});
        }

        await commonApiFunction.otpGenerate(req, res, userData[0].id, userData[0].mobile_number, userData[0].country_code, "signup")
        return sendResponse(req, res, 200, 4, "OTP Send SuccessFully", {
            "userData": userData
        })

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Registration", {})
    }
}

// OTP verification based on mobile number
const otpVerification = async (req, res) => {
    try {
        const { otp, mobile } = req.body;

        const [userData] = await db.query(
            `SELECT * FROM tbl_user WHERE mobile_number = ? AND is_active = 1`,
            [mobile]
        );

        if (userData.length === 0) {
            return sendResponse(req, res, 200, 3, "No Data Found");
        }

        const userOtpID = userData[0].id;

        const [otpData] = await db.query(
            `SELECT * FROM tbl_otp WHERE otp = ? AND user_id = ?`,
            [otp, userOtpID]
        );

        if (otpData.length === 0) {
            return sendResponse(req, res, 200, 0, "Invalid OTP");
        }

        if (otpData[0].is_active === 0) {
            return sendResponse(req, res, 200, 0, "OTP Already Used");
        }

        const purpose = otpData[0].otp_purpose;

        if (purpose === "signup") {
            const [updateUser] = await db.query(
                `UPDATE tbl_user SET is_mobile_verified = 1, step_no = 2 WHERE id = ?`,
                [userOtpID]
            );

            if (updateUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, "User Verification Failed");
            }
        }

        await db.query(
            `UPDATE tbl_otp SET is_active = 0 WHERE otp = ? AND user_id = ?`,
            [otp, userOtpID]
        );

        const user = await common.getUser(userOtpID);

        return sendResponse(req, res, 200, 1, "OTP Verified Successfully & Profile Setup Pending", {
            user: user
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};

const resendOtp = async (req, res) => {
    try {
        const { type, mobile, country_code } = req.body;

        const [result] = await db.query(
            `SELECT id, mobile_number FROM tbl_user WHERE mobile_number = ? AND is_active = 1`,
            [mobile]
        );

        if (result.length === 0) {
            return sendResponse(req, res, 200, 3, "No Account Found With The Provided Details", {});
        }

        const user_Id = result[0].id;
        const otpData = await commonApiFunction.otpGenerate(req, res, user_Id, mobile, country_code, type);

        if (otpData == null) {
            return sendResponse(req, res, 200, 0, "OTP Already Sent. Please Wait 5 Minutes", {});
        }

        return sendResponse(req, res, 200, 1, "OTP sent successfully", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

// Forget password API
const forgetPassword = async (req, res) => {
    try {
        const mobile = req.body.mobile;
        const country_code = req.body.country_code;

        const [result] = await db.query(
            `SELECT id, mobile_number, login_type FROM tbl_user WHERE mobile_number = ? AND country_code = ? AND is_active = 1;`,
            [mobile, country_code]
        );

        if (result.length === 0) {
            return sendResponse(req, res, 200, 3, "No Account Found With The Provided Details");
        }

        if (result[0].login_type !== "s") {
            return sendResponse(req, res, 200, 0, "Social Login User will not be able to Change Password", {})
        }

        const userForgetId = result[0].id;
        const Data = await commonApiFunction.otpGenerate(req, res, userForgetId, mobile, country_code, 'forgotpassword');

        if (Data == null) {
            return sendResponse(req, res, 200, 0, "OTP Already Sent. Please Wait 5 Minutes", {});
        }

        return sendResponse(req, res, 200, 1, "OTP Sent Successfully For ForgetPassword", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};

const forgetOtpVerify = async (req, res) => {
    try {
        await otpVerification(req, res)
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

const updatePass = async (req, res) => {
    try {
        const { newPass, user_id } = req.body

        const [updatedPass] = await db.query("UPDATE tbl_user SET password = ? WHERE id = ?", [md5(newPass), user_id])
        if (updatedPass.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Password Updated Successfully", {})
        }
        return sendResponse(req, res, 200, 0, "Failed Updating Password", {})

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

// Update personal details and update step
const setUserDetails = async (req, res) => {
    try {
        const { first_name, last_name, address, dob, gender, profile_image, user_id } = req.body;

        const [result] = await db.query(
            `UPDATE tbl_user 
            SET first_name = ?, last_name = ?, address = ?, dob = ?, gender = ?, profile_image = ?, step_no = 3
            WHERE id = ?`,
            [first_name, last_name, address, dob, gender, profile_image, user_id]
        );

        const user = await common.getUser(user_id);

        if (result.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "User Register Successfully", {
                user: user
            });
        }

        return sendResponse(req, res, 200, 3, "User Not Found");

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};

const signIn = async (req, res) => {
    console.log(md5('sahil@123'))
    try {
        const { email, password, mobile, country_code, social_id, login_type } = req.body;
        console.log(email , password, mobile, country_code, social_id, login_type )

        let query = "SELECT * FROM tbl_user WHERE is_active = 1 AND ";
        let params = [];

        if (social_id) {
            query += "social_id = ?";
            params = [social_id];
        } else if (email && password) {
            query += "(email = ?) AND password = ?";
            params = [email, md5(password)];
        } else if (mobile && country_code && password) {
            query += "(country_code = ? AND mobile_number = ?) AND password = ?";
            params = [country_code, mobile, md5(password)];
        } else {
            return sendResponse(req, res, 200, 2, "Invalid login credentials provided");
        }
        console.log(query)
        console.log(params)
        const [existingUser] = await db.query(query, params);
        console.log(existingUser)
        if (existingUser.length === 0) {
            return sendResponse(req, res, 200, 0, "Invalid credentials");
        }

        const user = existingUser[0];

        if (user.is_locked === 1) {
            return sendResponse(req, res, 200, 0, "User Has Been Locked");
        }

        if (user.is_mobile_verified === 0) {
            return sendResponse(req, res, 200, 4, "Mobile Verification Is Pending");
        }

        if (user.step_no < 3) {
            return sendResponse(req, res, 200, 5, "Profile Setup Is Pending");
        }

        const token = await common.generateToken(user, req, res)
        return sendResponse(req, res, 200, 1, "Sign In Successful", {
            user_id: user.id,
            email: user.email,
            token
        });

    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};

const logOut = async (req, res) => {
    try {
        const token = req.headers['token'];

        if (!token) {
            return sendResponse(req, res, 200, 0, "Token is Missing");
        }

        const bearerToken = token.replace("Bearer ", "").trim();

        const [logoutQuery] = await db.query(
            `UPDATE tbl_user_device SET is_active = 0 WHERE token = ? AND is_active = 1`,
            [bearerToken]
        );

        if (logoutQuery.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Logout Successful", {});
        }

        return sendResponse(req, res, 200, 0, "User Already Logged Out", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", { error });
    }
}

const changePassword = async (req, res) => {
    try {
        if (!req.loginUser) {
            return sendResponse(req, res, 200, 0, "Error At Fetching Login User Data")
        }

        let id = req.loginUser.id
        const oldPass = md5(req.body.oldPass)
        const newPass = md5(req.body.newPass)

        const isUserExist = await db.query("SELECT id,password, login_type from tbl_user where id=? and is_active=1 and is_delete=0", [id])

        if (isUserExist && isUserExist[0].length > 0 && isUserExist[0][0].id > 0) {
            if (isUserExist[0][0].login_type !== "s") {
                return sendResponse(req, res, 200, 0, "Social Login User will not be able to Change Password", {})
            }
            if (isUserExist[0][0].password != oldPass) {
                return sendResponse(req, res, 200, 0, "Old Password Does Not Match", {})
            }
            if (isUserExist[0][0].password === newPass) {
                return sendResponse(req, res, 200, 0, "New Password Must Be Different from Old Password", {})
            }

            const updateResult = await db.query("UPDATE tbl_user SET password=? where id=?", [newPass, id])
            if (updateResult && updateResult[0].affectedRows > 0) {
                const userData = await common.getUser(id)
                return sendResponse(req, res, 200, 1, "Password Changed Successfully", { "userData": userData })
            }
            return sendResponse(req, res, 200, 0, "Error While Changing Password", {})
        }

        return sendResponse(req, res, 200, 3, "User Not Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, `Error During Changing Password`, {})
    }
}

const getInterest = async (req, res) => {
    try {
        const fetchInterest = await db.query("SELECT * from tbl_interest where is_active=1 and is_delete=0")

        if (fetchInterest && fetchInterest[0].length > 0) {
            return sendResponse(req, res, 200, 1, "Fetch All Interests", {
                fetchInterest: fetchInterest[0]
            })
        }
        return sendResponse(req, res, 200, 3, "No Interests Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, `Internal Server Error`, {})
    }
}

const userInterestSetup = async (req, res) => {
    try {
        let { user_id, interests } = req.body || {};

        if (interests && !Array.isArray(interests)) {
            interests = [interests];
        }

        if (!interests || interests.length === 0) {
            return sendResponse(req, res, 200, 2, 'Please select at least one interest.', {});
        }

        const userDataArray = await common.getUser(user_id);
        const userData = userDataArray[0];

        if (!userData) {
            return sendResponse(req, res, 200, 3, 'User Not Found', {});
        }
        if (userData.step_no > 3) {
            return sendResponse(req, res, 200, 0, 'User Interest setup is already completed.', {});
        }
        if (userData.is_verified === 0) {
            return sendResponse(req, res, 200, 0, 'User is not verified.', {});
        }

        const [validRows] = await db.query(
            'SELECT id FROM tbl_interest WHERE id IN (?)',
            [interests]
        );

        const validIds = validRows.map(row => row.id);

        if (validIds.length !== interests.length) {
            const invalidIds = interests.filter(id => !validIds.includes(Number(id)));
            return sendResponse(req, res, 200, 0, `Interest IDs [${invalidIds}] are not available.`, {});
        }

        const interestValues = validIds.map(id => [user_id, id]);
        await db.query('INSERT INTO tbl_user_interest (user_id, interest_id) VALUES ?', [interestValues]);

        await db.query('UPDATE tbl_user SET step_no = 4 WHERE id = ?', [user_id]);

        const token = await common.generateToken(userData, req, res);

        return sendResponse(req, res, 200, 1, 'User Interest setup completed successfully', {
            userData: userData,
            token
        });

    } catch (error) {
        console.error("Error in user interest setup:", error);
        return sendResponse(req, res, 500, 0, 'Error in user interest setup', {});
    }
}

const getprofileDetails = async (req, res) => {
    try {
        const userId = req.loginUser.id

        if (!userId) {
            return sendResponse(req, res, 200, 2, 'User ID is required', {});
        }

        const user = await common.getUser(userId);

        if (!user || user.length === 0 || user[0].is_delete === 1) {
            return sendResponse(req, res, 200, 3, 'User Not Found', {});
        }

        return sendResponse(req, res, 200, 1, 'User Details Fetched', { user: user[0] });

    } catch (error) {
        console.error(error);
        return sendResponse(req, res, 500, 0, 'Internal Server Error', {});
    }
}

const updateInterests = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let user = await common.getUser(req.loginUser.id)
        const user_id = user[0].id
 
        const { interests } = req.body
 
        await db.query("DELETE FROM tbl_user_interest where user_id=?", [user_id])
        for (const interest of interests) {
            await db.query("insert into tbl_user_interest(user_id,interest_id) values (?,?)", [user_id, interest])
        }
 
        return sendResponse(req, res, 200, 1, "Interests Updated Successfully", {})
 
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Updating Interests", {})
    }
}

const setprofileDetails = async (req, res) => {
    try {
        const {
            userId, first_name, last_name, address, dob,
            gender, country_code, mobile_number
        } = req.body;

        if (!userId) {
            return sendResponse(req, res, 200, 2, 'User ID is required', {});
        }

        const user = await common.getUser(userId);
        if (!user || user.length === 0 || user[0].is_delete === 1) {
            return sendResponse(req, res, 200, 3, 'User Not Found', {});
        }

        if (mobile_number) {
            if (user[0].mobile_number === mobile_number) {
                return sendResponse(req, res, 200, 0, 'Mobile number already registered with another account', {});
            }
        }

        const updateData = {
            first_name, last_name, address, dob,
            gender, country_code, mobile_number,
            updated_at: new Date()
        };

        const updatedUser = await db.query(`UPDATE tbl_user SET ? WHERE id = ?`, [updateData, userId]);

        if (updatedUser) {
            return sendResponse(req, res, 200, 1, 'Profile Updated Successfully', {});
        } else {
            return sendResponse(req, res, 200, 0, 'Failed to update profile', {});
        }

    } catch (error) {
        console.error(error);
        return sendResponse(req, res, 500, 0, 'Internal Server Error', {});
    }
}


module.exports = {
    signUp,
    otpVerification,
    resendOtp,
    forgetPassword,
    setUserDetails,
    forgetOtpVerify,
    updatePass,
    signIn,
    logOut,
    changePassword,
    getInterest,
    userInterestSetup,
    getprofileDetails,
    setprofileDetails,
    updateInterests
}