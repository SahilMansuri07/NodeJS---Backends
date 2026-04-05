const db = require("../../../config/database");
const { common } = require("../../../utils/common");
const { sendResponse } = require("../../../utils/middelware");


const signIn = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        let query = "SELECT * FROM tbl_admin WHERE is_active = 1 AND (email = ? OR username = ?) AND password = ?";

        const [existingUser] = await db.query(query, [email, username, password]);

        if (existingUser.length === 0) {
            return sendResponse(req, res, 200, 0, "Invalid Credentials");
        }

        const superAdmin = existingUser[0];

        // if (superAdmin.is_locked === 1) {
        //     return sendResponse(req, res, 200, 0, "Admin Has Been Locked");
        // }

        // if (superAdmin.is_active === 0) {
        //     return sendResponse(req, res, 200, 0, "Super Admin Account Is Locked");
        // }

        const token = await common.generateToken(superAdmin, req, res)
        return sendResponse(req, res, 200, 1, "Sign In Successful", {
            super_admin_id: superAdmin.id,
            email: superAdmin.email,
            token
        });

    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
};

const logOut = async (req, res) => {
    try {
        const token = req.headers["token"];

        if (!token) {
            return sendResponse(req, res, 200, 0, "Token is Missing");
        }

        const bearerToken = token.replace("Bearer ", "").trim();

        const [logoutQuery] = await db.query(
            `UPDATE tbl_admin_device SET is_active = 0 WHERE token = ? AND is_active = 1`,
            [bearerToken]
        );

        if (logoutQuery.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Logout Successful", {});
        }

        return sendResponse(req, res, 200, 0, "User Already Logged Out", {});

    } catch (error) {
        console.error("Error in logOut:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}


module.exports = {
    signIn,
    logOut
}