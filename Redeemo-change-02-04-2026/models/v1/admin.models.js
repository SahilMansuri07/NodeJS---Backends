const md5 = require("md5");
const db = require("../../config/database");
const { sendResponse } = require("../../utils/middelware");
const { common } = require("../../utils/common");

// ==================== ADMIN MANAGEMENT ====================

const adminManagement = {
    createAdmin: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const [exist] = await db.query(
                "SELECT id FROM tbl_admin WHERE email = ? AND is_delete = 0",
                [email]
            );

            if (exist.length > 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Email_Already_Exist" }, {});
            }

            const [insertData] = await db.query(
                `INSERT INTO tbl_admin (username, email, password, role) VALUES (?, ?, ?, 'admin')`,
                [username, email, md5(password)]
            );

            if (insertData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Create_Admin" }, {});
            }

            const [result] = await db.query("SELECT * FROM tbl_admin WHERE id = ?", [insertData.insertId]);

            return sendResponse(req, res, 200, 1, { keyword: "Admin_Created_Successfully" }, {
                admin_id: insertData.insertId,
                result
            });

        } catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error" }, {});
        }
    },

    updateAdmin: async (req, res) => {
        try {
            const { admin_id, username, email, password, is_lock, is_active } = req.body;

            const [admin] = await db.query(
                "SELECT * FROM tbl_admin WHERE id = ? AND is_delete = 0",
                [admin_id]
            );

            if (admin.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Admin_Not_Found" }, {});
            }

            if (admin[0].role === 'superadmin') {
                return sendResponse(req, res, 200, 0, { keyword: "Cannot_Modify_SuperAdmin" }, {});
            }

            if (email) {
                const [exist] = await db.query(
                    "SELECT id FROM tbl_admin WHERE email = ? AND id != ? AND is_delete = 0",
                    [email, admin_id]
                );

                if (exist.length > 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Email_Already_Exist" }, {});
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
                return sendResponse(req, res, 200, 2, { keyword: "No_Fields_Provided_To_Update" }, {});
            }

            values.push(admin_id);

            await db.query(
                `UPDATE tbl_admin SET ${updateFields.join(", ")} WHERE id = ?`,
                values
            );

            return sendResponse(req, res, 200, 1, { keyword: "Admin_Updated_Successfully" }, {});

        } catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error" }, {});
        }
    },

    deleteAdmin: async (req, res) => {
        try {
            const { admin_id } = req.body;

            if (req.loginUser.role !== 'superadmin') {
                return sendResponse(req, res, 401, 0, { keyword: "Only_SuperAdmin_Can_Delete_Admin" }, {});
            }

            const [admin] = await db.query(
                "SELECT * FROM tbl_admin WHERE id = ? AND is_delete = 0",
                [admin_id]
            );

            if (admin.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Admin_Not_Found" }, {});
            }

            if (admin[0].role === 'superadmin') {
                return sendResponse(req, res, 200, 0, { keyword: "Cannot_Delete_SuperAdmin" }, {});   
            }

            await db.query(
                "UPDATE tbl_admin SET is_delete = 1 WHERE id = ?",
                [admin_id]
            );

            return sendResponse(req, res, 200, 1, { keyword: "Admin_Deleted_Successfully" }, {});

        } catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error" }, {});
        }
    },

    getAdminList: async (req, res) => {
        try {
            if (req.loginUser.role !== 'superadmin') {
                return sendResponse(req, res, 401, 0, { keyword: "Only_SuperAdmin_Can_View_Admins" }, {});
            }

            const [admins] = await db.query(
                `SELECT id, username, email, role, is_lock, is_active, created_at 
                 FROM tbl_admin 
                 WHERE is_delete = 0`
            );

            if (admins.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Admins_Found" }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Admin_List_Fetched_Successfully" }, { admins });

        } catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error" }, {});
        }
    }
};
// ==================== INTEREST MANAGEMENT ====================

