const md5 = require("md5")
const db = require("../../config/database")
const { common, commonApiFunction } = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")

const signUp = async (req, res) => {
    try {
        const {
            username ,
            email ,
            country_code ,
            mobile_number,
            password,
            login_type,
            social_id ,
            role,
           // language = "en",
            profile_pic = ""
        } = req.body
    
        const [userExistResult] = await db.query("SELECT * from tbl_user where  email=? or (country_code=? and mobile_number=?) limit 1", [email, country_code, mobile_number])
        console.log("user exist result " , userExistResult)
        if (userExistResult && userExistResult.length> 0) {

            if (userExistResult.email == email) {
                return sendResponse(req, res, 200, 0, { keyword: 'Email_Already_Exist', component: {} }, {})
            }

            if (userExistResult.country_code == country_code && userExistResult.mobile_number == mobile_number) {
                return sendResponse(req, res, 200, 0, { keyword: 'Mobile_Number_Already_Exist', component: {} }, {})
            }
        }

        let user_id;

        if (login_type === "s") {
            const [newSimpleUser] = await db.query(
                "INSERT INTO tbl_user(role, username, email, login_type, country_code, mobile_number, password, profile_pic, is_mobile_verified) VALUES (?,?,?,?,?,?,?,?,?)",
                [role || "user", username || null, email || null, login_type, country_code || null, mobile_number || null, md5(password), profile_pic, 0]
            )
            if (newSimpleUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Could_Not_Be_Able_To_Fetch_Data_For_The_Given_User", component: {} }, {})
            }
            user_id = newSimpleUser.insertId;
        } else if (login_type === "f" || login_type === "g") {
            const [newUser] = await db.query(
                "INSERT INTO tbl_user(role, username, login_type, country_code, mobile_number, email, social_id, profile_pic, is_mobile_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)",
                [
                    role || "user",
                    username || null,
                    login_type,
                    country_code || null,
                    mobile_number || null,
                    email || null,
                    social_id,
                    profile_pic,
                ]
            );
            if (newUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Could_Not_Be_Able_To_Fetch_Data_For_The_Given_User", component: {} }, {})
            }
            user_id = newUser.insertId;
        }else{
            return sendResponse(req, res, 200, 0, { keyword: 'Invalid_Login_Type', component: {} }, {})
        }
        
        const userData = await common.getUser(user_id);
        if (!userData) {
            return sendResponse(req, res, 200, 3, { keyword: "Could_Not_Be_Able_To_Fetch_Data_For_The_Given_User", component: {} }, {})
        }
        if(userData[0].is_mobile_verified == 1){
        return sendResponse(req, res, 200, 1, { keyword: "User_SignIn_SuccessFully", component: {} })
        }else{
            await commonApiFunction.otpGenerate(userData[0].id, email  ,userData[0].mobile_number, userData[0].country_code, "signup")
        }
        
        return sendResponse(req, res, 200, 4, { keyword: "OTP_Send_Successfully", component: {} }, {
            "userData": userData
        })

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, { keyword: "Error_During_Registration", component: {} }, {})
    }
}

// OTP  verification based on mobile number
const otpVerification = async (req, res) => {
    try {
        const { otp, email , mobile , country_code } = req.body;
        const requestPurpose = req.body.purpose || "signup";

        const [userData] = await db.query(
            `SELECT * FROM tbl_user WHERE (mobile_number = ? AND country_code = ?) or email = ? AND is_active = 1`,
            [mobile  ,country_code, email]
        );

        if (userData.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const userOtpID = userData[0].id;

        const [otpData] = await db.query(
            `SELECT * FROM tbl_otp WHERE user_id = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1`,
            [userOtpID, requestPurpose]
        );
       
        if (otpData[0].is_active === 0) {
            return sendResponse(req, res, 200, 0, { keyword: "OTP_Already_Used", component: {} }, {});
        }

        if (otpData.length === 0) {
            return sendResponse(req, res, 200, 0, { keyword: "Invalid_OTP", component: {} }, {});
        }


        const purpose = otpData[0].purpose;

        if (otpData[0].expires_at && new Date(otpData[0].expires_at) < new Date()) {
            await db.query(`UPDATE tbl_otp SET is_active = 0 WHERE id = ?`, [otpData[0].id]);
            return sendResponse(req, res, 200, 0, { keyword: "OTP_Expired", component: {} }, {});
        }

        if (purpose === "signup") {
            const [updateUser] = await db.query(
                `UPDATE tbl_user SET is_mobile_verified = 1 WHERE id = ?`,
                [userOtpID]
            );

            if (updateUser.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "User_Verification_Failed", component: {} }, {});
            }
        }

        await db.query(`UPDATE tbl_otp SET is_active = 0 WHERE id = ?`, [otpData[0].id]);

        const user = await common.getUser(userOtpID);
        console.log("forget " , purpose)
        if(purpose === "forgotpassword"){
            return sendResponse(req, res, 200, 1, { keyword: "OTP_Verified_you_can_now_change_your_password", component: {} }, {});
        }else{
            const token = await common.generateToken(user, req);
            sendResponse(req, res, 200, 1, { keyword: "User_SignIn_SuccessFully", component: {} }, {
                user: user,
                token: token
            });
        }

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
};


