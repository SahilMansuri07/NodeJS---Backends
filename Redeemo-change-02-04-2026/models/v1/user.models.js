const db = require("../../config/database")
const { common } = require("../../utils/common")
const { sendResponse } = require("../../utils/middelware")

const getUser = async (req, res) => {
    try {
        const user_id = req.loginUser.id

        const [userData] = await db.query(`SELECT profile_image , CONCAT(first_name, ' ', last_name) as Full_Name , address , lat , log FROM tbl_user WHERE id = ? AND is_active = 1 AND is_locked = 0`, [user_id])
        if (userData && userData.length > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "User_Details_Fetch", component: {} }, { userData })
        }
        return sendResponse(req, res, 200, 3, { keyword: "User_Not_Found", component: {} }, {})
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}


const updateLocation = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { lat, log } = req.body
        const is_userExist = await common.getUser(user_id);
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {});
        }

        const [updateLocation] = await db.query("UPDATE tbl_user SET lat = ? , log = ? WHERE id = ? ", [lat, log, user_id])
        if (updateLocation && updateLocation.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "User_Location_Updated_Successfully", component: {} }, {})
        }
        return sendResponse(req, res, 200, 0, { keyword: "Please_Provide_Correct_Location", component: {} }, {})

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err })
    }
}


const addContactUs = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { subject, message } = req.body

        const [result] = await db.query(
            "INSERT INTO tbl_contact_us (user_id, subject, message, is_active, is_delete, created_at, updated_at) VALUES (?, ?, ?, 1, 0, NOW(), NOW())",
            [user_id, subject, message]
        )

        if (result && result.affectedRows === 1) {
            return sendResponse(req, res, 200, 1, { keyword: "Contact_Message_Submitted_Successfully", component: {} }, {
                id: result.insertId,
                user_id,
                subject,
                message
            })
        }

        return sendResponse(req, res, 500, 0, { keyword: "Failed_To_Submit_Contact_Message", component: {} }, {})
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}


// Nearest Vouchers
const nearestVouchers = async (req, res) => {
    try {
        const user_id = req.loginUser.user_id;

        const is_userExist = await common.getUser(user_id);
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {});
        }
        const [vouchers] = await db.query(
            `SELECT 
    v.id,
    v.voucher_name,
    v.voucher_description,
    v.discount_amount,
    v.discount_type,
    v.voucher_code,
    v.expiry_date,
    m.merchant_name AS merchant_name,
    m.lat,
    m.log,
    v.image,
    (
        6371 * ACOS(
            COS(RADIANS(23.15445450)) * COS(RADIANS(m.lat)) * 
            COS(RADIANS(m.log) - RADIANS(72.31546510)) +
            SIN(RADIANS(23.15445450)) * SIN(RADIANS(m.lat))
        )
    ) AS distance_km
FROM tbl_voucher v
JOIN tbl_merchants m ON m.id = v.merchant_id
ORDER BY distance_km ASC
limit 3;
    `, [is_userExist[0].lat, is_userExist[0].log, is_userExist[0].lat]
        );

        if (vouchers && vouchers.length > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Nearest_Voucher_Fetched", component: {} }, { vouchers });
        }
        return sendResponse(req, res, 200, 1, { keyword: "Vouchers_Not_Found", component: {} }, {});
    } catch (error) {
        console.error(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error });
    }
};

// Fetch Categories
const fetchCategories = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM tbl_categories WHERE is_active = 1 and is_delete = 0");
        if (categories.length === 0) {
            return sendResponse(req, res, 404, 0, { keyword: "No_Categories_Found", component: {} }, {});
        }
        let count = categories.length
        return sendResponse(req, res, 200, 1, { keyword: "Categories_Fetched_Successfully", component: {} }, { "Records Found": count, categories });
    } catch (error) {
        console.error(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error });
    }
};

// Fetch Trending Merchants
const nearestVouchersMerchants = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const user = await common.getUser(user_id)
        const [merchants] = await db.query(
            `SELECT m.id, m.cover_image, m.logo_image, m.merchant_name, m.address, avg(mr.rating) rating, (
    6371 * acos(
        cos(radians(?)) * cos(radians(m.lat)) * cos(radians(m.log) - radians(?))
        + sin(radians(?)) * sin(radians(m.lat))
    )
) AS distance_km
FROM tbl_merchants m
left join tbl_merchant_rating mr on m.id=mr.merchant_id
where m.is_active=1 and m.is_delete=0
GROUP By mr.merchant_id
order by distance_km asc
`, [user[0].lat, user[0].log, user[0].lat])
        if (merchants[0]) {
            return sendResponse(req, res, 200, 1, { keyword: "Trending_Merchants_Fetched_Successfully", component: {} }, merchants);
        }
        return sendResponse(req, res, 404, 0, { keyword: "No_Trending_Merchants_Found", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error });
    }
};


