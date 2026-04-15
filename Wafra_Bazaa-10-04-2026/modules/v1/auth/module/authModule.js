import common from "../../../../config/common.js";
import Codes from "../../../../config/status_codes.js";
import middleware from "../../../../middleware/middleware.js";
import moment from "moment";
import md5 from "md5";
import db from "../../../../config/db.js";

const authModule = {
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

            if (!user_id || !name || !address_line_1 || !city || !state || !country || !postal_code) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.MISSING_FIELD,
                    "rest_keywords_required_fields_missing",
                    null,
                );
            }

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
                const resetDefaultSql = "UPDATE tbl_user_address SET is_default = 0 WHERE user_id = ? AND is_delete = 0";
                await db.query(resetDefaultSql, [Number(user_id)]);
            }

            const insertSql = `INSERT INTO tbl_user_address
                (user_id, name, company_name, address_line_1, address_line_2, latitude, longitude, city, state, country, postal_code, is_default, is_active, is_delete, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`;

            const insertResult = await db.query(insertSql, [
                Number(user_id),
                String(name).trim(),
                company_name ? String(company_name).trim() : null,
                String(address_line_1).trim(),
                address_line_2 ? String(address_line_2).trim() : null,
                latitude ? String(latitude).trim() : null,
                longitude ? String(longitude).trim() : null,
                String(city).trim(),
                String(state).trim(),
                String(country).trim(),
                String(postal_code).trim(),
                isDefaultAddress,
            ]);

            const getAddressSql = "SELECT * FROM tbl_user_address WHERE id = ? LIMIT 1";
            const addressData = await db.query(getAddressSql, [insertResult.insertId]);

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
                const emailExists = await common.checkUniqueEmail(request);
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
                const mobileExists = await common.checkUniqueMobileNumber(request);
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
            console.log("social_id", social_id, "login_type", login_type);
            // Check unique social ID
            if (social_id && login_type) {
                const socialExists = await common.checkSocialId(request);
                if (socialExists) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "rest_social_id_already_exists",
                        null,
                    );
                }
                
                // Create user for social login
                const sql = `INSERT INTO tbl_user 
                    (name, email, country_code, mobile_number, login_type, social_id, is_verified) 
                    VALUES (?, ?, ?, ?, ?, ?, 1)`;
                const sqlResult = await db.query(sql, [name || null, email || null, country_code || null, mobile_number || null, login_type || null, social_id || null]);
                
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

    async login(req , res) {
    try {
        const {
            email,
            country_code,
            mobile_number,
            password,
            social_id,
            login_type,
        } = req;

        //  Validate input
        if (!email && !(country_code && mobile_number) && !(social_id && login_type)) {
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.MISSING_FIELD, "Required fields missing");
        }

        if (!social_id && !password) {
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.MISSING_FIELD, "Password required");
        }

        //  Build query
        let query = `
            SELECT * FROM tbl_user 
            WHERE is_delete = 0 AND is_active = 1 AND
        `;
        let params = [];

        if (social_id && login_type) {
            query += " social_id = ? AND login_type = ?";
            params = [social_id, login_type];
        } else if (email) {
            query += " email = ?";
            params = [email];
        } else {
            query += " country_code = ? AND mobile_number = ?";
            params = [country_code, mobile_number];
        }

        query += " LIMIT 1";

        const [user] = await db.query(query, params);

        //  User not found
        if (!user) {
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "User not found");
        }

        //  Password check (skip for social login)
        if (!social_id) {
            if (user.password !== md5(password)) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Invalid credentials");
            }
        }

        //  Generate token
        const token = await common.generateToken(user, req);


        return middleware.sendApiResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Login successful",
            { userData: user, token }
        );

        } catch (error) {
            console.error(error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Something went wrong");
        }
    } ,

    async requestOtp(request, res) {
        try {
            const { country_code, mobile_number, email, type, otp_purpose } = request;
            console.log("Requesting OTP with data: ", request);
            console.log(email);

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
            let updateSql = "UPDATE tbl_otp SET is_delete = 1 WHERE is_active = 1 AND is_delete = 0 AND (";
            let updateParams = [];

            if (mobile_number && country_code) {
                updateSql += "country_code = ? AND mobile_number = ?";
                updateParams.push(country_code, mobile_number);
            } else if (email) {
                updateSql += "email = ?";
                updateParams.push(email);
            }
            updateSql += ")";

            await db.query(updateSql, updateParams);
            console.log("Existing OTPs invalidated");

            // Create new OTP
            const insertSql = `INSERT INTO tbl_otp 
                (country_code, mobile_number, email, otp, expires_at, otp_purpose, is_active, is_delete) 
                VALUES (?, ?, ?, ?, ?, ?, 1, 0)`;
            await db.query(insertSql, [country_code || null, mobile_number || null, email || null, otp, expiryTime, otp_purpose || "signup"]);

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
        try {
            const { country_code, mobile_number, email = null, name, password, login_type , language , otp } = request;

            // For signup flow, check uniqueness first.
            if (password) {
                if (email) {
                    const emailSql = "SELECT id FROM tbl_user WHERE email = ? AND is_delete = 0 LIMIT 1";
                    const emailExists = await db.query(emailSql, [email]);
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
                    const mobileExists = await db.query(mobileSql, [country_code, mobile_number]);
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

            // Find OTP record
            let otpSql = "SELECT id, expires_at, is_active, is_delete, otp_purpose FROM tbl_otp WHERE otp = ? AND (";
            let otpParams = [otp];

            if (country_code && mobile_number) {
                otpSql += "country_code = ? AND mobile_number = ?";
                otpParams.push(country_code, mobile_number);
            } else if (email) {
                otpSql += "email = ?";
                otpParams.push(email);
            }
            otpSql += ") ORDER BY created_at DESC LIMIT 1";

            const otpRecords = await db.query(otpSql, otpParams);
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
                const updateOtpSql = "UPDATE tbl_otp SET is_active = 0, is_delete = 1 WHERE id = ?";
                await db.query(updateOtpSql, [otpRecord.id]);

                // Create user
                const hashedPassword = md5(password);
                const createUserSql = `INSERT INTO tbl_user 
                    (country_code, mobile_number, email, password, login_type , language, is_verified, name, is_active, is_delete) 
                    VALUES (?, ?, ?, ?, ?, ?, 1 ,?, 1, 0)`;
                const result = await db.query(createUserSql, [
                    country_code || null,
                    mobile_number || null,
                    email || null,
                    hashedPassword || null,
                    login_type || "S",
                    language || null,
                    name || null
                ]);

                console.log("User created with ID: ", result.insertId);

                // Get user details
                const getUserSql = "SELECT * FROM tbl_user WHERE id = ? AND is_delete = 0 LIMIT 1";
                const userData = await db.query(getUserSql, [result.insertId]);

                // Generate token
                const token = await common.generateToken(userData[0], request);

                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_keywords_otp_verified_and_signUp_successful",
                    { userData, token },
                );
            }

            // For non-signup OTP purposes, only invalidate OTP after validation.
            const updateOtpSql = "UPDATE tbl_otp SET is_active = 0, is_delete = 1 WHERE id = ?";
            await db.query(updateOtpSql, [otpRecord.id]);

            return true; // For other OTP purposes, just return success after verification

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

            const forgetOtp = await this.requestOtp({ email, otp_purpose: "forgot_password" }, res);
            console.log("Forget password OTP result: ", forgetOtp);

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

    // async verifyForgetPasswordOtp(request, res) {
    //     try {
    //         const { email, otp, new_password } = request;

    //         const verifyOtp = await this.verifyOtp({ email, otp }, res);

    //     } catch (error) {
    //         console.log("Error in verifyForgetPasswordOtp: ", error);
    //         return middleware.sendApiResponse(
    //             res,
    //             Codes.INTERNAL_ERROR,
    //             Codes.RESPONSE_ERROR,
    //             "rest_keywords_error",
    //             null,
    //         );
    //     }
    // },

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
            const updateSql = "UPDATE tbl_user SET password = ? WHERE email = ?";
            await db.query(updateSql, [hashedPassword, email]);

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
            const { user_id, profile_image, is_skip = 0 } = request;
            
            const sql = "SELECT id FROM tbl_user WHERE id = ? AND is_delete = 0 LIMIT 1";
            const userData = await db.query(sql, [user_id]);
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
                const sql = "UPDATE tbl_user SET profile_image = ? WHERE id = ?";
                await db.query(sql, [profile_image, user_id]);

                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_SUCCESS,
                    "rest_profile_updated_successfully",
                    null
                );
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
            
            const sql = "SELECT id FROM tbl_user WHERE id = ? AND is_delete = 0 LIMIT 1";
            const user1Data = await db.query(sql, [user_id]);
            if (!user1Data || user1Data.length === 0) {
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
            const updateSql = "UPDATE tbl_user SET password = ? WHERE id = ?";
            await db.query(updateSql, [hashedNewPassword, user_id]);

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

            const updateSql = "UPDATE tbl_user_devices SET token = NULL WHERE token = ?";
            const result = await db.query(updateSql, [token]);

            console.log("Token invalidation result: ", result);

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
            const { name, email, country_code , phone , profile_image} = request.body;
            
            const updateSql = "UPDATE tbl_user SET name = ?, email = ?, country_code = ?, mobile_number = ?, profile_image = ? WHERE id = ?";
            const result = await db.query(updateSql, [name, email, country_code, phone, profile_image, user_id]);
            
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

            const updateSql = "UPDATE tbl_user SET language = ? WHERE id = ?";
            const result = await db.query(updateSql, [language, user_id]);
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
            const updateSql = "UPDATE tbl_user SET password = ? WHERE id = ?";
            await db.query(updateSql, [hashedNewPassword, user_id]);
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