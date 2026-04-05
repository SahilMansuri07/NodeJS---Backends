const db = require("../../../config/database")
const { sendResponse } = require("../../../utils/middelware")
const { addNotification } = require("../user/notification.models")

 
const createVoucher = async (req, res) => {
    try {
 
        const { merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount } = req.body
 
        const [isVoucherCodeExist] = await db.query("SELECT id from tbl_voucher where voucher_code=? and merchant_id=?", [voucher_code, merchant_id])
        if (isVoucherCodeExist && isVoucherCodeExist[0]) {
            return sendResponse(req, res, 200, 0, "Voucher Code Already Exist for this Merchant", {})
        }
 
        const [result] = await db.query("INSERT INTO tbl_voucher(merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image, discount_type, discount_amount) values (?,?,?,?,?,?,?,?)", [merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount])
        if (result && result.affectedRows > 0) {
            const voucherId = result.insertId
           
            const [fetchData] = await db.query(`SELECT * FROM tbl_voucher WHERE id = ?` , [voucherId])

            // Send notification to nearby users
            const [merchantData] = await db.query("SELECT lat, log, merchant_name FROM tbl_merchants WHERE id = ? AND is_active = 1 AND is_delete = 0", [merchant_id])
            if (merchantData && merchantData[0] && merchantData[0].lat && merchantData[0].log) {
                const merchantLat = merchantData[0].lat
                const merchantLog = merchantData[0].log
                const merchantName = merchantData[0].merchant_name
                console.log(merchantLat , merchantLog)

                // Find users within 10km (assuming lat/log in degrees, 111.32 km per degree approx)
                const [nearbyUsers] = await db.query(`
                    SELECT id FROM tbl_user 
                    WHERE is_active = 1 AND is_delete = 0 
                    AND lat IS NOT NULL AND log IS NOT NULL
                    AND (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(log) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= 10
                `, [merchantLat, merchantLog, merchantLat])

                if (nearbyUsers && nearbyUsers.length > 0) {
                    const title = "New Voucher Available!"
                    const description = `${merchantName} has added a new voucher: ${voucher_name}`

                    for (const user of nearbyUsers) {
                        await addNotification(title, description, merchant_id, 'merchant', user.id, 'user')
                    }
                }
            }

            return sendResponse(req, res, 200, 1, "Voucher Created Successfully", { voucherData: fetchData })
        }
 
        return sendResponse(req, res, 200, 0, "Error During Creating Voucher", {})
    }
    catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Creating Voucher", { err })
    }
}
 
const fetchVoucherList = async (req, res) => {
    try {
        // 1. Sanitize and Parse Pagination (CRITICAL: LIMIT requires Integers)
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size;


        const search = req.query.search || "";
        const trimmedField = typeof search === "string" ? search.trim() : "";
        const likeField = `%${trimmedField}%`;

       
        const adminId = req.loginUser.id;

    
        const [result] = await db.query(`
            SELECT 
                v.id, 
                v.merchant_id, 
                merchant.merchant_name, 
                v.voucher_name, 
                v.voucher_description, 
                v.voucher_code, 
                v.expiry_date, 
                v.image, 
                v.discount_type, 
                v.discount_amount
            FROM tbl_voucher AS v
            INNER JOIN tbl_merchants AS merchant 
                ON merchant.id = v.merchant_id
            WHERE merchant.admin_id = ? 
                AND merchant.is_active = 1 
                AND merchant.is_delete = 0
                AND v.is_active = 1 
                AND v.is_delete = 0
                AND (
                    ? = '' 
                    OR v.voucher_name LIKE ? 
                    OR v.voucher_description LIKE ? 
                    OR v.voucher_code LIKE ?
                )
            LIMIT ?, ?
        `, [
            adminId,        // For merchant.admin_id
            trimmedField,   // For empty check (? = '')
            likeField,      // For name LIKE
            likeField,      // For description LIKE
            likeField,      // For code LIKE
            offset,         // LIMIT offset (Integer)
            size            // LIMIT count (Integer)
        ]);

        if (result && result.length > 0) {
            return sendResponse(req, res, 200, 1, "Voucher List Fetched Successfully", { 
                vouchers: result,
                currentPage: page,
                pageSize: size
            });
        }

        return sendResponse(req, res, 200, 0, "No Voucher Data Found", { vouchers: [] });

    } catch (err) {
        console.error("SQL Error:", err);
        return sendResponse(req, res, 500, 0, "Error During Fetching Voucher List", { error: err.message });
    }
};

const updateVoucher = async (req, res) => {
    try {
        const { voucher_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount } = req.body
        const adminId = req.loginUser.id

        const [isVoucherExist] = await db.query(
            `SELECT v.id FROM tbl_voucher v
            INNER JOIN tbl_merchants m ON m.id = v.merchant_id
            WHERE v.id = ? AND m.admin_id = ? AND v.is_active = 1 AND v.is_delete = 0`,
            [voucher_id, adminId]
        )
        if (!isVoucherExist || isVoucherExist.length === 0) {
            return sendResponse(req, res, 200, 0, "Voucher Not Found", {})
        }

        if (voucher_code) {
            const [isVoucherCodeExist] = await db.query(
                `SELECT id FROM tbl_voucher WHERE voucher_code = ? AND id != ? AND is_active = 1 AND is_delete = 0`,
                [voucher_code, voucher_id]
            )
            if (isVoucherCodeExist && isVoucherCodeExist[0]) {
                return sendResponse(req, res, 200, 0, "Voucher Code Already Exist", {})
            }
        }

        const [result] = await db.query(
            `UPDATE tbl_voucher SET
                voucher_name = COALESCE(?, voucher_name),
                voucher_description = COALESCE(?, voucher_description),
                voucher_code = COALESCE(?, voucher_code),
                expiry_date = COALESCE(?, expiry_date),
                image = COALESCE(?, image),
                discount_type = COALESCE(?, discount_type),
                discount_amount = COALESCE(?, discount_amount),
                updated_at = NOW()
            WHERE id = ?`,
            [voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount, voucher_id]
        )
        if (result && result.affectedRows > 0) {
            const [fetchData] = await db.query(`SELECT * FROM tbl_voucher WHERE id = ?`, [voucher_id])
            return sendResponse(req, res, 200, 1, "Voucher Updated Successfully", { voucherData: fetchData })
        }

        return sendResponse(req, res, 200, 0, "Error During Updating Voucher", {})
    }
    catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Updating Voucher", { err })
    }
}

const deleteVoucher = async (req, res) => {
    try {
        const { voucher_id } = req.body
        const adminId = req.loginUser.id

        const [isVoucherExist] = await db.query(
            `SELECT v.id FROM tbl_voucher v
            INNER JOIN tbl_merchants m ON m.id = v.merchant_id
            WHERE v.id = ? AND m.admin_id = ? AND v.is_active = 1 AND v.is_delete = 0`,
            [voucher_id, adminId]
        )
        if (!isVoucherExist || isVoucherExist.length === 0) {
            return sendResponse(req, res, 200, 0, "Voucher Not Found", {})
        }

        const [result] = await db.query(
            `UPDATE tbl_voucher SET is_active = 0, is_delete = 1, updated_at = NOW() WHERE id = ?`,
            [voucher_id]
        )
        if (result && result.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Voucher Deleted Successfully", {})
        }

        return sendResponse(req, res, 200, 0, "Error During Deleting Voucher", {})
    }
    catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Deleting Voucher", { err })
    }
}


module.exports = { createVoucher, fetchVoucherList,
    deleteVoucher, updateVoucher 
    }
 