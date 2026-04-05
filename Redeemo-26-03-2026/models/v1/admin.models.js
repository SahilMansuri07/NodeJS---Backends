const md5 = require("md5");
const db = require("../../config/database");
const { sendResponse } = require("../../utils/middelware");


const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [exist] = await db.query(
            "SELECT id FROM tbl_admin WHERE email = ? AND is_delete = 0",
            [email]
        );

        if (exist.length > 0) {
            return sendResponse(req, res, 200, 0, "Email Already Exists", {});
        }

        const [insertData] = await db.query(
            `INSERT INTO tbl_admin (username, email, password, role) VALUES (?, ?, ?, 'admin')`,
            [username, email, md5(password)]
        );

        if (insertData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Failed To Create Admin", {});
        }

        const [result] = await db.query("SELECT * FROM tbl_admin WHERE id = ?", [insertData.insertId])

        return sendResponse(req, res, 200, 1, "Admin Created Successfully", {
            admin_id: insertData.insertId,
            result
        });

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { admin_id, username, email, password, is_lock, is_active } = req.body;

     

        const [admin] = await db.query(
            "SELECT * FROM tbl_admin WHERE id = ? AND is_delete = 0",
            [admin_id]
        );

        if (admin.length === 0) {
            return sendResponse(req, res, 200, 3, "Admin Not Found", {});
        }

        if (admin[0].role === 'superadmin') {
            return sendResponse(req, res, 200, 0, "Cannot Modify SuperAdmin", {});
        }

        if (email) {
            const [exist] = await db.query(
                "SELECT id FROM tbl_admin WHERE email = ? AND id != ? AND is_delete = 0",
                [email, admin_id]
            );

            if (exist.length > 0) {
                return sendResponse(req, res, 200, 0, "Email Already Exists", {});
            }
        }

        let updateFields = [];
        let values = [];

        if (username) { updateFields.push("username = ?"); values.push(username); }
        if (email) { updateFields.push("email = ?"); values.push(email); }
        if (password) { updateFields.push("password = ?"); values.push(md5(password)); }
        if (is_lock !== undefined) { updateFields.push("is_lock = ?"); values.push(is_lock); }
        if (is_active !== undefined) { updateFields.push("is_active = ?"); values.push(is_active); }

        if (updateFields.length === 0) {
            return sendResponse(req, res, 200, 2, "No Fields Provided To Update", {});
        }

        values.push(admin_id);

        await db.query(
            `UPDATE tbl_admin SET ${updateFields.join(", ")} WHERE id = ?`,
            values
        );

        return sendResponse(req, res, 200, 1, "Admin Updated Successfully", {});

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { admin_id } = req.body;

        if (req.loginUser.role !== 'superadmin') {
            return sendResponse(req, res, 401, 0, "Only SuperAdmin Can Delete Admin", {});
        }

        const [admin] = await db.query(
            "SELECT * FROM tbl_admin WHERE id = ? AND is_delete = 0",
            [admin_id]
        );

        if (admin.length === 0) {
            return sendResponse(req, res, 200, 3, "Admin Not Found", {});
        }

        if (admin[0].role === 'superadmin') {
            return sendResponse(req, res, 200, 0, "Cannot Delete SuperAdmin", {});
        }

        await db.query(
            "UPDATE tbl_admin SET is_delete = 1 WHERE id = ?",
            [admin_id]
        );

        return sendResponse(req, res, 200, 1, "Admin Deleted Successfully", {});

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

const getAdminList = async (req, res) => {
    try {

        if (req.loginUser.role !== 'superadmin') {
            return sendResponse(req, res, 401, 0, "Only SuperAdmin Can View Admins", {});
        }

        const [admins] = await db.query(
            `SELECT id, username, email, role, is_lock, is_active, created_at 
             FROM tbl_admin 
             WHERE is_delete = 0`
        );

        if (admins.length === 0) {
            return sendResponse(req, res, 200, 3, "No Admins Found", {});
        }

        return sendResponse(req, res, 200, 1, "Admin List Fetched Successfully", { admins });

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


module.exports = { createAdmin, updateAdmin, deleteAdmin, getAdminList };