const fetchNearByMerchCategory = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const user = await common.getUser(user_id)

        const [Caterymerchants] = await db.query(
            `
    SELECT 
    m.id AS merchant_id,
    m.merchant_name,  
    m.logo_image,
    m.cover_image,
    m.address,
    m.lat,
    m.log,
    c.id AS category_id,
    c.name AS category_name,
    ROUND(
        (
            6371 * ACOS(
                LEAST(1, GREATEST(-1,
                    COS(RADIANS(?)) * COS(RADIANS(m.lat)) *
                    COS(RADIANS(m.log) - RADIANS(?)) +
                    SIN(RADIANS(?)) * SIN(RADIANS(m.lat))
                ))
            )
        ), 2
    ) AS distance_km,
    ROUND(AVG(r.rating), 1) AS avg_rating,
    COUNT(r.id) AS total_reviews
FROM tbl_merchants m
LEFT JOIN tbl_categories c 
    ON c.id = m.category_id
LEFT JOIN tbl_merchant_rating r 
    ON r.merchant_id = m.id 
    AND r.is_active = 1 
    AND r.is_delete = 0
WHERE 
    m.is_active = 1
    AND m.is_delete = 0
    AND m.lat IS NOT NULL
    AND m.log IS NOT NULL
GROUP BY 
    m.id,
    m.merchant_name,
    m.logo_image,
    m.cover_image,
    m.address,
    m.lat,
    m.log,
    c.id,
    c.name
ORDER BY 
    c.name ASC,
    distance_km ASC;
`, [user[0].lat, user[0].log, user[0].lat])
        if (Caterymerchants[0]) {
            return sendResponse(req, res, 200, 1, { keyword: "Category_Wise_Trending_Merchants", component: {} }, Caterymerchants);
        }
        return sendResponse(req, res, 404, 0, { keyword: "No_Merchants_Found", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error });
    }
}


const fetchAllNearByMerch = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const user = await common.getUser(user_id)

        const [merchants] = await db.query(
            `
    SELECT 
    m.id,
    m.merchant_name,
    m.logo_image,
    m.cover_image,
    m.address,
    c.name AS category_name,
    ROUND(
        (
            6371 * ACOS(
                LEAST(1, GREATEST(-1,
                    COS(RADIANS(?)) * COS(RADIANS(m.lat)) *
                    COS(RADIANS(m.log) - RADIANS(?)) +
                    SIN(RADIANS(?)) * SIN(RADIANS(m.lat))
                ))
            )
        ), 2
    ) AS distance_km,
    ROUND(IFNULL(AVG(r.rating), 0), 1) AS avg_rating,
    COUNT(r.id) AS total_reviews,
    CASE 
        WHEN mf.id IS NOT NULL THEN 1
        ELSE 0
    END AS is_favourite
FROM tbl_merchants m
LEFT JOIN tbl_categories c 
    ON c.id = m.category_id
LEFT JOIN tbl_merchant_rating r 
    ON r.merchant_id = m.id
    AND r.is_active = 1
    AND r.is_delete = 0
LEFT JOIN tbl_merchant_favourite mf
    ON mf.merchant_id = m.id
    AND mf.user_id = ?
    AND mf.is_active = 1
    AND mf.is_delete = 0
WHERE 
    m.is_active = 1
    AND m.is_delete = 0
    AND m.lat IS NOT NULL
    AND m.log IS NOT NULL
GROUP BY 
    m.id,
    m.merchant_name,
    m.logo_image,
    m.cover_image,
    m.address,
    m.lat,
    m.log,
    c.name,
    mf.id
ORDER BY distance_km ASC;
        `, [user[0].lat, user[0].log, user[0].lat, user_id])
        if (merchants[0]) {
            return sendResponse(req, res, 200, 1, { keyword: "NearBy_Merchants", component: {} }, merchants);
        }
        return sendResponse(req, res, 404, 0, { keyword: "No_Merchants_Found", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error });
    }
}

