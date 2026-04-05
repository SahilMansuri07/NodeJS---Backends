const db = require("../../../config/database")
const { sendResponse } = require("../../../utils/middelware")

const addContactUs = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { subject, message } = req.body

        const [result] = await db.query(
            "INSERT INTO tbl_contact_us (user_id, subject, message, is_active, is_delete, created_at, updated_at) VALUES (?, ?, ?, 1, 0, NOW(), NOW())",
            [user_id, subject, message]
        )

        if (result && result.affectedRows === 1) {
            return sendResponse(req, res, 200, 1, "Contact message submitted successfully", {
                id: result.insertId,
                user_id,
                subject,
                message
            })
        }

        return sendResponse(req, res, 500, 0, "Failed to submit contact message", {})
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, "Internal Server Error", { error })
    }
}

const fetchContactUs = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const offset = (page - 1) * size

        const [messages] = await db.query(
            `
            SELECT
        c.id,
        c.user_id,
        c.subject,
        c.message,
        c.is_active,
        c.is_delete,
        DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.country_code,
        u.mobile_number
      FROM tbl_contact_us c
      LEFT JOIN tbl_user u ON u.id = c.user_id
      WHERE c.is_delete = 0
      ORDER BY c.id DESC;
            `,
        
        )
        console.log(messages)
        const [total] = await db.query(
            "SELECT COUNT(*) as total FROM tbl_contact_us where is_delete = 0",
            [user_id]
        )

        return sendResponse(req, res, 200, 1, "Contact messages fetched successfully", {
            messages,
            pagination: {
                page,
                size,
                total: total[0].total,
                totalPages: Math.ceil(total[0].total / size)
            }
        })
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, "Internal Server Error", { error })
    }
}

module.exports = { addContactUs, fetchContactUs }
