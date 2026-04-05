const db = require("../../../config/database");
const { common } = require("../../../utils/common");
const { sendResponse } = require("../../../utils/middelware");

const fetchUsers = async (req, res) => {
    try {
        const userData = await common.getUser()

        if (!userData || userData.length === 0) {
            return sendResponse(req, res, 200, 3, "No Users Found", {});
        }

        return sendResponse(req, res, 200, 1, "User Data Fetched Successfully", { userData });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
}

const lockUser = async (req, res) => {
    try {
        const { user_id } = req.body

        const userData = await common.getUser(user_id);

        if (!userData || userData.length === 0) {
            return sendResponse(req, res, 200, 3, "User Not Found", {});
        }

        const currentStatus = userData[0].is_locked;
        const newStatus = currentStatus === 1 ? 0 : 1;

        const [result] = await db.query(
            `UPDATE tbl_user SET is_locked = ? WHERE id = ? AND is_active = 1`,
            [newStatus, user_id]
        );

        if (result.affectedRows > 0) {
            return sendResponse(req, res, 200, 1,
                newStatus === 1 ? "User Locked Successfully" : "User Unlocked Successfully",
                { is_locked: newStatus }
            );
        }

        return sendResponse(req, res, 200, 0, "Failed To Update User", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.body;

        const userData = await common.getUser(user_id);

        if (!userData || userData.length === 0) {
            return sendResponse(req, res, 200, 3, "User Not Found", {});
        }

        if (userData[0].is_delete === 1) {
            return sendResponse(req, res, 200, 0, "User Already Deleted", {});
        }

        const [result] = await db.query(
            `UPDATE tbl_user SET is_active = 0, is_delete = 1 WHERE id = ?`,
            [user_id]
        );

        if (result.affectedRows > 0) {
            return sendResponse(req, res, 200, 1,
                `${userData[0].first_name} ${userData[0].last_name} Deleted Successfully`,
                {}
            );
        }

        return sendResponse(req, res, 200, 0, "Failed To Delete User", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

module.exports = {
    fetchUsers,
    lockUser,
    deleteUser
}