// Toggle Favourite Merchant
const toggleFavouriteMerchant = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { merchant_id } = req.body

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [merchant] = await db.query(
            `SELECT id FROM tbl_merchants WHERE id = ? AND is_active = 1 AND is_delete = 0`,
            [merchant_id]
        )
        if (!merchant || merchant.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {})
        }

        const [existing] = await db.query(
            `SELECT * FROM tbl_merchant_favourite WHERE merchant_id = ? AND user_id = ?`,
            [merchant_id, user_id]
        )

        if (existing.length === 0) {
            await db.query(
                `INSERT INTO tbl_merchant_favourite (merchant_id, user_id, is_active, is_delete, created_at, updated_at) VALUES (?, ?, 1, 0, NOW(), NOW())`,
                [merchant_id, user_id]
            )
            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Added_To_Favourite", component: {} }, { is_favourite: 1 })
        }

        if (existing[0].is_delete === 1 || existing[0].is_active === 0) {
            await db.query(
                `UPDATE tbl_merchant_favourite SET is_active = 1, is_delete = 0, updated_at = NOW() WHERE merchant_id = ? AND user_id = ?`,
                [merchant_id, user_id]
            )
            return sendResponse(req, res, 200, 1, { keyword: "Merchant_Added_To_Favourite", component: {} }, { is_favourite: 1 })
        }

        await db.query(
            `UPDATE tbl_merchant_favourite SET is_active = 0, is_delete = 1, updated_at = NOW() WHERE merchant_id = ? AND user_id = ?`,
            [merchant_id, user_id]
        )
        return sendResponse(req, res, 200, 1, { keyword: "Merchant_Removed_From_Favourite", component: {} }, { is_favourite: 0 })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Toggle Favourite Voucher
const toggleFavouriteVoucher = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { voucher_id } = req.body

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [voucher] = await db.query(
            `SELECT id FROM tbl_voucher WHERE id = ? AND is_active = 1 AND is_delete = 0`,
            [voucher_id]
        )
        if (!voucher || voucher.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "Voucher_Not_Found", component: {} }, {})
        }

        const [existing] = await db.query(
            `SELECT * FROM tbl_voucher_favourite WHERE voucher_id = ? AND user_id = ?`,
            [voucher_id, user_id]
        )

        if (existing.length === 0) {
            await db.query(
                `INSERT INTO tbl_voucher_favourite (voucher_id, user_id, is_active, is_delete, created_at, updated_at) VALUES (?, ?, 1, 0, NOW(), NOW())`,
                [voucher_id, user_id]
            )
            return sendResponse(req, res, 200, 1, { keyword: "Voucher_Added_To_Favourite", component: {} }, { is_favourite: 1 })
        }

        if (existing[0].is_delete === 1 || existing[0].is_active === 0) {
            await db.query(
                `UPDATE tbl_voucher_favourite SET is_active = 1, is_delete = 0, updated_at = NOW() WHERE voucher_id = ? AND user_id = ?`,
                [voucher_id, user_id]
            )
            return sendResponse(req, res, 200, 1, { keyword: "Voucher_Added_To_Favourite", component: {} }, { is_favourite: 1 })
        }

        await db.query(
            `UPDATE tbl_voucher_favourite SET is_active = 0, is_delete = 1, updated_at = NOW() WHERE voucher_id = ? AND user_id = ?`,
            [voucher_id, user_id]
        )
        return sendResponse(req, res, 200, 1, { keyword: "Voucher_Removed_From_Favourite", component: {} }, { is_favourite: 0 })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Fetch Voucher Details
