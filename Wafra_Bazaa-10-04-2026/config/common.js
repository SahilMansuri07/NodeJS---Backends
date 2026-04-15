import jwt from "jsonwebtoken";
import db from "../config/db.js";


const common = {
    async checkUniqueEmail(request) {
        try {
            const sql = "SELECT id, email FROM tbl_user WHERE email = ? AND is_delete = 0 LIMIT 1";
            const result = await db.query(sql, [request.email]);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error checking unique email: ", error);
            throw error;
        }
    },

    async checkUniqueMobileNumber(request) {
        try {
            const sql = "SELECT id, mobile_number FROM tbl_user WHERE country_code = ? AND mobile_number = ? AND is_delete = 0 LIMIT 1";
            const result = await db.query(sql, [request.country_code, request.mobile_number]);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error checking unique mobile number: ", error);
            throw error;
        }
    },

    async checkUserId(request) {
        try {
            const sql = "SELECT id FROM tbl_user WHERE id = ? AND is_delete = 0 LIMIT 1";
            const result = await db.query(sql, [request.id]);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error checking user ID: ", error);
            throw error;
        }
    },

    async checkUsername(request) {
        try {
            const sql = "SELECT id, name FROM tbl_user WHERE name = ? AND is_delete = 0 LIMIT 1";
            const result = await db.query(sql, [request.name]);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error checking unique username: ", error);
            throw error;
        }
    },

    async checkSocialId(request) {
        try {
            const sql = "SELECT id, social_id FROM tbl_user WHERE social_id = ? AND is_delete = 0 LIMIT 1";
            const result = await db.query(sql, [request.social_id]);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error checking unique social ID: ", error);
            throw error;
        }
    },

    async validateIdExists(tableName, id) {
        try {
            const sql = `SELECT id FROM ${tableName} WHERE id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1`;
            const result = await db.query(sql, [id]);
            return result && result.length > 0;
        } catch (error) {
            console.error("Error validating ID exists: ", error);
            return false;
        }
    },

    async getUserDetails(request) {
        try {
            let sql = "SELECT * FROM tbl_user WHERE is_delete = 0";
            const params = [];

            if (request?.id) {
                sql += " AND id = ? LIMIT 1";
                params.push(request.id);
            } else {
                sql += " ORDER BY id DESC";
            }

            const result = await db.query(sql, params);
            return request?.id ? (result && result.length > 0 ? result[0] : null) : (result || []);
        } catch (error) {
            console.error("Error fetching user details: ", error);
            return null;
        }
    },

    generateToken: async function (user, request = {}) {
        try {
            const normalizedUser = Array.isArray(user) ? user[0] : user;

            if (!normalizedUser || !normalizedUser.id) {
                throw new Error("Invalid user data for token generation");
            }

            const payload = {
                id: normalizedUser.id,
                name: normalizedUser.name || null,
                email: normalizedUser.email || null,
                mobile_number: normalizedUser.mobile_number || null,
                country_code: normalizedUser.country_code || null,
                login_type: normalizedUser.login_type || null,
                social_id: normalizedUser.social_id || null,
                is_verified: normalizedUser.is_verified ?? null,
                role: normalizedUser.role || null,
            };

            const user_id = normalizedUser.id;
            const token = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });
            const requestBody = request?.body || request || {};
            const { device_token, device_type, device_name, device_model, os_version, uuid, ip } = requestBody;

            const devicePayload = {
                user_id,
                token,
                device_token: device_token || null,
                device_type: device_type || null,
                device_name: device_name || null,
                device_model: device_model || null,
                os_version: os_version || null,
                uuid: uuid || null,
                ip: ip || null,
                is_active: 1,
                is_delete: 0,
            };

            if (uuid) {
                // Check if device already exists
                const checkSql = "SELECT id FROM tbl_user_device WHERE user_id = ? AND uuid = ? AND is_active = 1 AND is_delete = 0 LIMIT 1";
                const deviceExists = await db.query(checkSql, [user_id, uuid]);

                if (deviceExists && deviceExists.length > 0) {
                    // Update existing device
                    const updateSql = `UPDATE tbl_user_device SET token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ? WHERE user_id = ? AND uuid = ?`;
                    await db.query(updateSql, [token, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, ip || null, user_id, uuid]);
                } else {
                    // Create new device
                    const insertSql = `INSERT INTO tbl_user_device (user_id, token, device_token, device_type, device_name, device_model, os_version, uuid, ip, is_active, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`;
                    await db.query(insertSql, [user_id, token, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, uuid, ip || null]);
                }
            } else {
                // Create device without uuid
                const insertSql = `INSERT INTO tbl_user_device (user_id, token, device_token, device_type, device_name, device_model, os_version, ip, is_active, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`;
                await db.query(insertSql, [user_id, token, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, ip || null]);
            }

            return token;

        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    
    getUserCart : async function (user_id) {
        try {
            const sql = `SELECT c.id as cart_id, c.quantity, v.id as variant_id, v.product_id, v.size_id, v.color_id, v.type_id
            FROM tbl_cart c
            JOIN tbl_product_variant v ON c.variant_id = v.id
            WHERE c.user_id = ? AND c.is_active = 1 AND c.is_delete = 0`;
            const result = await db.query(sql, [user_id]);
            return result || [];
        } catch (error) {
            console.error("Error fetching user cart: ", error);
            return [];
        }
    },
    
    sendNotification : async function(sender_id, receiver_id, title, description) {
        try {
            const consoleparsedReceiverId = receiver_id == null ? null : Number(receiver_id);
            // console.log("Parsed Receiver ID:", consoleparsedReceiverId);
            // console.log("Original Receiver ID:", receiver_id);
           
            const sql = `INSERT INTO tbl_notification (sender_id, receiver_id, title, description, is_active, is_delete) VALUES (?, ?, ?, ?, 1, 0)`;
            await db.query(sql, [sender_id ?? null, consoleparsedReceiverId , title ?? null, description ?? null]);
        } catch (error) {
            console.error("Error sending notification: ", error);
        }
    }
}

export default common;