const resendOtp = async (req, res) => {
    try {
        const { 
            type,
             mobile, 
            country_code, 
            email 
         } = req.body;

        const [result] = await db.query(
            `SELECT id, mobile_number FROM tbl_user WHERE (mobile_number = ? AND country_code = ?) OR email = ? AND is_active = 1`,
            [mobile, country_code, email]
        );

        if (result.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Account_Found_With_The_Provided_Details", component: {} }, {});
        }

        const user_Id = result[0].id;
        const otpData = await commonApiFunction.otpGenerate( user_Id, email , mobile, country_code, type);

        if (otpData == null) {
            return sendResponse(req, res, 200, 0, { keyword: "OTP_Already_Sent._Please_Wait_5_Minutes", component: {} }, {});
        }

        return sendResponse(req, res, 200, 1, { keyword: "OTP_sent_successfully", component: {} }, {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
}

// Forget password API
const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const mobile   = req.body.mobile;
        const country_code = req.body.country_code;
        
        const [result] = await db.query(
            `SELECT id, mobile_number, login_type FROM tbl_user WHERE (mobile_number = ? AND country_code = ?) or email = ? AND is_active = 1;`,
            [mobile || null, country_code || null, email ]
        );

        if (result.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Account_Found_With_The_Provided_Details", component: {} }, {});
        }

        if (result[0].login_type !== "s") {
            return sendResponse(req, res, 200, 0, { keyword: "Social_Login_User_will_not_be_able_to_Change_Password", component: {} }, {})
        }

        const userForgetId = result[0].id;
        const Data = await commonApiFunction.otpGenerate( userForgetId, email , mobile, country_code, 'forgotpassword');

        if (Data == null) {
            return sendResponse(req, res, 200, 0, { keyword: "OTP_Already_Sent._Please_Wait_5_Minutes", component: {} }, {});
        }

        return sendResponse(req, res, 200, 1, { keyword: "OTP_Sent_Successfully_For_ForgetPassword", component: {} }, {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};


// forget otp verify API
const forgetOtpVerify = async (req, res) => {
    try {
        req.body.purpose = "forgotpassword";
        await otpVerification(req, res)
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
}


// reset password API
const updatePass = async (req, res) => {
    try {
        const { newPass, user_id } = req.body

        const [updatedPass] = await db.query("UPDATE tbl_user SET password = ? WHERE id = ?", [md5(newPass), user_id])
        if (updatedPass.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Password_Updated_Successfully", component: {} }, {})
        }
        return sendResponse(req, res, 200, 0, { keyword: "Failed_Updating_Password", component: {} }, {})

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
}


// login API
const signIn = async (req, res) => {
    
    try {
        const { email, password, mobile, country_code, social_id, login_type, role } = req.body;
        
        let query = "SELECT * FROM tbl_user WHERE is_active = 1 AND is_delete = 0 AND role = ? AND ";
        let params = [role];

        if (social_id) {
            query += "social_id = ?";
            params.push(social_id);
        } else if (email && password) {
            query += "(email = ?) AND password = ?";
            params.push(email, md5(password));
        } else if (mobile && country_code && password) {
            query += "(country_code = ? AND mobile_number = ?) AND password = ?";
            params.push(country_code, mobile, md5(password));
        } else {
            return sendResponse(req, res, 200, 2, { keyword: "Invalid_login_credentials_provided", component: {} }, {});
        }

        if (login_type) {
            query += " AND login_type = ?";
            params.push(login_type);
        }
        // console.log(query)
        // console.log(params)
        const [existingUser] = await db.query(query, params);
        console.log(existingUser)
        if (existingUser.length === 0) {
            return sendResponse(req, res, 200, 0, { keyword: "Invalid_credentials", component: {} }, {});
        }

        const user = existingUser[0];

        if (user.is_mobile_verified === 0) {
            return sendResponse(req, res, 200, 4, { keyword: "Mobile_Verification_Is_Pending", component: {} }, {});
        }


        const token = await common.generateToken(user, req)
        return sendResponse(req, res, 200, 1, { keyword: "Sign_In_Successful", component: {} }, {
            user_id: user.id,
            email: user.email,
            token
        });

    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
};

// User sign out API
const signOut = async (req, res) => {
    // console.log("sign out api called")
    try {
        const token = req.headers['token'];
        // console.log("token " , token)
        if (!token) {
            return sendResponse(req, res, 200, 0, { keyword: "Token_is_Missing", component: {} }, {});
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        // console.log("bearer token " , bearerToken)
        const [logoutQuery] = await db.query(
            `UPDATE tbl_user_device SET is_active = 0 WHERE token = ? AND is_active = 1`,
            [bearerToken]
        );
        // console.log("logout query result " , logoutQuery)
        if (logoutQuery.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Logout_Successful", component: {} }, {});
        }

        return sendResponse(req, res, 200, 0, { keyword: "User_Already_Logged_Out", component: {} }, {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, { error });
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.loginUser.id;
        const { username, email, country_code, profile_pic ,mobile_number , social_id} = req.body;
        const [result] = await db.query(
            `SELECT id FROM tbl_user WHERE (email = ? OR (country_code = ? AND mobile_number = ?) OR social_id = ?) AND id = ? AND is_active = 1`,
            [email, country_code, mobile_number, social_id, userId]
        );
        if (result.length > 0) {
            if (result[0].email === email) {
                return sendResponse(req, res, 200, 0, { keyword: "Email_Already_Exist", component: {} }, {});
            }
            if (result[0].country_code === country_code && result[0].mobile_number === mobile_number) {
                return sendResponse(req, res, 200, 0, { keyword: "Mobile_Number_Already_Exist", component: {} }, {});
            }
            if (result[0].social_id === social_id) {
                return sendResponse(req, res, 200, 0, { keyword: "Social_ID_Already_Exist", component: {} }, {});
            }
        }

        const [updateResult] = await db.query(
            `UPDATE tbl_user SET username = ?, email = ?, profile_pic = ?, country_code = ?, mobile_number = ?, social_id = ? WHERE id = ?`,
            [username, email, profile_pic, country_code, mobile_number, social_id, userId]
        );  
        if (updateResult.affectedRows > 0) {
            const updatedUser = await common.getUser(userId);
            return sendResponse(req, res, 200, 1, { keyword: "Profile_Updated_Successfully", component: {} }, { user: updatedUser });
        }

    } catch (error) {
        console.error("Error in editProfile:", error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.loginUser.id;
        const { oldPassword, newPassword } = req.body;
        // console.log(oldPassword, newPassword)
        const userData = await common.getUser(userId);
        if (!userData) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }
        if (userData.password !== md5(oldPassword)) {
            return sendResponse(req, res, 200, 0, { keyword: "Invalid_Old_Password", component: {} }, {});
        }
        const [updateResult] = await db.query(
            `UPDATE tbl_user SET password = ? WHERE id = ?`,
            [md5(newPassword), userId]
        );
        if (updateResult.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Password_Updated_Successfully", component: {} }, {});
        }
    } catch (error) {
        console.error("Error in changePassword:", error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal Server Error", component: {} }, {});
    }
};

module.exports = {
    signUp,
    otpVerification,
    resendOtp,
    forgetPassword,
    forgetOtpVerify,
    updatePass,
    signIn,
    signOut, 
    editProfile,
    changePassword

}