const fetchVoucherDetails = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { voucher_id } = req.body

        if (!voucher_id) {
            return sendResponse(req, res, 400, 2, { keyword: "Voucher_ID_Is_Required", component: {} }, {})
        }

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [voucherRows] = await db.query(
            `SELECT
                v.id, v.merchant_id, v.voucher_name, v.voucher_description, v.voucher_code,
                DATE_FORMAT(v.expiry_date, '%d %b, %Y') as expiry_date,
                v.image, v.discount_type, v.discount_amount, v.is_active,
                DATE_FORMAT(v.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                DATE_FORMAT(v.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
                m.merchant_name, m.logo_image as merchant_logo, m.cover_image as merchant_cover,
                m.address as merchant_address, m.email as merchant_email,
                m.country_code as merchant_country_code, m.mobile_number as merchant_mobile,
                m.about_description as merchant_about, m.is_opened as merchant_is_opened,
                c.name as category_name, c.image as category_image
            FROM tbl_voucher v
            LEFT JOIN tbl_merchants m ON m.id = v.merchant_id
            LEFT JOIN tbl_categories c ON c.id = m.category_id
            WHERE v.id = ? AND v.is_active = 1 AND v.is_delete = 0`,
            [voucher_id]
        )

        if (!voucherRows || voucherRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "Voucher_Not_Found", component: {} }, {})
        }

        const voucher = voucherRows[0]

        const [[favouriteData]] = await db.query(
            `SELECT COUNT(*) as is_favourite FROM tbl_voucher_favourite WHERE voucher_id = ? AND user_id = ? AND is_delete = 0 AND is_active = 1`,
            [voucher_id, user_id]
        )

        const [[redeemData]] = await db.query(
            `SELECT COUNT(*) as is_redeemed FROM tbl_voucher_redeemed WHERE voucher_id = ? AND user_id = ? AND is_delete = 0 AND is_active = 1`,
            [voucher_id, user_id]
        )

        const [[totalRedeemData]] = await db.query(
            `SELECT COUNT(*) as total_redeemed FROM tbl_voucher_redeemed WHERE voucher_id = ? AND is_delete = 0 AND is_active = 1`,
            [voucher_id]
        )

        const discount_label = voucher.discount_type === 'flat'
            ? `Est. Saving $${parseFloat(voucher.discount_amount).toFixed(0)}`
            : `Est. Saving ${parseFloat(voucher.discount_amount).toFixed(0)}%`

        const voucher_title = voucher.discount_type === 'flat'
            ? `Get $${parseFloat(voucher.discount_amount).toFixed(0)} OFF on your first order`
            : `Get ${parseFloat(voucher.discount_amount).toFixed(0)}% OFF on your first order`

        const voucherData = {
            id: voucher.id,
            merchant_id: voucher.merchant_id,
            voucher_name: voucher.voucher_name,
            voucher_title,
            discount_label,
            voucher_description: voucher.voucher_description,
            voucher_code: voucher.voucher_code,
            expiry_date: voucher.expiry_date,
            image: voucher.image,
            discount_type: voucher.discount_type,
            discount_amount: parseFloat(voucher.discount_amount),
            is_active: voucher.is_active,
            created_at: voucher.created_at,
            updated_at: voucher.updated_at,
            is_favourite: favouriteData.is_favourite > 0 ? 1 : 0,
            is_redeemed: redeemData.is_redeemed > 0 ? 1 : 0,
            total_redeemed: parseInt(totalRedeemData.total_redeemed),
            merchant: {
                id: voucher.merchant_id,
                merchant_name: voucher.merchant_name,
                logo_image: voucher.merchant_logo,
                cover_image: voucher.merchant_cover,
                address: voucher.merchant_address,
                email: voucher.merchant_email,
                country_code: voucher.merchant_country_code,
                mobile_number: voucher.merchant_mobile,
                about_description: voucher.merchant_about,
                is_opened: voucher.merchant_is_opened,
                category_name: voucher.category_name,
                category_image: voucher.category_image
            },
            terms_of_use: [
                'In-House only',
                'Advance Booking',
                'Seasonal Exclusions',
                'Takeaway',
                'Offer cannot be combined with other offers',
                'Can only redeem once a month by the same user'
            ],
            offer_terms_of_service: voucher.voucher_description || ''
        }

        return sendResponse(req, res, 200, 1, { keyword: "Voucher_Details_Fetched_Successfully", component: {} }, { voucher: voucherData })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Redeem Voucher
const redeemVoucher = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { voucher_id } = req.body

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [voucher] = await db.query(
            `SELECT * FROM tbl_voucher WHERE id = ? AND is_active = 1 AND is_delete = 0 AND expiry_date >= CURDATE()`,
            [voucher_id]
        )
        if (!voucher || voucher.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "Voucher_Not_Found_Or_Expired", component: {} }, {})
        }

        const [existing] = await db.query(
            `SELECT * FROM tbl_voucher_redeemed WHERE voucher_id = ? AND user_id = ? AND is_delete = 0`,
            [voucher_id, user_id]
        )
        if (existing && existing.length > 0) {
            return sendResponse(req, res, 200, 0, { keyword: "You_Have_Already_Redeemed_This_Voucher", component: {} }, { is_redeemed: 1 })
        }

        await db.query(
            `INSERT INTO tbl_voucher_redeemed (voucher_id, user_id, is_active, is_delete, created_at, updated_at) VALUES (?, ?, 1, 0, NOW(), NOW())`,
            [voucher_id, user_id]
        )

        return sendResponse(req, res, 200, 1, { keyword: "Voucher_Redeemed_Successfully", component: {} }, {
            is_redeemed: 1,
            voucher_code: voucher[0].voucher_code
        })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Add Merchant Rating
