import jwt from "jsonwebtoken";
import db from "../config/db.js";
import query from "../config/dbHelper.js";
import nodemailer from "nodemailer";
import multer  from "multer";
import path from "path";
import fs from "fs";
import { profile } from "console";


const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

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
            };
            
            const requestBody = request?.body || request || {};
            const { device_token, device_type, device_name, device_model, os_version, uuid, ip } = requestBody;
            
            const user_id = normalizedUser.id;
            const token = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });
           
            const devicePayload = {
                user_id : user_id,
                token : token || null,
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
                const [deviceExists] = await db.query(checkSql, [user_id, uuid]);
                if (deviceExists && deviceExists.length > 0) {
                    // Update existing device
                    await query.updateQuery(
                        "tbl_user_device",
                        "token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ?",
                        "user_id = ? AND uuid = ?",
                        [token, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, ip || null, user_id, uuid]
                    );
                } else {
                    // Create new device
                    await query.insertQuery("tbl_user_device", devicePayload);
                }
            } else {
                // Create device without uuid
                await query.insertQuery("tbl_user_device", devicePayload);
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
            const notificationInsert = {
                sender_id: sender_id ?? null,
                receiver_id: consoleparsedReceiverId,
                title: title ?? null,
                description: description ?? null,
                is_active: 1,
                is_delete: 0
            }
           
            await query.insertQuery("tbl_notification", notificationInsert);
        } catch (error) {
            console.error("Error sending notification: ", error);
        }
    },

    async sendOtpMail({ toEmail, subject, htmlMessage }) {
 
        if (!toEmail || !subject || !htmlMessage) {
        return { skipped: true, reason: "Missing toEmail/subject/htmlMessage" };
        }
    
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        const mailFrom = process.env.MAIL_FROM || smtpUser;
    
        if (!mailFrom || !smtpUser || !smtpPass) {
        return { skipped: true, reason: "Mail env is not configured" };
        }
    
        const smtpHost =
        process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.example.com"
            ? process.env.SMTP_HOST
            : "smtp.gmail.com";
    
        const transporter = nodemailer.createTransport({
        service: "gmail",
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        });
    
        const info = await transporter.sendMail({
        from: mailFrom,
        to: toEmail,
        subject,
        html: htmlMessage,
        });
    
        return { skipped: false, messageId: info.messageId };
    },

    async deleteOtp (otpId) {
        try {
            const deleteOtp = `DELETE FROM tbl_otp WHERE id = ?`;
            await db.query(deleteOtp, [otpId]);
        } catch (error) {
            console.error("Error deleting OTP: ", error);
        }
    },
    profileupload : multer({
        storage,
        limits: { fileSize: 2 * 1024 * 1024 },      
    }),

     getprofileimage(request) {
        if (request.file && request.file.filename) {
            return request.file.filename;
        }
        return null;
    }
}

export default common;