const interestManagement = {
    addInterest: async (req, res) => {
        try {
            const { name } = req.body;

            const [exist] = await db.query(
                "SELECT id FROM tbl_interest WHERE name = ? AND is_delete = 0",
                [name]
            );

            if (exist.length > 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Interest_Already_Exists", component: {} }, {});
            }

            const [insertData] = await db.query(
                `INSERT INTO tbl_interest (name) VALUES (?)`,
                [name]
            );

            if (insertData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Create_Interest", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Interest_Added_Successfully", component: { } }, {});

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    getInterest: async (req, res) => {
        try {
            const [listInterest] = await db.query(
                "SELECT * FROM tbl_interest"
            );

            if (listInterest.length > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Interest_Details_Fetched", component: {} }, { listInterest });
            }

            return sendResponse(req, res, 200, 0, { keyword: "No_Interest_Found", component: {} }, {});

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    }
};

// ==================== USER MANAGEMENT ====================

const userManagement = {
    fetchUsers: async (req, res) => {
        try {
            const userData = await common.getUser();

            if (!userData || userData.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Users_Found", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "User_Data_Fetched_Successfully", component: {} }, { userData });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    lockUser: async (req, res) => {
        try {
            const { user_id } = req.body;

            const userData = await common.getUser(user_id);

            if (!userData || userData.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "User_Not_Found", component: {} }, {});
            }

            const currentStatus = userData[0].is_locked;
            const newStatus = currentStatus === 1 ? 0 : 1;

            const [result] = await db.query(
                `UPDATE tbl_user SET is_locked = ? WHERE id = ? AND is_active = 1`,
                [newStatus, user_id]
            );

            if (result.affectedRows > 0) {
                return sendResponse(req, res, 200, 1,
                    newStatus === 1 ? { keyword: "User_Locked_Successfully", component: {} } : { keyword: "User_Unlocked_Successfully", component: {} },
                    { is_locked: newStatus }
                );
            }

            return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Update_User", component: {} }, {});

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { user_id } = req.body;

            const userData = await common.getUser(user_id);

            if (!userData || userData.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "User_Not_Found", component: {} }, {});
            }

            if (userData[0].is_delete === 1) {
                return sendResponse(req, res, 200, 0, { keyword: "User_Already_Deleted", component: {} }, {});
            }

            const [result] = await db.query(
                `UPDATE tbl_user SET is_active = 0, is_delete = 1 WHERE id = ?`,
                [user_id]
            );

            if (result.affectedRows > 0) {
                return sendResponse(req, res, 200, 1,
                    { keyword: "User_Deleted_Successfully", component: { firstName: userData[0].first_name, lastName: userData[0].last_name } },
                    {}
                );
            }

            return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Delete_User", component: {} }, {});

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    }
};

// ==================== CATEGORY MANAGEMENT ====================

const categoryManagement = {
    addCategory: async (req, res) => {
        try {
            const { name, image } = req.body;

            const [exist] = await db.query(`SELECT * FROM tbl_categories WHERE name = ?`, [name]);
            if (exist.length > 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Category_Name_Already_Exists", component: {} }, { exist });
            }

            const [addCategory] = await db.query(`INSERT INTO tbl_categories (name, image) VALUES (?, ?)`, [name, image]);
            if (addCategory.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Category_Added_Successfully", component: {} }, {});
            }
            return sendResponse(req, res, 200, 0, { keyword: "Error_Adding_Category_Data", component: {} }, {});

        } catch (error) {
            console.error("Error in signIn:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const { search, is_active } = req.query;

            let queryStr = `SELECT * FROM tbl_categories WHERE is_delete = 0`;
            const params = [];

            console.log(search);
            if (search) {
                queryStr += ` AND name LIKE ?`;
                params.push(`%${search}%`);
            }
            if (is_active !== undefined && is_active !== "") {
                queryStr += ` AND is_active = ?`;
                params.push(is_active);
            }

            queryStr += ` ORDER BY created_at DESC`;

            const [categories] = await db.query(queryStr, params);

            if (categories.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "No_Categories_Found", component: {} }, { categories: [] });
            }

            return sendResponse(req, res, 200, 1, { keyword: "Categories_Fetched_Successfully", component: {} }, { categories });

        } catch (error) {
            console.error("Error in getAllCategories:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id, name, image, is_active } = req.body;

            if (!id) {
                return sendResponse(req, res, 200, 0, { keyword: "Category_ID_Is_Required", component: {} }, {});
            }

            if (name) {
                const [nameExist] = await db.query(
                    `SELECT * FROM tbl_categories WHERE name = ? AND id != ? AND is_delete = 0`,
                    [name, id]
                );
                if (nameExist.length > 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Category_Name_Already_Exists", component: {} }, {});
                }
            }

            const fields = [];
            const params = [];

            if (name !== undefined) { fields.push(`name = ?`); params.push(name); }
            if (image !== undefined) { fields.push(`image = ?`); params.push(image); }
            if (is_active !== undefined) { fields.push(`is_active = ?`); params.push(is_active); }

            if (fields.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "No_Fields_Provided_To_Update", component: {} }, {});
            }

            params.push(id);

            const [updateData] = await db.query(
                `UPDATE tbl_categories SET ${fields.join(", ")} WHERE id = ? AND is_delete = 0`,
                params
            );

            if (updateData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Error_Updating_Category", component: {} }, {});
            }

            const [updatedCategory] = await db.query(
                `SELECT * FROM tbl_categories WHERE id = ?`,
                [id]
            );

            return sendResponse(req, res, 200, 1, { keyword: "Category_Updated_Successfully", component: {} }, { updatedCategory });

        } catch (error) {
            console.error("Error in updateCategory:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return sendResponse(req, res, 200, 0, { keyword: "Category_ID_Is_Required", component: {} }, {});
            }

            const [categoryExist] = await db.query(
                `SELECT * FROM tbl_categories WHERE id = ? AND is_delete = 0`,
                [id]
            );
            if (categoryExist.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Category_Not_Found", component: {} }, {});
            }

            const [deleteData] = await db.query(
                `UPDATE tbl_categories SET is_active = 0 AND is_delete = 1 WHERE id = ?`,
                [id]
            );

            if (deleteData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Error_Deleting_Category", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Category_Deleted_Successfully", component: {} }, {});

        } catch (error) {
            console.error("Error in deleteCategory:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    }
};

// ==================== AMENITIES MANAGEMENT ====================

const amenitiesManagement = {
    addAmenities: async (req, res) => {
        try {
            const { name, image } = req.body;

            const [exist] = await db.query(`SELECT * FROM tbl_amenities WHERE name = ?`, [name]);
            if (exist.length > 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_Name_Already_Exists", component: {} }, { exist });
            }

            const [addAmenities] = await db.query(`INSERT INTO tbl_amenities (name, image) VALUES (?, ?)`, [name, image]);
            if (addAmenities.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Amenities_Added_Successfully", component: {} }, {});
            }
            return sendResponse(req, res, 200, 0, { keyword: "Error_Adding_Amenities_Data", component: {} }, {});

        } catch (error) {
            console.error("Error in signIn:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    getAllAmenities: async (req, res) => {
        try {
            const [getAminities] = await db.query(`SELECT * FROM tbl_amenities`);

            if (getAminities && getAminities.length > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Amenities_Fetched_Successfully", component: {} }, { getAminities });
            }
            return sendResponse(req, res, 200, 0, { keyword: "No_Amenities_Found", component: {} }, {});

        } catch (error) {
            console.error("Error in signIn:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    deleteAmenities: async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_ID_Is_Required", component: {} }, {});
            }

            const [AminitiesExist] = await db.query(
                `SELECT * FROM tbl_amenities WHERE id = ? AND is_delete = 0`,
                [id]
            );
            if (AminitiesExist.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_Not_Found", component: {} }, {});
            }

            const [deleteData] = await db.query(
                `UPDATE tbl_amenities SET is_active = 0 AND is_delete = 1 WHERE id = ?`,
                [id]
            );

            if (deleteData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Error_Deleting_Amenities", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Amenities_Deleted_Successfully", component: {} }, {});

        } catch (error) {
            console.error("Error in delete Amenities:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateAmenities: async (req, res) => {
        try {
            const { id, name, image } = req.body;

            if (!id) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_ID_Is_Required", component: {} }, {});
            }

            const [getAminities] = await db.query(
                `SELECT * FROM tbl_amenities WHERE id = ? AND is_delete = 0`,
                [id]
            );
            if (getAminities.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_Not_Found", component: {} }, {});
            }

            const [updateData] = await db.query(
                `UPDATE tbl_amenities SET name = ?, image = ? WHERE id = ?`,
                [name, image, id]
            );

            if (updateData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Error_Updating_Amenities", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Amenities_Updated_Successfully", component: {} }, {});

        } catch (error) {
            console.error("Error in Updating Amenities:", error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    }
};

// ==================== MERCHANT MANAGEMENT ====================

const merchantManagement = {
    addMerchant: async (req, res) => {
        try {
            const {
                merchant_name, logo_image, cover_image,
                lat, log, address, email, country_code,
                mobile_number, about_description, category_id,
                amenities_id, image_url, times = []
            } = req.body;

            const admin_id = req.loginUser.id;

            if (email) {
                const [emailExist] = await db.query(
                    "SELECT id FROM tbl_merchants WHERE email = ? AND is_delete = 0",
                    [email]
                );
                if (emailExist.length > 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Merchant_With_This_Email_Already_Exists", component: {} }, {});
                }
            }

            if (country_code && mobile_number) {
                const [mobileExist] = await db.query(
                    "SELECT id FROM tbl_merchants WHERE country_code = ? AND mobile_number = ? AND is_delete = 0",
                    [country_code, mobile_number]
                );
                if (mobileExist.length > 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Merchant_With_This_Mobile_Number_Already_Exists", component: {} }, {});
                }
            }

            if (category_id) {
                const [categoryExist] = await db.query(
                    "SELECT id FROM tbl_categories WHERE id = ? AND is_delete = 0 AND is_active = 1",
                    [category_id]
                );
                if (categoryExist.length === 0) {
                    return sendResponse(req, res, 200, 3, { keyword: "Category_Not_Found", component: {} }, {});
                }
            }

            if (amenities_id && amenities_id.length > 0) {
                const amenitiesArray = Array.isArray(amenities_id) ? amenities_id : [amenities_id];
                const [amenitiesExist] = await db.query(
                    `SELECT id FROM tbl_amenities WHERE id IN (?) AND is_delete = 0 AND is_active = 1`,
                    [amenitiesArray]
                );
                if (amenitiesExist.length !== amenitiesArray.length) {
                    return sendResponse(req, res, 200, 3, { keyword: "One_Or_More_Amenities_Not_Found", component: {} }, {});
                }
            }

            const [insertData] = await db.query(
                `INSERT INTO tbl_merchants 
                (admin_id, merchant_name, logo_image, cover_image, lat, log, address, email, country_code, mobile_number, about_description, category_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [admin_id, merchant_name, logo_image, cover_image, lat, log, address, email, country_code, mobile_number, about_description, category_id]
            );

            if (insertData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Add_Merchant", component: {} }, {});
            }

            const merchantId = insertData.insertId;

            if (amenities_id && amenities_id.length > 0) {
                const amenityResult = await amenitiesManagement.addAmenities(req, res, merchantId, amenities_id);
                if (amenityResult === "error") {
                    return;
                }
            }

            if (image_url && image_url.length > 0) {
                const mediaArray = Array.isArray(image_url) ? image_url : [image_url];

                for (const image_url of mediaArray) {
                    const [addMedia] = await db.query(
                        `INSERT INTO tbl_merchant_media (merchant_id, media_url) VALUES(?, ?)`,
                        [merchantId, image_url]
                    );

                    if (addMedia.affectedRows === 0) {
                        sendResponse(req, res, 200, 0, { keyword: "Failed_To_Add_Images", component: {} }, {});
                        return "error";
                    }
                }
            }

            if (times) {
                for (const time of times) {
                    const [addTiming] = await db.query(
                        `INSERT INTO tbl_merchant_timing (merchant_id, start_time, end_time, day, is_opened) VALUES(?, ?, ?, ?, ?)`,
                        [merchantId, time.start_time, time.end_time, time.day, time.is_opened]
                    );

                    if (addTiming.affectedRows === 0) {
                        sendResponse(req, res, 200, 0, { keyword: "Failed_To_Add_Timing", component: {} }, {});
                        return "error";
                    }
                }
            }

            let merchant = await common.getMerchantDetails(merchantId);
            console.log(merchant);
            if (!merchant) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Merchants_Found", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Added_Successfully", component: {} }, {
                merchant: merchant,
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    getMerchantList: async (req, res) => {
        try {
            const admin_id = req.loginUser.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            let result = await common.getMerchantDetails(null, admin_id, page, limit);

            if (!result || result.data.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Merchants_Found", component: {} }, {});
            }

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Fetched_Successfully", component: {} }, {
                merchants: result.data,
                total: result.total,
                page: page,
                limit: limit
            });
        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateMerchantBasic: async (req, res) => {
        try {
            const {
                id,
                merchant_name, email, country_code,
                mobile_number, about_description, category_id,
                lat, log, address,
                logo_image, cover_image
            } = req.body;

            const [merchantExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
                [id]
            );
            if (merchantExist.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {});
            }

            const updates = [];
            const values = [];

            if (merchant_name) { updates.push('merchant_name = ?'); values.push(merchant_name); }
            if (email) { updates.push('email = ?'); values.push(email); }
            if (country_code) { updates.push('country_code = ?'); values.push(country_code); }
            if (mobile_number) { updates.push('mobile_number = ?'); values.push(mobile_number); }
            if (about_description) { updates.push('about_description = ?'); values.push(about_description); }
            if (category_id) { updates.push('category_id = ?'); values.push(category_id); }
            if (lat !== undefined) { updates.push('lat = ?'); values.push(lat); }
            if (log !== undefined) { updates.push('log = ?'); values.push(log); }
            if (address) { updates.push('address = ?'); values.push(address); }
            if (logo_image) { updates.push('logo_image = ?'); values.push(logo_image); }
            if (cover_image) { updates.push('cover_image = ?'); values.push(cover_image); }

            if (updates.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "No_Fields_To_Update", component: {} }, {});
            }

            values.push(id);
            const [updateData] = await db.query(
                `UPDATE tbl_merchants SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            if (updateData.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Update_Merchant", component: {} }, {});
            }

            let merchant = await common.getMerchantDetails(id);

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Basic_Info_Updated_Successfully", component: {} }, {
                merchant: merchant
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateMerchantTimings: async (req, res) => {
        try {
            const { id, times } = req.body;

            const [merchantExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
                [id]
            );
            if (merchantExist.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {});
            }

            if (!times || !Array.isArray(times) || times.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Times_Array_Is_Required", component: {} }, {});
            }

            await db.query(
                "DELETE FROM tbl_merchant_timing WHERE merchant_id = ?",
                [id]
            );

            for (const time of times) {
                const [addTiming] = await db.query(
                    `INSERT INTO tbl_merchant_timing (merchant_id, start_time, end_time, day, is_opened) VALUES(?, ?, ?, ?, ?)`,
                    [id, time.start_time, time.end_time, time.day, time.is_opened]
                );

                if (addTiming.affectedRows === 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Update_Timing", component: {} }, {});
                }
            }

            let merchant = await common.getMerchantDetails(id);

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Timings_Updated_Successfully", component: {} }, {
                merchant: merchant
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateMerchantImages: async (req, res) => {
        try {
            const { id, image_url } = req.body;

            const [merchantExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
                [id]
            );
            if (merchantExist.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {});
            }

            if (!image_url || !Array.isArray(image_url) || image_url.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Image_URL_Array_Is_Required", component: {} }, {});
            }

            await db.query(
                "DELETE FROM tbl_merchant_media WHERE merchant_id = ?",
                [id]
            );

            const mediaArray = Array.isArray(image_url) ? image_url : [image_url];

            for (const img of mediaArray) {
                const [addMedia] = await db.query(
                    `INSERT INTO tbl_merchant_media (merchant_id, media_url) VALUES(?, ?)`,
                    [id, img]
                );

                if (addMedia.affectedRows === 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Update_Images", component: {} }, {});
                }
            }

            let merchant = await common.getMerchantDetails(id);

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Images_Updated_Successfully", component: {} }, {
                merchant: merchant
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    updateMerchantAmenities: async (req, res) => {
        try {
            const { id } = req.params;
            const { amenities_id } = req.body;

            const [merchantExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
                [id]
            );
            if (merchantExist.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {});
            }

            if (!amenities_id || !Array.isArray(amenities_id) || amenities_id.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Amenities_ID_Array_Is_Required", component: {} }, {});
            }

            const amenitiesArray = Array.isArray(amenities_id) ? amenities_id : [amenities_id];
            const [amenitiesExist] = await db.query(
                `SELECT id FROM tbl_amenities WHERE id IN (?) AND is_delete = 0 AND is_active = 1`,
                [amenitiesArray]
            );
            if (amenitiesExist.length !== amenitiesArray.length) {
                return sendResponse(req, res, 200, 3, { keyword: "One_Or_More_Amenities_Not_Found", component: {} }, {});
            }

            await db.query(
                "DELETE FROM tbl_merchant_amenities WHERE merchant_id = ?",
                [id]
            );

            for (const amenityId of amenitiesArray) {
                const [addAmenity] = await db.query(
                    `INSERT INTO tbl_merchant_amenities (merchant_id, amenity_id) VALUES(?, ?)`,
                    [id, amenityId]
                );

                if (addAmenity.affectedRows === 0) {
                    return sendResponse(req, res, 200, 0, { keyword: "Failed_To_Update_Amenities", component: {} }, {});
                }
            }

            let merchant = await common.getMerchantDetails(id);

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Amenities_Updated_Successfully", component: {} }, {
                merchant: merchant
            });

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    deleteMerchant: async (req, res) => {
        try {
            const { merchant_id } = req.body;

            const [merchantExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
                [merchant_id]
            );

            if (merchantExist.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {});
            }

            await db.query(
                "UPDATE tbl_merchants SET is_delete = 1, is_active = 0 WHERE id = ?",
                [merchant_id]
            );

            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Deleted_Successfully", component: {} }, {});

        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, {});
        }
    },

    fetchRating: async (req, res) => {
        try {
            const merchant_id = req.body.merchant_id;

            const [is_merchantExist] = await db.query("SELECT id from tbl_merchants where id=?", [merchant_id]);
            if (!is_merchantExist[0]) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Merchant_Data_Found", component: {} }, {});
            }
            const [ratingReviewsData] = await db.query(
                `SELECT
                    r.id, r.rating, r.comment, r.created_at,
                    JSON_OBJECT( 
                        'id', u.id,
                        'first_name', u.first_name,
                        'last_name', u.last_name,
                        'profile_image', u.profile_image
                    ) as user
                FROM tbl_merchant_rating r
                JOIN tbl_user u ON u.id = r.user_id
                WHERE r.merchant_id = ?`,
                [merchant_id]
            );
            if (ratingReviewsData[0]) {
                return sendResponse(req, res, 200, 1, { keyword: "Merchant_Rating_And_Reviews_Fetched_Successfully", component: {} }, { ratingReviews: ratingReviewsData });
            }
            return sendResponse(req, res, 200, 3, { keyword: "No_Rating_And_Review_Data_Found_For_This_Merchant", component: {} }, {});
        }
        catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Error_During_Fetching_Merchant_Rating_And_Reviews", component: {} }, { err });
        }
    }
};

// ==================== VOUCHER MANAGEMENT ====================

const voucherManagement = {
    createVoucher: async (req, res) => {
        try {
            const { merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount } = req.body;

            const [isVoucherCodeExist] = await db.query("SELECT id from tbl_voucher where voucher_code=? and merchant_id=?", [voucher_code, merchant_id]);
            if (isVoucherCodeExist && isVoucherCodeExist[0]) {
                return sendResponse(req, res, 200, 0, { keyword: "Voucher_Code_Already_Exist_For_This_Merchant", component: {} }, {});
            }

            const [result] = await db.query("INSERT INTO tbl_voucher(merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image, discount_type, discount_amount) values (?,?,?,?,?,?,?,?)", [merchant_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount]);
            if (result && result.affectedRows > 0) {
                const voucherId = result.insertId;

                const [fetchData] = await db.query(`SELECT * FROM tbl_voucher WHERE id = ?`, [voucherId]);

                const [merchantData] = await db.query("SELECT lat, log, merchant_name FROM tbl_merchants WHERE id = ? AND is_active = 1 AND is_delete = 0", [merchant_id]);
                if (merchantData && merchantData[0] && merchantData[0].lat && merchantData[0].log) {
                    const merchantLat = merchantData[0].lat;
                    const merchantLog = merchantData[0].log;
                    const merchantName = merchantData[0].merchant_name;
                    console.log(merchantLat, merchantLog);

                    const [nearbyUsers] = await db.query(`
                        SELECT id FROM tbl_user 
                        WHERE is_active = 1 AND is_delete = 0 
                        AND lat IS NOT NULL AND log IS NOT NULL
                        AND (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(log) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= 10
                    `, [merchantLat, merchantLog, merchantLat]);

                    if (nearbyUsers && nearbyUsers.length > 0) {
                        const title = "New Voucher Available!";
                        const description = `${merchantName} has added a new voucher: ${voucher_name}`;

                        for (const user of nearbyUsers) {
                            await addNotification(title, description, merchant_id, 'merchant', user.id, 'user');
                        }
                    }
                }

                return sendResponse(req, res, 200, 1, { keyword: "Voucher_Created_Successfully", component: {} }, { voucherData: fetchData });
            }

            return sendResponse(req, res, 200, 0, { keyword: "Error_During_Creating_Voucher", component: {} }, {});
        }
        catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err });
        }
    },

    fetchVoucherList: async (req, res) => {
        try {
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
                adminId,
                trimmedField,
                likeField,
                likeField,
                likeField,
                offset,
                size
            ]);

            if (result && result.length > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Voucher_List_Fetched_Successfully", component: {} }, {
                    vouchers: result,
                    currentPage: page,
                    pageSize: size
                });  
            }

            return sendResponse(req, res, 200, 0, { keyword: "No_Voucher_Data_Found", component: {} }, { vouchers: [] });

        } catch (err) {
            console.error("SQL Error:", err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error: err.message });
        }
    },

    updateVoucher: async (req, res) => {
        try {
            const { voucher_id, voucher_name, voucher_description, voucher_code, expiry_date, image_path, discount_type, discount_amount } = req.body;
            const adminId = req.loginUser.id;

            const [isVoucherExist] = await db.query(
                `SELECT v.id FROM tbl_voucher v
                INNER JOIN tbl_merchants m ON m.id = v.merchant_id
                WHERE v.id = ? AND m.admin_id = ? AND v.is_active = 1 AND v.is_delete = 0`,
                [voucher_id, adminId]
            );
            if (!isVoucherExist || isVoucherExist.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Voucher_Not_Found", component: {} }, {});
            }

            if (voucher_code) {
                const [isVoucherCodeExist] = await db.query(
                    `SELECT id FROM tbl_voucher WHERE voucher_code = ? AND id != ? AND is_active = 1 AND is_delete = 0`,
                    [voucher_code, voucher_id]
                );
                if (isVoucherCodeExist && isVoucherCodeExist[0]) {
                    return sendResponse(req, res, 200, 0, { keyword: "Voucher_Code_Already_Exist", component: {} }, {});
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
            );
            if (result && result.affectedRows > 0) {
                const [fetchData] = await db.query(`SELECT * FROM tbl_voucher WHERE id = ?`, [voucher_id]);
                return sendResponse(req, res, 200, 1, { keyword: "Voucher_Updated_Successfully", component: {} }, { voucherData: fetchData });
            }

            return sendResponse(req, res, 200, 0, { keyword: "Error_During_Updating_Voucher", component: {} }, {});
        }
        catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err });
        }
    },

    deleteVoucher: async (req, res) => {
        try {
            const { voucher_id } = req.body;
            const adminId = req.loginUser.id;

            const [isVoucherExist] = await db.query(
                `SELECT v.id FROM tbl_voucher v
                INNER JOIN tbl_merchants m ON m.id = v.merchant_id
                WHERE v.id = ? AND m.admin_id = ? AND v.is_active = 1 AND v.is_delete = 0`,
                [voucher_id, adminId]
            );
            if (!isVoucherExist || isVoucherExist.length === 0) {
                return sendResponse(req, res, 200, 0, { keyword: "Voucher_Not_Found", component: {} }, {});
            }

            const [result] = await db.query(
                `UPDATE tbl_voucher SET is_active = 0, is_delete = 1, updated_at = NOW() WHERE id = ?`,
                [voucher_id]
            );
            if (result && result.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, { keyword: "Voucher_Deleted_Successfully", component: {} }, {});
            }

            return sendResponse(req, res, 200, 0, { keyword: "Error_During_Deleting_Voucher", component: {} }, {});
        }
        catch (err) {
            console.log(err);
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err });
        }
    }
};

