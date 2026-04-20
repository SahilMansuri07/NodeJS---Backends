import common from "../../../../config/common.js";
import Codes from "../../../../config/status_codes.js";
import middleware from "../../../../middleware/middleware.js";
import moment from "moment";
import md5 from "md5";
import db from "../../../../config/db.js";
import query from "../../../../config/dbHelper.js";
import { createOtpWmailTemplate } from "../../../../config/mail.js";

const authModule = {

    async sendOtpByEmail(request, otp) {
        if (!request?.email) return;
        
        const otpType = request.otp_purpose || "signup";
        const html = createOtpWmailTemplate({
            userName: request.name || "User",
            otp,
            otpType,
        });
        
        const subject =
            otpType === "forgot_password"
            ? `${process.env.APP_NAME || "Wafrah Bazar"} Password Reset OTP`
            : `${process.env.APP_NAME || "Wafrah Bazar"} Signup OTP`;
        
        const mailResult = await common.sendOtpMail({
            toEmail: request.email,
            subject,
            htmlMessage: html,
        });
        
        if (mailResult?.skipped) {
            console.warn("OTP email skipped:", mailResult.reason);
        }
    },

    async addUserAddress(request, res) {
        try {
            const {
                user_id,
                name,
                company_name = null,
                address_line_1,
                address_line_2 = null,
                latitude = null,
                longitude = null,
                city,
                state,
                country,
                postal_code,
                is_default = 0,
            } = request;

            const userData = await common.getUserDetails({ id: user_id });
            if (!userData) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_user_not_found",
                    null,
                );
            }

            const isDefaultAddress = Number(is_default) === 1 ? 1 : 0;

            if (isDefaultAddress === 1) {
                await query.updateQuery(
                    "tbl_user_address",
                    { is_default: 0 },
                    "user_id = ? AND is_delete = 0",
                    [Number(user_id)],
                );
            }

            const addressData1 = {
                user_id: Number(user_id),
                name: String(name).trim(),
                company_name: company_name ? String(company_name).trim() : null,
                address_line_1: String(address_line_1).trim(),
                address_line_2: address_line_2 ? String(address_line_2).trim() : null,
                latitude: latitude ? String(latitude).trim() : null,
                longitude: longitude ? String(longitude).trim() : null,
                city: String(city).trim(),
                state: String(state).trim(),
                country: String(country).trim(),
                postal_code: String(postal_code).trim(),
                is_default: isDefaultAddress,
            };

            const [insertResult] = await query.insertQuery("tbl_user_address", addressData1);

            const getAddressSql = "SELECT * FROM tbl_user_address WHERE id = ? LIMIT 1";
            const addressData = await db.query(getAddressSql, [insertResult.insertId]);

            if (addressData && addressData.length > 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_user_address_already_exists",
                    addressData[0] || null,
                );
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_user_address_added_successfully",
                addressData[0] || null,
            );

        } catch (error) {
            console.error("Error in addUserAddress:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async validateUser(request, res) {
        try {
            const { email, mobile_number, country_code, social_id, login_type, name } = request;
            
            // Check unique email
            if (email) {
                const [emailExists] = await common.checkUniqueEmail(request);
                console.log("Email uniqueness check result: ", emailExists);
                if (emailExists) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_email_already_exists",
                        null,
                    );
                }
            }

            // Check unique mobile
            if (mobile_number && country_code) {
                const [mobileExists] = await common.checkUniqueMobileNumber(request);
                if (mobileExists) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_user_mobile_already_exists",
                        null,
                    );
                }
            }

            // Check unique social ID
            if (social_id && login_type) {
                const [socialExists] = await common.checkSocialId(request);
                if (socialExists) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_social_id_already_exists",
                        null,
                    );
                }
                
                // Insert User Data
                const insertUser = {
                    name : name || null,
                    email : email || null,
                    country_code : country_code || null,
                    mobile_number : mobile_number || null,
                    login_type : login_type || null,
                    social_id : social_id || null,
                    is_verified : 1,
                }
                // Create user for social login
                const [sqlResult] = await query.insertQuery("tbl_user", insertUser);
                
                const userData = await common.getUserDetails({id : sqlResult.insertId });
               // console.log(userData);console.log(sqlResult);

                const token = await common.generateToken(userData, request);
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_user_validated_and_created_successfully",
                    { userData, token },
                );
                
            }
            return middleware.sendApiResponse(
                res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "rest_keywords_success",
            null,
            );
        } catch (error) {
            console.error("Error validating user: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async login(req, res) {
  try {
    const {
      email,
      country_code,
      mobile_number,
      password,
      social_id,
      login_type,
    } = req;

    console.log("Login request received:", req);

    let query = `
      SELECT * FROM tbl_user 
      WHERE is_delete = 0 AND is_active = 1
    `;
    let params = [];

    //  CASE 1: Social Login
    if (social_id && login_type) {
      query += ` AND social_id = ? AND login_type = ?`;
      params = [social_id, login_type];
    }

    //  CASE 2: Email Login
    else if (email && password) {
      query += ` AND  email = ?`;
      params = [email];
    }

    //  CASE 3: Mobile Login
    else if (country_code && mobile_number && password) {
      query += ` AND country_code = ? AND mobile_number = ?`;
      params = [country_code, mobile_number];
    }

    //  Invalid Request
    else {
      return middleware.sendApiResponse(
        res,
        Codes.SUCCESS,
        Codes.RESPONSE_ERROR,
        "Invalid login parameters"
      );
    }

    query += ` LIMIT 1`;
    console.log("Executing login query: ", query, "with params: ", params);

    // Correct DB call
    const [rows] = await db.query(query, params);

    console.log("Login query executed with params:", rows);
    const user = rows[0];

    //  User not found
    if (!user) {
      return middleware.sendApiResponse(
        res,
        Codes.SUCCESS,
        Codes.RESPONSE_ERROR,
        "User not found"
      );
    }

    //  Password Check (skip for social login)
    if (!social_id) {
      if (!password) {
        return middleware.sendApiResponse(
          res,
          Codes.SUCCESS,
          Codes.RESPONSE_ERROR,
          "Password is required"
        );
      }

    //   console.log("Checking password for entered " , md5(password));
    //   console.log("Checking password for user " , user.password);
      if (user.password !== md5(password)) {
        return middleware.sendApiResponse(
          res,
          Codes.SUCCESS,
          Codes.RESPONSE_ERROR,
          "Invalid credentials"
        );
      }
    }

    if(user.is_verified === 0) {
        return middleware.sendApiResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_ERROR,
            "User_not_verified",
            null
        );
    }


    //  Generate Token
    const token = await common.generateToken(user, req);

    return middleware.sendApiResponse(
      res,
      Codes.SUCCESS,
      Codes.RESPONSE_SUCCESS,
      "Login successful",
      { userData: user, token }
    );

  } catch (error) {
    console.error("Login error:", error);
    return middleware.sendApiResponse(
      res,
      Codes.INTERNAL_ERROR,
      Codes.RESPONSE_ERROR,
      "Something went wrong"
    );
  }
    },

    async requestOtp(request, res) {
        try {
            const { country_code, mobile_number, email, type, otp_purpose } = request;
             // console.log("Requesting OTP with data: ", request);
            // console.log(email);

            // Check user exists for "s" type
            if (type === "s") {
                let userSql = "SELECT id, login_type FROM tbl_user WHERE is_delete = 0 AND is_active = 1 AND (";
                let userParams = [];

                if (email) {
                    userSql += "email = ?";
                    userParams.push(email);
                } else if (country_code && mobile_number) {
                    userSql += "country_code = ? AND mobile_number = ?";
                    userParams.push(country_code, mobile_number);
                }
                userSql += ")";

                const userData = await db.query(userSql, userParams);

                if (!userData || userData.length === 0) {
                    const errorMessage = email ? "rest_email_not_found" : "rest_user_mobile_not_found";
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        errorMessage,
                        null,
                    );
                }

                if (userData[0].login_type !== "S") {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_social_auth_user_cannot_reset_password",
                        null,
                    );
                }
            }

            // Check existing non-expired OTP (rate limiting - 5 min rule)
            let otpCheckSql = "SELECT id, expires_at FROM tbl_otp WHERE is_active = 1 AND is_delete = 0 AND (";
            let otpCheckParams = [];

            if (mobile_number && country_code) {
                otpCheckSql += "country_code = ? AND mobile_number = ?";
                otpCheckParams.push(country_code, mobile_number);
            } else if (email) {
                otpCheckSql += "email = ?";
                otpCheckParams.push(email);
            }
            otpCheckSql += ") ORDER BY created_at DESC LIMIT 1";

            const existingOtp = await db.query(otpCheckSql, otpCheckParams);

            // If active OTP exists and not expired, block new request
            if (existingOtp && existingOtp.length > 0 && new Date(existingOtp[0].expires_at) > new Date()) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_keywords_otp_already_sent",
                    null,
                );
            }

            // Generate OTP
            const otp = 1234;
            const expiryTime = moment.utc().add(5, "minutes").toDate();
            console.log("otp --->", otp);
            console.log("expiryTime --->", expiryTime);

            // Update existing OTPs to inactive
            let updateWhere = "is_active = 1 AND is_delete = 0 AND (";
            let updateParams = [];

            if (mobile_number && country_code) {
                updateWhere += "country_code = ? AND mobile_number = ?";
                updateParams.push(country_code, mobile_number);
            } else if (email) {
                updateWhere += "email = ?";
                updateParams.push(email);
            }
            updateWhere += ")";

            await query.updateQuery("tbl_otp", "is_delete = 1", updateWhere, updateParams);
            console.log("Existing OTPs invalidated");

            const otpInsert = {
                country_code: country_code || null,
                mobile_number: mobile_number || null,
                email: email || null,
                otp,
                expires_at: expiryTime,
                otp_purpose: otp_purpose || "signup",
                is_active: 1,
                is_delete: 0,
            }
            // Create new OTP
                await query.insertQuery("tbl_otp", otpInsert);
                console.log("New OTP inserted into database" , request);
                if(email){
                await this.sendOtpByEmail(request, otp);
                }
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_keywords_otp_sent",
                otp,
            );

        } catch (error) {
            console.error("Error in requestOtp: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async verifyOtp(request, res) {
        //  console.log("request body in verify otp", request.body);
        try {
            const {
                country_code,
                mobile_number,
                email: rawEmail = null,
                name,
                password,
                login_type,
                language,
                otp,
            } = request.body;
            const email = rawEmail ? String(rawEmail).trim().toLowerCase() : null;
            
            // For signup flow, check uniqueness first.
            if (password) {
                if (email) {
                    const emailSql = "SELECT id FROM tbl_user WHERE LOWER(email) = ? AND is_delete = 0 LIMIT 1";
                    console.log("Checking email uniqueness with SQL: ", emailSql, "and email: ", email);
                    const [emailExists] = await db.query(emailSql, [email]);
                    console.log("Email exists check result: ", emailExists);
                    if (emailExists && emailExists.length > 0) {
                        return middleware.sendApiResponse(
                            res,
                            Codes.SUCCESS,
                            Codes.RESPONSE_ERROR,
                            "rest_email_already_exists",    
                            null,
                        );
                    }
                }
            
                if (country_code && mobile_number) {
                    const mobileSql = "SELECT id FROM tbl_user WHERE country_code = ? AND mobile_number = ? AND is_delete = 0 LIMIT 1";
                    const [mobileExists] = await db.query(mobileSql, [country_code, mobile_number]);
                    if (mobileExists && mobileExists.length > 0) {
                        return middleware.sendApiResponse(
                            res,
                            Codes.SUCCESS,
                            Codes.RESPONSE_ERROR,
                            "rest_user_mobile_already_exists",
                            null,
                        );
                    }
                }
            }
            // console.log(email, "email in verify otp");
            // Find OTP record
            let otpSql = "SELECT id, expires_at, is_active, is_delete, otp_purpose FROM tbl_otp WHERE otp = ? AND (";
            let otpParams = [otp];
            if (email) {
                otpSql += "LOWER(email) = ?";
                otpParams.push(email);
            } 
            if (country_code && mobile_number) {
                otpSql += "OR (country_code = ? AND mobile_number = ? )";
                otpParams.push(country_code, mobile_number);
            }
            otpSql += ") ORDER BY created_at DESC LIMIT 1";
            
            //  console.log(otpSql , "otp query");
            // console.log(email , "email in otp query");
            //console.log(otpParams , "otp params");
            const [otpRecords] = await db.query(otpSql, otpParams);
            console.log("Finding OTP with SQL: ", otpSql, "and params: ", otpParams);
            console.log("OTP Record found: ", otpRecords);

            if (!otpRecords || otpRecords.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_invalid_otp",
                    null,
                );
            }

            const otpRecord = otpRecords[0];
            console.log("OTP Record details: ", otpRecord);
            if (otpRecord.is_delete === 1 || otpRecord.is_active === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_keywords_otp_used",
                    null,
                );
            }

            if (new Date(otpRecord.expires_at) < new Date()) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_expired_otp",
                    null,
                );
            }

            // Handle based on OTP purpose
            if (otpRecord.otp_purpose === "signup") {
                // Create new user for signup flow
                if (!password) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_keywords_password_required",
                        null,
                    );
                }

                // Invalidate OTP only after all checks pass.
                // await query.updateQuery("tbl_otp", { is_active: 0, is_delete: 1 }, "id = ?", [otpRecord.id]);
                await common.deleteOtp(otpRecord.id);
 
                const userInsert = {
                    name : name || null,
                    email : email || null,
                    country_code : country_code || null,
                    mobile_number : mobile_number || null,
                    login_type : login_type || "S",
                    social_id : null,
                    password : md5(password),
                    language : language || null,
                    is_verified : 1,
                    steps : 1
                }
                
                // Create user
                const [result] = await query.insertQuery("tbl_user", userInsert);
  
                // console.log("User created with ID: ", result.insertId);

                // Get user details
                const [userData] = await common.getUserDetails(result.insertId);
                // console.log("User data retrieved: ", userData);
                // Generate token
                const token = await common.generateToken(userData[0], request.body);
                // console.log("Generated token: ", token);
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_keywords_otp_verified_and_signUp_successful",
                    { userData: userData[0], token },
                );
            }
            
            // await query.updateQuery("tbl_otp", { is_active: 0, is_delete: 1 }, "id = ?", [otpRecord.id]);
            await common.deleteOtp(otpRecord.id);
            if (otpRecord.otp_purpose === "forgot_password") {
                    // For forgot password flow, just return success on OTP verification. Password reset will be handled in separate API.
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_SUCCESS,
                        "rest_keywords_otp_verified",
                        null,
                    );
                }
                // For non-signup OTP purposes, only invalidate OTP after validation.

            

        } catch (error) {
            console.log("Error in verifyOtp: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async resendOtp(request, res) {
        try {
            // Resend OTP logic is similar to requestOtp
            return this.requestOtp(request, res);
        } catch (error) {
            console.error("Error in resendOtp: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async forgetPassword(request, res) {
        try {
            const { email } = request;
            
            const sql= "SELECT id FROM tbl_user WHERE email = ? AND is_delete = 0 LIMIT 1";
            const [emailExists] = await db.query(sql, [email]);
            if (!emailExists || emailExists.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_email_not_found",
                    null,
                );
            }

            const forgetOtp = await this.requestOtp({ email, otp_purpose: "forgot_password" }, res);
            // console.log("Forget password OTP result: ", forgetOtp);
            
        } catch (error) {
            console.log("Error in forgetPassword: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async resetPassword(request, res) {
        try {
            const { email, new_password } = request;
            
            const sql = "SELECT id FROM tbl_user WHERE email = ? AND is_delete = 0 LIMIT 1";
            const emailExists = await db.query(sql, [email]);
            if (!emailExists || emailExists.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_email_not_found",
                    null,
                );
            }

            const hashedPassword = md5(new_password);
            // const updateSql = "UPDATE tbl_user SET password = ? WHERE email = ?";
            // await db.query(updateSql, [hashedPassword, email]);
            await query.updateQuery("tbl_user", "password = ?" , "email = ? ", [hashedPassword, email]);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_password_reset_successful",
                null
            );
        } catch (error) {
            console.log("Error in resetPassword: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async updateProfile(request, res) {
        try {
            const { is_skip = 0 } = request.body || {};
            // console.log("updateProfile called with data: ", request.body);
            const user_id = request.loginUser?.id;
            
            // console.log(user_id)

            // console.log("Updating profile for user ID: ", user_id, "with data: ", request.body);
            const userData = await common.getUserDetails({ id: user_id });
            if (!userData || userData.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_user_not_found",
                    null,
                );
            }

            if (is_skip == 0) {
                let steps = userData[0].steps || 1;
                if ( steps === 2){
                     return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_SUCCESS,
                        "rest_profile_already_updated",
                        null
                    );
                }
                
                const [result] = await query.updateQuery("tbl_user", { profile_image: request.body .profile_image , steps : steps = 2  }, "id = ?", [user_id]);
                if(result  && result.affectedRows > 0){

                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_SUCCESS,
                        "rest_profile_updated_successfully",
                        null
                    );
                } 
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_profile_update_skipped",
                null
            );
        } catch (error) {
            console.log("Error in updateProfile: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null,
            );
        }
    },

    async changePassword(request, res) {
        try {
            const user_id = request.user.id;
            const { old_password, new_password } = request;
            
          const userData1 = await common.getUserDetails({ id: user_id });
            if (!userData1 || userData1.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_user_not_found",
                    null,
                );
            }

            const hashedOldPassword = md5(old_password);
            const userSql = "SELECT password FROM tbl_user WHERE id = ?";
            const userData = await db.query(userSql, [user_id]);

            if (!userData || userData.length === 0 || userData[0].password !== hashedOldPassword) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_old_password_incorrect",
                    null,
                );
            }

            const hashedNewPassword = md5(new_password);
            await query.updateQuery("tbl_user", "password = ?" , "id = ? ", [hashedNewPassword, user_id]);
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_password_changed_successfully",
                null
            );

        } catch (error) {
            console.log("Error in changePassword: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null
            );
        }
    },

    async logout(request, res) {
        try {
            const token = request.headers['token'];
            console.log("Logout requested with token: ", token);

            const [result] = await query.updateQuery("tbl_user_devices", { token: null }, "token = ?", [token]);


            if (!result || result.affectedRows === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_you_are_aleady_logged_out",
                    null,
                );
            }

            // For stateless JWT, logout can be handled on client side by deleting token
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_logout_successful",
                null
            );
        } catch (error) {
            console.log("Error in logout: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null
            );
        }
    },

    async setProfile (request , res) {
        try {
            const user_id = request.loginUser.id;
            const { name, email, country_code , mobile_number , profile_image} = request.body;
            
            const [result] = await query.updateQuery("tbl_user", { name, email, country_code, mobile_number, profile_image }, "id = ?", [user_id]);
            const userData = await common.getUserDetails({ id: user_id });
            
            if (!userData) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_user_not_found",
                    null,
                );
            }
            if (result && result.affectedRows > 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_profile_updated_successfully",
                    userData
                );
            }
            return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_profile_updated_failed",
                    userData
                );
        }catch (error) {
        console.log("Error in setProfile: ", error);
        return middleware.sendApiResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "rest_keywords_error",
            null
        );
       }
    },

    async setLanguage(request , res){
        try {
            const { language } = request.body;
            const user_id = request.loginUser.id;

            const [result] = await query.updateQuery("tbl_user", { language }, "id = ?", [user_id]);
            if (result && result.affectedRows > 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_language_updated_successfully",
                    null
                );
            }
            return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_language_updated_failed",
                    null
                );
        } catch (error) {
            console.log("Error in setLanguage: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null
            );
        }
    },

    async changePassword(request , res){
        try {
            const user_id = request.loginUser.id;
            const { old_password, new_password } = request.body;
            const hashedOldPassword = md5(old_password);
            const userSql = "SELECT password FROM tbl_user WHERE id = ?";
            const userData = await db.query(userSql, [user_id]);
            if (!userData || userData.length === 0 || userData[0].password !== hashedOldPassword) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_old_password_incorrect",
                    null,
                );
            }
            const hashedNewPassword = md5(new_password);
            await query.updateQuery("tbl_user", { password: hashedNewPassword }, "id = ?", [user_id]);
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_password_changed_successfully",
                null
            );
        } catch (error) {
            console.log("Error in changePassword: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null
            );
        }
    }

};

export default authModule;