const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("../config/database.js")


dotenv.config()

const common = {
    jwt_sign: (data, expiresIn = "365d") => {
        const token = jwt.sign(
            { data },
            process.env.JWT_WEB_TOKEN,
            { expiresIn }
        )

        return token
    },
    generateToken: async function (user, req, res) {
        try {
            let payload;

            if (user.role === "admin" || user.role === "superadmin") {
                payload = {
                    id:    user.id    || user[0].id,
                    email: user.email || user[0].email || null,
                    role:  user.role  || user[0].role  || null
                }
            }

            if (user.mobile_number) {
                payload = {
                    id:     user.id            || user[0].id,
                    email:  user.email         || user[0].email         || null,
                    mobile: user.mobile_number || user[0].mobile_number || null,
                }
            }

            const user_id = user.id || user[0].id;
            const token   = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });

            const { device_token, device_type, device_name, device_model, os_version, uuid, ip } = req.body;

            const tableName = (user.role === "admin" || user.role === "superadmin")
                ? "tbl_admin_device"
                : "tbl_user_device";

            const idCol = (user.role === "admin" || user.role === "superadmin")
                ? "admin_id"
                : "user_id";

            const [checkDevice] = await db.query(
                `SELECT id FROM ${tableName} WHERE ${idCol} = ? AND uuid = ?`,
                [user_id, uuid]
            );

            let result;

            if (checkDevice.length > 0) {
                
                const [updateResult] = await db.query(
                    `UPDATE ${tableName}
                    SET token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ? , is_active = 1 , is_delete = 0
                    WHERE ${idCol} = ? AND uuid = ?`,
                    [token, device_token, device_type, device_name, device_model, os_version, ip, user_id, uuid]
                );
                result = updateResult;
            } else {
                const [insertResult] = await db.query(
                    `INSERT INTO ${tableName} (${idCol}, token, device_token, device_type, device_name, device_model, os_version, uuid, ip)
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

    getMerchantDetails: async function(merchant_id = null, admin_id = null, page = 1, limit = 10) {
        try {
            // Build WHERE clause based on parameters
            let whereConditions = [
                'tbl_merchants.is_active = 1',
                'tbl_merchants.is_delete = 0'
            ];

            // (merchant_id provided)
            if (merchant_id) {
                whereConditions.push(`tbl_merchants.id = ${db.escape(merchant_id)}`);
            }
            // (admin_id provided, no merchant_id)
            else if (admin_id) {
                whereConditions.push(`tbl_merchants.admin_id = ${db.escape(admin_id)}`);
            }
            // (no merchant_id, no admin_id) - Show all merchants
        

            const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

            const selectFields = `SELECT
                tbl_merchants.id,
                tbl_merchants.admin_id,
                tbl_merchants.merchant_name,
                tbl_merchants.logo_image,
                tbl_merchants.cover_image,
                tbl_merchants.lat,
                tbl_merchants.log,
                tbl_merchants.address,
                tbl_merchants.email,
                tbl_merchants.country_code,
                tbl_merchants.mobile_number,
                tbl_merchants.about_description,

                (
                    SELECT GROUP_CONCAT(
                        CONCAT('{"media_url":"', REPLACE(tbl_merchant_media.media_url, '"', '\\"'), '"}')
                        SEPARATOR ','
                    )
                    FROM tbl_merchant_media
                    WHERE tbl_merchants.id = tbl_merchant_media.merchant_id
                ) AS media,

                (
                    SELECT GROUP_CONCAT(
                        CONCAT(
                            '{"start_time":"', tbl_merchant_timing.start_time, '",',
                            '"end_time":"',    tbl_merchant_timing.end_time,   '",',
                            '"day":"',         REPLACE(tbl_merchant_timing.day, '"', '\\"'), '"}'
                        )
                        SEPARATOR ','
                    )
                    FROM tbl_merchant_timing
                    WHERE tbl_merchants.id = tbl_merchant_timing.merchant_id
                    AND tbl_merchant_timing.is_active = 1
                    AND tbl_merchant_timing.is_delete = 0
                ) AS timings,

                (
                    SELECT GROUP_CONCAT(
                        CONCAT(
                            '{"amenities_name":"', REPLACE(tbl_amenities.name,  '"', '\\"'), '",',
                            '"amenities_image":"', REPLACE(tbl_amenities.image, '"', '\\"'), '"}'
                        )
                        SEPARATOR ','
                    )
                    FROM tbl_amenities
                    JOIN tbl_merchant_amenities ON tbl_merchant_amenities.amenity_id = tbl_amenities.id
                    WHERE tbl_merchants.id = tbl_merchant_amenities.merchant_id
                    AND tbl_merchant_amenities.is_active = 1
                    AND tbl_merchant_amenities.is_delete = 0
                ) AS amenities

            FROM tbl_merchants`;

            if (merchant_id) {
                // Fetch single merchant
                const [merchants] = await db.query(
                    `${selectFields}
                    ${whereClause}
                    ORDER BY tbl_merchants.created_at DESC`
                );

                if (merchants.length === 0) return null;

                // Parse JSON strings
                const parsed = merchants.map((data) => {
                    try { data.media     = data.media     ? JSON.parse(`[${data.media}]`)     : []; } catch(e) { data.media     = []; }
                    try { data.timings   = data.timings   ? JSON.parse(`[${data.timings}]`)   : []; } catch(e) { data.timings   = []; }
                    try { data.amenities = data.amenities ? JSON.parse(`[${data.amenities}]`) : []; } catch(e) { data.amenities = []; }
                    return data;
                });

                return parsed[0];
            } else {
                // Fetch merchants with pagination
                const [totalResult] = await db.query(`SELECT COUNT(*) as total FROM tbl_merchants ${whereClause}`);
                const total = totalResult[0].total;

                const offset = (page - 1) * limit;
                const [merchants] = await db.query(
                    `${selectFields}
                    ${whereClause}
                    ORDER BY tbl_merchants.created_at DESC
                    LIMIT ${db.escape(limit)} OFFSET ${db.escape(offset)}`
                );

                // Parse JSON strings
                const parsed = merchants.map((data) => {
                    try { data.media     = data.media     ? JSON.parse(`[${data.media}]`)     : []; } catch(e) { data.media     = []; }
                    try { data.timings   = data.timings   ? JSON.parse(`[${data.timings}]`)   : []; } catch(e) { data.timings   = []; }
                    try { data.amenities = data.amenities ? JSON.parse(`[${data.amenities}]`) : []; } catch(e) { data.amenities = []; }
                    return data;
                });

                return { data: parsed, total };
            }

        } catch (error) {
            console.log(error);
            return merchant_id ? null : { data: [], total: 0 };
        }
    },


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
                return result;
            }

            return null;

        } catch (err) {
            console.log(err);
            return null;
        }
    } ,

    getUserDevice: async (user_id) => {
        try {
            const [result] = await db.query("SELECT * FROM tbl_user_device WHERE user_id=?", [user_id])

            if (result && result.length > 0) {
                return result[0]
            }
            return null
        }
        catch (err) {
            console.log(err)
            return null
        }
    },
}

const commonApiFunction = {
    otpGenerate: async (req, res, user_id, mobile_number, country_code, purpose) => {

        let otp = 123456
        let expires_at = new Date(Date.now() + 5 * 60 * 1000);

        const [existingOtp] = await db.query(
            `SELECT * 
                     FROM tbl_otp 
                     WHERE user_id = ?
                     AND otp_purpose = ?
                     AND created_at >= NOW() - INTERVAL 5 MINUTE
                     ORDER BY id DESC
                     LIMIT 1`,
            [user_id, purpose]
        );

        if (existingOtp.length > 0) {
            console.log(existingOtp)
            return null
        }


        const [otpSend] = await db.query("INSERT INTO tbl_otp (user_id , mobile_number  , otp_purpose , otp , country_code , expires_at) values (?,?,?,?,?,?)", [user_id, mobile_number, purpose, otp, country_code, expires_at])
        // console.log(otpSend)
        if (otpSend.affectedRows > 0) {
            // console.log(otpSend , "otp data")
            return otpSend
        }

        return null
    }
}

module.exports = { common, commonApiFunction }