const addMerchantRating = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { merchant_id, rating, comment } = req.body

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [merchant] = await db.query(
            `SELECT id, merchant_name, logo_image FROM tbl_merchants WHERE id = ? AND is_active = 1 AND is_delete = 0`,
            [merchant_id]
        )
        if (!merchant || merchant.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "Merchant_Not_Found", component: {} }, {})
        }

        const [existing] = await db.query(
            `SELECT * FROM tbl_merchant_rating WHERE merchant_id = ? AND user_id = ? AND is_delete = 0`,
            [merchant_id, user_id]
        )

        if (existing && existing.length > 0) {
            await db.query(
                `UPDATE tbl_merchant_rating SET rating = ?, comment = ?, updated_at = NOW() WHERE merchant_id = ? AND user_id = ? AND is_delete = 0`,
                [rating, comment || '', merchant_id, user_id]
            )
        } else {
            const [result] = await db.query(
                `INSERT INTO tbl_merchant_rating (user_id, merchant_id, rating, comment, is_active, is_delete, created_at, updated_at) VALUES (?, ?, ?, ?, 1, 0, NOW(), NOW())`,
                [user_id, merchant_id, rating, comment || '']
            )
            if (!result || result.affectedRows !== 1) {
                return sendResponse(req, res, 500, 0, { keyword: "Failed_To_Add_Rating", component: {} }, {})
            }
        }

        const [[avgData]] = await db.query(
            `SELECT COALESCE(ROUND(AVG(rating), 1), 0) as avg_rating, COUNT(*) as total_reviews FROM tbl_merchant_rating WHERE merchant_id = ? AND is_active = 1 AND is_delete = 0`,
            [merchant_id]
        )

        return sendResponse(req, res, 200, 1,
            existing.length > 0
                ? { keyword: "Rating_Updated_Successfully", component: {} }
                : { keyword: "Rating_Added_Successfully", component: {} },
            {
                merchant_id,
                merchant_name: merchant[0].merchant_name,
                merchant_logo: merchant[0].logo_image,
                user_rating: rating,
                comment: comment || '',
                avg_rating: parseFloat(avgData.avg_rating),
                total_reviews: parseInt(avgData.total_reviews)
            })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

