const db = require("../../../config/database")
const { sendResponse } = require("../../../utils/middelware")

const fetchNotification = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const offset = (page - 1) * size

        const [notifications] = await db.query(
            "SELECT id, title, description, sender_id, sender_type, receiver_id, receiver_type, is_read, created_at FROM tbl_notification WHERE receiver_id = ? AND receiver_type = 'user' AND is_active = 1 AND is_delete = 0 ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [user_id, size, offset]
        )

        const [total] = await db.query(
            "SELECT COUNT(*) as total FROM tbl_notification WHERE receiver_id = ? AND receiver_type = 'user' AND is_active = 1 AND is_delete = 0",
            [user_id]
        )

        return sendResponse(req, res, 200, 1, "Notifications fetched successfully", {
            notifications,
            pagination: {
                page,
                size,
                total: total[0].total,
                totalPages: Math.ceil(total[0].total / size)
            }
        })
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error fetching notifications", { err })
    }
}

const addNotification = async (title, description, sender_id, sender_type, receiver_id, receiver_type) => {
    try {
        const [result] = await db.query(
            "INSERT INTO tbl_notification (title, description, sender_id, sender_type, receiver_id, receiver_type, is_read, is_active, is_delete, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, 1, 0, NOW(), NOW())",
            [title, description, sender_id, sender_type, receiver_id, receiver_type]
        )
        return result.insertId
    } catch (err) {
        console.log("Error adding notification:", err)
        return null
    }
}

const createNotification = async (req, res) => {
    try {
        const { title, description, sender_id, sender_type, receiver_id, receiver_type } = req.body;

        const insertId = await addNotification(title, description, sender_id, sender_type, receiver_id, receiver_type);
        if (!insertId) {
            return sendResponse(req, res, 500, 0, "Failed to create notification", {});
        }

        return sendResponse(req, res, 200, 1, "Notification created successfully", { id: insertId });
    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Error creating notification", { err });
    }
}

module.exports = { fetchNotification, addNotification, createNotification }