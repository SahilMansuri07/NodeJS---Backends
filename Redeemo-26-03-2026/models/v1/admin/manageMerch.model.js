const db = require("../../../config/database");
const { sendResponse } = require("../../../utils/middelware");
const { common } = require("../../../utils/common");


// ─── ADD MERCHANT ─────────────────────────────────────────────────────────────
const addMerchant = async (req, res) => {
    try {
        const {
            merchant_name, logo_image, cover_image,
            lat, log, address, email, country_code,
            mobile_number, about_description, category_id, 
            amenities_id , image_url , times = []
        } = req.body;

        const admin_id = req.loginUser.id;

        // Check if merchant with same email already exists
        if (email) {
            const [emailExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE email = ? AND is_delete = 0",
                [email]
            );
            if (emailExist.length > 0) {
                return sendResponse(req, res, 200, 0, "Merchant With This Email Already Exists", {});
            }
        }

        // Check if merchant with same mobile already exists
        if (country_code && mobile_number) {
            const [mobileExist] = await db.query(
                "SELECT id FROM tbl_merchants WHERE country_code = ? AND mobile_number = ? AND is_delete = 0",
                [country_code, mobile_number]
            );
            if (mobileExist.length > 0) {
                return sendResponse(req, res, 200, 0, "Merchant With This Mobile Number Already Exists", {});
            }
        }

        // Check category exists
        if (category_id) {
            const [categoryExist] = await db.query(
                "SELECT id FROM tbl_categories WHERE id = ? AND is_delete = 0 AND is_active = 1",
                [category_id]
            );
            if (categoryExist.length === 0) {
                return sendResponse(req, res, 200, 3, "Category Not Found", {});
            }
        }

        // Validate amenities_id if provided
        if (amenities_id && amenities_id.length > 0) {
            const amenitiesArray = Array.isArray(amenities_id) ? amenities_id : [amenities_id];
            const [amenitiesExist] = await db.query(
                `SELECT id FROM tbl_amenities WHERE id IN (?) AND is_delete = 0 AND is_active = 1`,
                [amenitiesArray]
            );
            if (amenitiesExist.length !== amenitiesArray.length) {
                return sendResponse(req, res, 200, 3, "One Or More Amenities Not Found", {});
            }
        }

        // Insert merchant
        const [insertData] = await db.query(
            `INSERT INTO tbl_merchants 
            (admin_id, merchant_name, logo_image, cover_image, lat, log, address, email, country_code, mobile_number, about_description, category_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [admin_id, merchant_name, logo_image, cover_image, lat, log, address, email, country_code, mobile_number, about_description, category_id]
        );

        if (insertData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Failed To Add Merchant", {});
        }
        
        const merchantId = insertData.insertId;
        
        // Add amenities if provided
        if (amenities_id && amenities_id.length > 0) {
            const amenityResult = await addAmenities(req, res, merchantId, amenities_id);
            if (amenityResult === "error") {
                return; // Response already sent inside addAmenities
            }
        }

        if (image_url && image_url.length > 0) {
            const mediaArray = Array.isArray(image_url) ? image_url : [image_url];
            
            for(const image_url of mediaArray){
               
                // Insert amenity
                const [addMedia] = await db.query(
                    `INSERT INTO tbl_merchant_media (merchant_id, media_url) VALUES(?, ?)`,
                    [merchantId, image_url]
                );

                if (addMedia.affectedRows === 0) {
                    sendResponse(req, res, 200, 0, `Failed To Add Images `, {});
                    return "error";
                }
            }
        }

        if(times){
            for (const time of times){
                  const [addTiming] = await db.query(
                    `INSERT INTO tbl_merchant_timing (merchant_id, start_time , end_time , day , is_opened) VALUES(?, ? , ? , ? , ?)`,
                    [merchantId, time.start_time ,time.end_time ,time.day , time.is_opened]
                );

                if (addTiming.affectedRows === 0) {
                    sendResponse(req, res, 200, 0, `Failed To Add Timing `, {});
                    return "error";
                }
            }
        }


       let merchant = await common.getMerchantDetails(merchantId)
            console.log(merchant)
            if(!merchant){
                return sendResponse(req, res, 200, 3, "No Merchants Found", {});
            }

        return sendResponse(req, res, 200, 1, "Merchant Added Successfully", {
            merchant: merchant,
            // amenities: addedAmenities,
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


// ─── ADD AMENITIES ────────────────────────────────────────────────────────────
const addAmenities = async (req, res, merchant_id, amenities_id) => {
    try {
        // Ensure it's always an array
        const amenitiesArray = Array.isArray(amenities_id) ? amenities_id : [amenities_id];

        for (const amenity_id of amenitiesArray) {

            // Check if already exists
            const [exist] = await db.query(
                `SELECT * FROM tbl_merchant_amenities WHERE merchant_id = ? AND amenity_id = ? AND is_active = 1`,
                [merchant_id, amenity_id]
            );

            if (exist.length > 0) continue; // Skip duplicate, move to next

            // Insert amenity
            const [addAmenity] = await db.query(
                `INSERT INTO tbl_merchant_amenities (merchant_id, amenity_id) VALUES(?, ?)`,
                [merchant_id, amenity_id]
            );

            if (addAmenity.affectedRows === 0) {
                sendResponse(req, res, 200, 0, `Failed To Add Amenity ID: ${amenity_id}`, {});
                return "error";
            }
        }

        return null;

    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, 0, "Internal Server Error", {});
        return "error";
    }
};

// GET MERCHANT LIST 
const getMerchantList = async (req, res) => {
    try {
        const admin_id = req.loginUser.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let result = await common.getMerchantDetails(null, admin_id, page, limit);
        // console.log(result);

        if (!result || result.data.length === 0) {
            return sendResponse(req, res, 200, 3, "No Merchants Found", {});
        }

        return sendResponse(req, res, 200, 1, "Merchant Fetched Successfully", {
            merchants: result.data,
            total: result.total,
            page: page,
            limit: limit
        });
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


const updateMerchantBasic = async (req, res) => {
    try {
        const {
            id ,
            merchant_name, email, country_code,
            mobile_number, about_description, category_id ,
             lat, log, address ,
             logo_image, cover_image
        } = req.body;

        // Check merchant exists
        const [merchantExist] = await db.query(
            "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
            [id]
        );
        if (merchantExist.length === 0) {
            return sendResponse(req, res, 200, 3, "Merchant Not Found", {});
        }

        // Build dynamic update query
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
            return sendResponse(req, res, 200, 0, "No Fields To Update", {});
        }

        values.push(id);
        const [updateData] = await db.query(
            `UPDATE tbl_merchants SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (updateData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Failed To Update Merchant", {});
        }

        let merchant = await common.getMerchantDetails(id);

        return sendResponse(req, res, 200, 1, "Merchant Basic Info Updated Successfully", {
            merchant: merchant
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

// ============ 4. UPDATE TIMINGS ONLY (tbl_merchant_timing) ============
const updateMerchantTimings = async (req, res) => {
    try {
    
        const { id , times } = req.body;

        // Check merchant exists
        const [merchantExist] = await db.query(
            "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
            [id]
        );
        if (merchantExist.length === 0) {
            return sendResponse(req, res, 200, 3, "Merchant Not Found", {});
        }

        if (!times || !Array.isArray(times) || times.length === 0) {
            return sendResponse(req, res, 200, 0, "Times Array Is Required", {});
        }

        // Delete old timings
        await db.query(
            "DELETE FROM tbl_merchant_timing WHERE merchant_id = ?",
            [id]
        );

        // Insert new timings
        for (const time of times) {
            const [addTiming] = await db.query(
                `INSERT INTO tbl_merchant_timing (merchant_id, start_time, end_time, day, is_opened) VALUES(?, ?, ?, ?, ?)`,
                [id, time.start_time, time.end_time, time.day, time.is_opened]
            );

            if (addTiming.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, "Failed To Update Timing", {});
            }
        }

        let merchant = await common.getMerchantDetails(id);

        return sendResponse(req, res, 200, 1, "Merchant Timings Updated Successfully", {
            merchant: merchant
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


// ============ 5. UPDATE IMAGES ONLY (tbl_merchant_media) ============
const updateMerchantImages = async (req, res) => {
    try {
        const {id , image_url } = req.body;

        // Check merchant exists
        const [merchantExist] = await db.query(
            "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
            [id]
        );
        if (merchantExist.length === 0) {
            return sendResponse(req, res, 200, 3, "Merchant Not Found", {});
        }

        if (!image_url || !Array.isArray(image_url) || image_url.length === 0) {
            return sendResponse(req, res, 200, 0, "Image URL Array Is Required", {});
        }

        // Delete old images
        await db.query(
            "DELETE FROM tbl_merchant_media WHERE merchant_id = ?",
            [id]
        );

        // Insert new images
        const mediaArray = Array.isArray(image_url) ? image_url : [image_url];
        
        for (const img of mediaArray) {
            const [addMedia] = await db.query(
                `INSERT INTO tbl_merchant_media (merchant_id, media_url) VALUES(?, ?)`,
                [id, img]
            );

            if (addMedia.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, "Failed To Update Images", {});
            }
        }

        let merchant = await common.getMerchantDetails(id);

        return sendResponse(req, res, 200, 1, "Merchant Images Updated Successfully", {
            merchant: merchant
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

// ============ 6. UPDATE AMENITIES ONLY (tbl_merchant_amenities) ============
const updateMerchantAmenities = async (req, res) => {
    try {
        const { id } = req.params;
        const { amenities_id } = req.body;

        // Check merchant exists
        const [merchantExist] = await db.query(
            "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
            [id]
        );
        if (merchantExist.length === 0) {
            return sendResponse(req, res, 200, 3, "Merchant Not Found", {});
        }

        if (!amenities_id || !Array.isArray(amenities_id) || amenities_id.length === 0) {
            return sendResponse(req, res, 200, 0, "Amenities ID Array Is Required", {});
        }

        // Validate amenities exist
        const amenitiesArray = Array.isArray(amenities_id) ? amenities_id : [amenities_id];
        const [amenitiesExist] = await db.query(
            `SELECT id FROM tbl_amenities WHERE id IN (?) AND is_delete = 0 AND is_active = 1`,
            [amenitiesArray]
        );
        if (amenitiesExist.length !== amenitiesArray.length) {
            return sendResponse(req, res, 200, 3, "One Or More Amenities Not Found", {});
        }

        // Delete old amenities
        await db.query(
            "DELETE FROM tbl_merchant_amenities WHERE merchant_id = ?",
            [id]
        );

        // Insert new amenities
        for (const amenityId of amenitiesArray) {
            const [addAmenity] = await db.query(
                `INSERT INTO tbl_merchant_amenities (merchant_id, amenity_id) VALUES(?, ?)`,
                [id, amenityId]
            );

            if (addAmenity.affectedRows === 0) {
                return sendResponse(req, res, 200, 0, "Failed To Update Amenities", {});
            }
        }

        let merchant = await common.getMerchantDetails(id);

        return sendResponse(req, res, 200, 1, "Merchant Amenities Updated Successfully", {
            merchant: merchant
        });

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


// ─── DELETE MERCHANT ──────────────────────────────────────────────────────────
const deleteMerchant = async (req, res) => {
    try {
        const { merchant_id } = req.body;

        const [merchantExist] = await db.query(
            "SELECT id FROM tbl_merchants WHERE id = ? AND is_delete = 0",
            [merchant_id]
        );

        if (merchantExist.length === 0) {
            return sendResponse(req, res, 200, 3, "Merchant Not Found", {});
        }

        await db.query(
            "UPDATE tbl_merchants SET is_delete = 1, is_active = 0 WHERE id = ?",
            [merchant_id]
        );

        return sendResponse(req, res, 200, 1, "Merchant Deleted Successfully", {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};

//fetch rating
const fetchRating = async (req, res) => {
    try {
        const merchant_id = req.body.merchant_id;
 
        const [is_merchantExist] = await db.query("SELECT id from tbl_merchants where id=?", [merchant_id])
        if (!is_merchantExist[0]) {
            return sendResponse(req, res, 200, 3, "No Merchant Data Found", {})
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
        )
        if (ratingReviewsData[0]) {
            return sendResponse(req, res, 200, 1, "Merchant Rating and Reviews Fetched Successfully", { ratingReviews: ratingReviewsData })
        }
        return sendResponse(req, res, 200, 3, "No Rating and Review Data Found for this Merchant", {})
    }
    catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Fetching Merchant Rating and Reviews", { err })
     }  
}

module.exports = {
    addMerchant,
    deleteMerchant,
    getMerchantList,
    updateMerchantBasic ,
    updateMerchantTimings ,
    updateMerchantAmenities ,
    fetchRating
};