// ==================== CONTACT MANAGEMENT ====================

const contactManagement = {
    fetchContactUs: async (req, res) => {
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

            return sendResponse(req, res, 200, 1, { keyword: "Contact_Messages_Fetched_Successfully", component: {} }, {
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
            return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
        }
    }
};

module.exports = {
    // Admin Management
    createAdmin: adminManagement.createAdmin,
    updateAdmin: adminManagement.updateAdmin,
    deleteAdmin: adminManagement.deleteAdmin,
    getAdminList: adminManagement.getAdminList,

    // Interest Management
    addAdminInterets: interestManagement.addInterest,
    getInterest: interestManagement.getInterest,

    // User Management
    fetchUsers: userManagement.fetchUsers,
    lockUser: userManagement.lockUser,
    deleteUser: userManagement.deleteUser,

    // Category Management
    addCategory: categoryManagement.addCategory,
    getAllCategories: categoryManagement.getAllCategories,
    updateCategory: categoryManagement.updateCategory,
    deleteCategory: categoryManagement.deleteCategory,

    // Amenities Management
    addAdminAminities: amenitiesManagement.addAmenities,
    getAllAminities: amenitiesManagement.getAllAmenities,
    deleteAminities: amenitiesManagement.deleteAmenities,
    updateAminities: amenitiesManagement.updateAmenities,

    // Merchant Management
    addMerchant: merchantManagement.addMerchant,
    getMerchantList: merchantManagement.getMerchantList,
    updateMerchantBasic: merchantManagement.updateMerchantBasic,
    updateMerchantTimings: merchantManagement.updateMerchantTimings,
    updateMerchantImages: merchantManagement.updateMerchantImages,
    updateMerchantAmenities: merchantManagement.updateMerchantAmenities,
    deleteMerchant: merchantManagement.deleteMerchant,
    fetchRating: merchantManagement.fetchRating,

    // Voucher Management
    createVoucher: voucherManagement.createVoucher,
    fetchVoucherList: voucherManagement.fetchVoucherList,
    updateVoucher: voucherManagement.updateVoucher,
    deleteVoucher: voucherManagement.deleteVoucher,
    
    fetchContactUs: contactManagement.fetchContactUs,
};