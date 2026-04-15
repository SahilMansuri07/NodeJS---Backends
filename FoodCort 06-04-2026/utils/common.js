const db = require("../config/database");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config()

const common = {
      getUser: async (user_id) => {
        try {

            let query = "SELECT * FROM tbl_user";
            let values = [];

            if (user_id) {
                query += " WHERE id = ?";
                values.push(user_id);
            }

            let [result] = await db.query(query, values);

            console.log(result);

            if (result && result.length > 0) {
                //return sendResponse(req, res, 200, 0, { keyword: 'UserData', component: {} }, {result});
                return result;
            }

            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    } ,
    // Common finder for user lookup using email and/or mobile details.
    findUserByContact: async ({ email = null, mobile_number = null, country_code = null, is_active = null } = {}) => {
        try {
            let query = "SELECT * FROM tbl_user WHERE 1 = 1";
            const values = [];

            if (is_active !== null && is_active !== undefined) {
                query += " AND is_active = ?";
                values.push(is_active);
            }

            if (email && mobile_number && country_code) {
                query += " AND (email = ? OR (country_code = ? AND mobile_number = ?))";
                values.push(email, country_code, mobile_number);
            } else if (email) {
                query += " AND email = ?";
                values.push(email);
            } else if (mobile_number && country_code) {
                query += " AND country_code = ? AND mobile_number = ?";
                values.push(country_code, mobile_number);
            } else {
                return [];
            }

            const [result] = await db.query(query, values);
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    generateToken: async function (user, req) {
        try {
            const normalizedUser = Array.isArray(user) ? user[0] : user;

            if (!normalizedUser || !normalizedUser.id) {
                throw new Error("Invalid user data for token generation");
            }

            const payload = {
                id: normalizedUser.id,
                email: normalizedUser.email || null,
                mobile_number: normalizedUser.mobile_number || null,
                role: normalizedUser.role || null
            };

            const user_id = normalizedUser.id;
            const token   = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });
                console.log("payload " , user_id)
            const { device_token , device_type, device_name, device_model, os_version, uuid, ip } = req?.body || {};
 
            const [checkDevice] = await db.query(
                `SELECT id FROM tbl_user_device WHERE user_id = ? AND uuid = ?`,
                [user_id, uuid]
            );

            let result;

            if (checkDevice.length > 0) {
                
                const [updateResult] = await db.query(
                    `UPDATE tbl_user_device
                    SET token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ?
                    WHERE user_id = ? AND uuid = ?`,
                    [token, device_token, device_type, device_name, device_model, os_version, ip, user_id, uuid]
                );
                result = updateResult;
            } else {
                const [insertResult] = await db.query(
                    `INSERT INTO tbl_user_device (user_id, token, device_token, device_type, device_name, device_model, os_version, uuid, ip)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [user_id, token, device_token, device_type, device_name, device_model, os_version, uuid, ip]
                );
                result = insertResult;
            }

            if (result.affectedRows > 0) {
                return token;
            }

        throw new Error("Token Operation Failed");
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    

}

const commonApiFunction = {
    otpGenerate: async (user_id, email, mobile_number, country_code, purpose) => {

        let otp = 123456
        let expires_at = new Date(Date.now() + 5 * 60 * 1000);

        const [existingOtp] = await db.query(
            `SELECT * 
                     FROM tbl_otp 
                     WHERE user_id = ?
                     AND purpose = ?
                     AND created_at >= NOW() - INTERVAL 5 MINUTE
                     ORDER BY id DESC
                     LIMIT 1`,
            [user_id, purpose]
        );

        if (existingOtp.length > 0) {
            console.log(existingOtp)
            return null
        }


        const [otpSend] = await db.query("INSERT INTO tbl_otp (user_id  , mobile , email   , purpose , otp , country_code , expires_at) values (?, ?, ?, ?, ?, ?, ?)", [user_id, mobile_number , email , purpose, otp, country_code, expires_at])
        // console.log(otpSend)
        if (otpSend.affectedRows > 0) {
            // console.log(otpSend , "otp data")
            return otpSend
        }

        return null
    }
}

module.exports = {
     common ,
     commonApiFunction
    }