const fetchRatingListing = async (req, res) => {
    try {
        const { merchant_id } = req.body
        const user_id = req.loginUser.id

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const [ratings] = await db.query(
            `SELECT r.id, r.user_id, u.first_name, u.last_name, r.rating, r.comment, r.created_at
            FROM tbl_merchant_rating r
            LEFT JOIN tbl_user u ON u.id = r.user_id
            WHERE r.merchant_id = ? AND r.is_active = 1 AND r.is_delete = 0
            ORDER BY r.created_at DESC`,
            [merchant_id]
        )

        if (!ratings || ratings.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Ratings_Found", component: {} }, {})
        }

        return sendResponse(req, res, 200, 1, { keyword: "Merchant_Ratings_Fetched_Successfully", component: {} }, { ratings })
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Fetch Favourites
const fetchFavourites = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { type = 'merchant', page = 1, limit = 10 } = req.body
        const offset = (parseInt(page) - 1) * parseInt(limit)

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        if (type === 'voucher') {
            const [[{ total }]] = await db.query(
                `SELECT COUNT(*) as total FROM tbl_voucher_favourite fv
                LEFT JOIN tbl_voucher v ON v.id = fv.voucher_id
                WHERE fv.user_id = ? AND fv.is_delete = 0 AND fv.is_active = 1 AND v.is_active = 1 AND v.is_delete = 0`,
                [user_id]
            )

            if (total === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Favourite_Voucher_Found", component: {} }, {})
            }

            const [vouchersRaw] = await db.query(
                `SELECT
                    fv.id as favourite_id, v.id, v.merchant_id, v.voucher_name, v.voucher_description,
                    v.voucher_code, DATE_FORMAT(v.expiry_date, '%d %b, %Y') as expiry_date,
                    v.image, v.discount_type, v.discount_amount, v.is_active,
                    DATE_FORMAT(v.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                    m.merchant_name, m.logo_image as merchant_logo, m.cover_image as merchant_cover,
                    m.address as merchant_address, m.is_opened, c.name as category_name,
                    (SELECT COUNT(*) FROM tbl_voucher_redeemed rv WHERE rv.voucher_id = v.id AND rv.user_id = ? AND rv.is_delete = 0 AND rv.is_active = 1) as is_redeemed
                FROM tbl_voucher_favourite fv
                LEFT JOIN tbl_voucher v ON v.id = fv.voucher_id
                LEFT JOIN tbl_merchants m ON m.id = v.merchant_id
                LEFT JOIN tbl_categories c ON c.id = m.category_id
                WHERE fv.user_id = ? AND fv.is_delete = 0 AND fv.is_active = 1 AND v.is_active = 1 AND v.is_delete = 0
                ORDER BY fv.id DESC LIMIT ? OFFSET ?`,
                [user_id, user_id, parseInt(limit), offset]
            )

            const vouchers = vouchersRaw.map((v) => {
                const discount_label = v.discount_type === 'flat'
                    ? `Est. Saving $${parseFloat(v.discount_amount).toFixed(0)}`
                    : `Est. Saving ${parseFloat(v.discount_amount).toFixed(0)}%`
                const voucher_title = v.discount_type === 'flat'
                    ? `Get $${parseFloat(v.discount_amount).toFixed(0)} OFF`
                    : `Get ${parseFloat(v.discount_amount).toFixed(0)}% OFF`

                return {
                    favourite_id: v.favourite_id,
                    id: v.id,
                    merchant_id: v.merchant_id,
                    voucher_name: v.voucher_name,
                    voucher_title,
                    discount_label,
                    voucher_description: v.voucher_description,
                    voucher_code: v.voucher_code,
                    expiry_date: v.expiry_date,
                    image: v.image,
                    discount_type: v.discount_type,
                    discount_amount: parseFloat(v.discount_amount),
                    is_active: v.is_active,
                    is_favourite: 1,
                    is_redeemed: v.is_redeemed > 0 ? 1 : 0,
                    created_at: v.created_at,
                    merchant: {
                        merchant_name: v.merchant_name,
                        merchant_logo: v.merchant_logo,
                        merchant_cover: v.merchant_cover,
                        merchant_address: v.merchant_address,
                        is_opened: v.is_opened,
                        category_name: v.category_name
                    }
                }
            })

            return sendResponse(req, res, 200, 1, { keyword: "Favourite_Vouchers_Fetched_Successfully", component: {} }, {
                type: 'voucher', total, page: parseInt(page), limit: parseInt(limit),
                total_pages: Math.ceil(total / parseInt(limit)), data: vouchers
            })
        }

        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) as total FROM tbl_merchant_favourite fm
            LEFT JOIN tbl_merchants m ON m.id = fm.merchant_id
            WHERE fm.user_id = ? AND fm.is_delete = 0 AND fm.is_active = 1 AND m.is_active = 1 AND m.is_delete = 0`,
            [user_id]
        )

        if (total === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Favourite_Merchant_Found", component: {} }, {})
        }

        const user = is_userExist[0]
        const userLat = user.lat ? parseFloat(user.lat) : 0
        const userLog = user.log ? parseFloat(user.log) : 0

        const [merchantsRaw] = await db.query(
            `SELECT
                fm.id as favourite_id, m.id, m.admin_id, m.merchant_name, m.logo_image, m.cover_image,
                m.lat, m.log, m.address, m.email, m.country_code, m.mobile_number, m.about_description,
                m.category_id, c.name as category_name, c.image as category_image, m.is_opened,
                DATE_FORMAT(m.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                (SELECT COALESCE(ROUND(AVG(r.rating), 1), 0) FROM tbl_merchant_rating r WHERE r.merchant_id = m.id AND r.is_active = 1 AND r.is_delete = 0) as avg_rating,
                (SELECT COUNT(*) FROM tbl_merchant_rating r WHERE r.merchant_id = m.id AND r.is_active = 1 AND r.is_delete = 0) as total_reviews,
                (6371 * ACOS(LEAST(1, GREATEST(-1, COS(RADIANS(?)) * COS(RADIANS(m.lat)) * COS(RADIANS(m.log) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(m.lat)))))) AS distance
            FROM tbl_merchant_favourite fm
            LEFT JOIN tbl_merchants m ON m.id = fm.merchant_id
            LEFT JOIN tbl_categories c ON c.id = m.category_id
            WHERE fm.user_id = ? AND fm.is_delete = 0 AND fm.is_active = 1 AND m.is_active = 1 AND m.is_delete = 0
            ORDER BY fm.id DESC LIMIT ? OFFSET ?`,
            [userLat, userLog, userLat, user_id, parseInt(limit), offset]
        )

        const merchants = merchantsRaw.map((m) => ({
            favourite_id: m.favourite_id,
            id: m.id,
            admin_id: m.admin_id,
            merchant_name: m.merchant_name,
            logo_image: m.logo_image,
            cover_image: m.cover_image,
            address: m.address,
            email: m.email,
            country_code: m.country_code,
            mobile_number: m.mobile_number,
            about_description: m.about_description,
            category_id: m.category_id,
            category_name: m.category_name,
            category_image: m.category_image,
            is_opened: m.is_opened,
            avg_rating: m.avg_rating || 0,
            total_reviews: m.total_reviews || 0,
            distance: m.distance !== null ? parseFloat(m.distance).toFixed(1) + ' km away' : '0 km away',
            is_favourite: 1,
            created_at: m.created_at
        }))

        return sendResponse(req, res, 200, 1, { keyword: "Favourite_Merchants_Fetched_Successfully", component: {} }, {
            type: 'merchant', total, page: parseInt(page), limit: parseInt(limit),
            total_pages: Math.ceil(total / parseInt(limit)), data: merchants
        })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}

// Delete rating
const deleteRating = async (req, res) => {
    try {
        const { rating_id } = req.body
        const user_id = req.loginUser.id

        if (!rating_id) {
            return sendResponse(req, res, 200, 0, { keyword: "Please_Provide_Rating_To_Delete", component: {} }, { error })
        }

        const [existing] = await db.query(`SELECT * FROM tbl_merchant_rating WHERE id = ? AND is_active = 1`, [rating_id])
        if (existing.length === 0) {
            return sendResponse(req, res, 200, 0, { keyword: "No_Rating_Data_Found", component: {} }, {})
        }

        const ratingData = existing

        const [deleteRating] = await db.query(`UPDATE tbl_merchant_rating SET is_active = 0 AND is_delete = 1 WHERE user_id = ? AND id  = ? `, [user_id, rating_id])
        if (deleteRating && deleteRating.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Rating_Deleted_Successfully", component: {} }, ratingData)
        }
        return sendResponse(req, res, 200, 1, { keyword: "You_Cannot_Delete_Other_Users_Rating", component: {} }, {})
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}


// Fetch Trending Merchants
const fetchTrendingMerchants = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { lat, log, page = 1, limit = 10, category_id, amenity_ids, min_rating, max_rating } = req.body
        const offset = (parseInt(page) - 1) * parseInt(limit)

        const is_userExist = await common.getUser(user_id)
        if (!is_userExist) {
            return sendResponse(req, res, 404, 0, { keyword: "User_Not_Found", component: {} }, {})
        }

        const user = is_userExist[0]
        const userLat = lat !== undefined ? parseFloat(lat) : (user.lat ? parseFloat(user.lat) : 0)
        const userLog = log !== undefined ? parseFloat(log) : (user.log ? parseFloat(user.log) : 0)

        let whereClause = `WHERE m.is_active = 1 AND m.is_delete = 0`
        let havingClause = ``
        let mainParams = [userLat, userLog, userLat, user_id]
        let countParams = []

        if (category_id !== undefined && category_id !== null && category_id !== '') {
            whereClause += ` AND m.category_id = ?`
            mainParams.push(parseInt(category_id))
            countParams.push(parseInt(category_id))
        }

        if (amenity_ids && Array.isArray(amenity_ids) && amenity_ids.length > 0) {
            whereClause += ` AND m.id IN (SELECT ma.merchant_id FROM tbl_merchant_amenities ma WHERE ma.amenity_id IN (${amenity_ids.map(() => '?').join(',')}) AND ma.is_delete = 0 GROUP BY ma.merchant_id HAVING COUNT(DISTINCT ma.amenity_id) = ?)`
            mainParams.push(...amenity_ids, amenity_ids.length)
            countParams.push(...amenity_ids, amenity_ids.length)
        }

        let havingConditions = []
        let countHavingConditions = []

        if (min_rating !== undefined && min_rating !== null && min_rating !== '') {
            havingConditions.push(`avg_rating >= ?`)
            countHavingConditions.push(`COALESCE(ROUND(AVG(r.rating), 1), 0) >= ?`)
            mainParams.push(parseFloat(min_rating))
            countParams.push(parseFloat(min_rating))
        }

        if (max_rating !== undefined && max_rating !== null && max_rating !== '') {
            havingConditions.push(`avg_rating <= ?`)
            countHavingConditions.push(`COALESCE(ROUND(AVG(r.rating), 1), 0) <= ?`)
            mainParams.push(parseFloat(max_rating))
            countParams.push(parseFloat(max_rating))
        }

        if (havingConditions.length > 0) havingClause = `HAVING ${havingConditions.join(' AND ')}`

        let countWhereClause = `WHERE m.is_active = 1 AND m.is_delete = 0`
        if (category_id !== undefined && category_id !== null && category_id !== '') {
            countWhereClause += ` AND m.category_id = ?`
        }
        if (amenity_ids && Array.isArray(amenity_ids) && amenity_ids.length > 0) {
            countWhereClause += ` AND m.id IN (SELECT ma.merchant_id FROM tbl_merchant_amenities ma WHERE ma.amenity_id IN (${amenity_ids.map(() => '?').join(',')}) AND ma.is_delete = 0 GROUP BY ma.merchant_id HAVING COUNT(DISTINCT ma.amenity_id) = ?)`
        }
        const countHavingClause = countHavingConditions.length > 0 ? `HAVING ${countHavingConditions.join(' AND ')}` : ''

        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) as total FROM (SELECT m.id FROM tbl_merchants m LEFT JOIN tbl_merchant_rating r ON r.merchant_id = m.id AND r.is_active = 1 AND r.is_delete = 0 ${countWhereClause} GROUP BY m.id ${countHavingClause}) as counted`,
            countParams
        )

        mainParams.push(parseInt(limit), offset)

        const [merchantsRaw] = await db.query(
            `SELECT
                m.id, m.admin_id, m.merchant_name, m.logo_image, m.cover_image, m.lat, m.log,
                m.address, m.email, m.country_code, m.mobile_number, m.about_description, m.category_id,
                c.name as category_name, c.image as category_image, m.is_opened,
                DATE_FORMAT(m.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                DATE_FORMAT(m.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at,
                COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
                COUNT(DISTINCT r.id) as total_reviews,
                (6371 * ACOS(LEAST(1, GREATEST(-1, COS(RADIANS(?)) * COS(RADIANS(m.lat)) * COS(RADIANS(m.log) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(m.lat)))))) AS distance,
                (SELECT COUNT(*) FROM tbl_merchant_favourite fm WHERE fm.merchant_id = m.id AND fm.user_id = ? AND fm.is_delete = 0 AND fm.is_active = 1) as is_favourite,
                (SELECT GROUP_CONCAT(a.name SEPARATOR ', ') FROM tbl_merchant_amenities ma LEFT JOIN tbl_amenities a ON a.id = ma.amenity_id WHERE ma.merchant_id = m.id AND ma.is_delete = 0) as amenities
            FROM tbl_merchants m
            LEFT JOIN tbl_categories c ON c.id = m.category_id
            LEFT JOIN tbl_merchant_rating r ON r.merchant_id = m.id AND r.is_active = 1 AND r.is_delete = 0
            ${whereClause}
            GROUP BY m.id
            ${havingClause}
            ORDER BY avg_rating DESC, total_reviews DESC, distance ASC
            LIMIT ? OFFSET ?`,
            mainParams
        )


        if (!merchantsRaw || merchantsRaw.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Trending_Merchant_Found", component: {} }, {})
        }
        const merchants = merchantsRaw.map((m) => ({
            id: m.id,
            admin_id: m.admin_id,
            merchant_name: m.merchant_name,
            logo_image: m.logo_image,
            cover_image: m.cover_image,
            lat: m.lat,
            log: m.log,
            address: m.address,
            email: m.email,
            country_code: m.country_code,
            mobile_number: m.mobile_number,
            about_description: m.about_description,
            category_id: m.category_id,
            category_name: m.category_name,
            category_image: m.category_image,
            is_opened: m.is_opened,
            created_at: m.created_at,
            updated_at: m.updated_at,
            avg_rating: m.avg_rating || 0,
            total_reviews: m.total_reviews || 0,
            distance: m.distance !== null ? parseFloat(m.distance).toFixed(1) + ' km' : '0 km',
            is_favourite: m.is_favourite > 0 ? 1 : 0,
            amenities: m.amenities || ''
        }))

        return sendResponse(req, res, 200, 1, { keyword: "Trending_Merchants_Fetched_Successfully", component: {} }, {
            total, page: parseInt(page), limit: parseInt(limit),
            total_pages: Math.ceil(total / parseInt(limit)),
            filters_applied: {
                category_id: category_id || null,
                amenity_ids: amenity_ids || [],
                min_rating: min_rating || null,
                max_rating: max_rating || null
            },
            merchant: merchants
        })

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { error })
    }
}


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

        return sendResponse(req, res, 200, 1, { keyword: "Notifications_Fetched_Successfully", component: {} }, {
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
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err })
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
            return sendResponse(req, res, 500, 0, { keyword: "Failed_To_Create_Notification", component: {} }, {});
        }

        return sendResponse(req, res, 200, 1, { keyword: "Notification_Created_Successfully", component: {} }, { id: insertId });
    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, { keyword: "Internal_Server_Error", component: {} }, { err });
    }
}



module.exports = {
    getUser , 
    addContactUs ,
    updateLocation ,
    nearestVouchers ,
    fetchCategories ,
    nearestVouchersMerchants ,
    fetchNearByMerchCategory ,
    fetchAllNearByMerch ,
    toggleFavouriteMerchant,
    toggleFavouriteVoucher,
    fetchVoucherDetails,
    redeemVoucher,
    addMerchantRating,
    fetchRatingListing,
    fetchFavourites,
    fetchTrendingMerchants ,
    deleteRating ,
    fetchNotification ,
    createNotification
}
