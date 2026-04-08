const db = require("../../config/database");
const { sendResponse } = require("../../utils/middleware");

const updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        if (latitude === undefined || longitude === undefined) {
            return sendResponse(req, res, 400, -1, { keyword: "Latitude_And_Longitude_Required", component: {} }, {});
        }
        await db.query(
            `UPDATE tbl_user SET latitude = ?, longitude = ? WHERE id = ?`,
            [latitude, longitude, req.loginUser.id]
        );
        return sendResponse(req, res, 200, 0, { keyword: "Location_Updated_Successfully", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const fetchcategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            `SELECT id, name, image FROM tbl_category WHERE is_active = 1 AND is_deleted = 0`
        );
        if (categories.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }
        return sendResponse(req, res, 200, 0, { keyword: "Category_List", component: {} },  categories );
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {})
    } 
}   


const getHomePageItems = async (req, res)  => {
    try {
        const {
            category_id,
            search
           
        } = req.query;

        const {
             min_price,
            max_price,
            latitude,
            longitude,
            max_distance_km
        } = req.body || {};

        const whereParams = [];
        const joinParams = [req.loginUser.id];
        const distanceParams = [];
        const havingParams = [];
        const filters = ["ri.is_active = 1", "ri.is_delete = 0"];
        const havingFilters = [];

        let refLat = latitude ? Number(latitude) : null;
        let refLng = longitude ? Number(longitude) : null;

        if ((refLat === null || refLng === null) && req.loginUser && req.loginUser.id) {
            const [userLocationRows] = await db.query(
                `SELECT latitude, longitude FROM tbl_user WHERE id = ? LIMIT 1`,
                [req.loginUser.id]
            );

            if (userLocationRows.length > 0) {
                const userLatitude = Number(userLocationRows[0].latitude);
                const userLongitude = Number(userLocationRows[0].longitude);

                if (!Number.isNaN(userLatitude) && !Number.isNaN(userLongitude)) {
                    refLat = userLatitude;
                    refLng = userLongitude;
                }
            }
        }

        const useDistance = refLat !== null && refLng !== null && !Number.isNaN(refLat) && !Number.isNaN(refLng);

        if (category_id) {
            filters.push("ri.category_id = ?");
            whereParams.push(category_id);
        }

        if (search && search.trim()) {
            filters.push("(ri.name LIKE ? OR ri.descrition LIKE ?)");
            const searchValue = `%${search.trim()}%`;
            whereParams.push(searchValue, searchValue);
        }

        if (min_price) {
            filters.push("ri.price >= ?");
            whereParams.push(Number(min_price));
        }

        if (max_price) {
            filters.push("ri.price <= ?");
            whereParams.push(Number(max_price));
        }

        let distanceSelect = "";
        if (useDistance) {
            distanceSelect = `,
                ROUND(
                    6371 * ACOS(
                        COS(RADIANS(?)) * COS(RADIANS(r.latitude))
                        * COS(RADIANS(r.longitude) - RADIANS(?))
                        + SIN(RADIANS(?)) * SIN(RADIANS(r.latitude))
                    ),
                    2
                ) AS distance_km`;
            distanceParams.push(refLat, refLng, refLat);

            if (max_distance_km) {
                havingFilters.push("distance_km <= ?");
                havingParams.push(Number(max_distance_km));
            }
        }

        const havingClause = havingFilters.length > 0 ? `HAVING ${havingFilters.join(" AND ")}` : "";
        const orderClause = useDistance
            ? "ORDER BY distance_km ASC, average_rating DESC, total_ratings DESC, ri.id DESC"
            : "ORDER BY average_rating DESC, total_ratings DESC, ri.id DESC";

        const [items] = await db.query(
            `SELECT
                ri.id,
                ri.name,
                ri.item_image AS image,
                ri.price,
                ri.category_id,
                COALESCE(ROUND(AVG(ir.rating), 1), 0) AS average_rating,
                COUNT(DISTINCT ir.id) AS total_ratings,
                MAX(CASE WHEN f.id IS NULL THEN 0 ELSE 1 END) AS is_saved${distanceSelect}
            FROM tbl_restaurant_items ri
            LEFT JOIN tbl_favorites f
                ON f.item_id = ri.id
                AND f.user_id = ?
            LEFT JOIN tbl_restaurant r
                ON r.id = ri.restorant_id
            LEFT JOIN tbl_item_rating ir
                ON ir.item_id = ri.id
                AND ir.is_active = 1
                AND ir.is_delete = 0
            WHERE ${filters.join(" AND ")}
            GROUP BY ri.id, ri.name, ri.item_image, ri.price, ri.category_id
            ${havingClause}
            ${orderClause}         
            LIMIT 10`,
            [...distanceParams, ...joinParams, ...whereParams, ...havingParams]
        );

        if (items.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        return sendResponse(req, res, 200, 0, { keyword: "Item_List", component: {} }, items );

    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {})
    }
}


const fetchVouchers = async (req, res) => {
    try {
        const [vouchers] = await db.query(
            `SELECT id, voucher_name, discount_type, valid_until, valid_until FROM tbl_vouchers WHERE is_active = 1 AND is_deleted = 0`
        ); 
        if (vouchers.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }
        return sendResponse(req, res, 200, 0, { keyword: "Voucher_List", component: {} }, vouchers );
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {})
    }
}


const toOfTheWeekItems = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT
                ri.id,
                ri.name,
                ri.item_image AS image,
                ri.price,
                SUM(oi.quantity) AS total_ordered_qty,
                COUNT(DISTINCT oi.order_id) AS total_orders
            FROM tbl_order_items oi
            JOIN tbl_orders o
                ON o.id = oi.order_id
            JOIN tbl_restaurant_items ri
                ON ri.id = oi.item_id
            WHERE o.is_active = 1
                AND o.is_deleted = 0
                AND ri.is_active = 1
                AND ri.is_delete = 0
                AND DATE(o.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
                    AND DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)
            GROUP BY ri.id, ri.name, ri.item_image, ri.price
            ORDER BY total_ordered_qty DESC, total_orders DESC, ri.id DESC
            LIMIT 10`
        );
        if (items.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        return sendResponse(req, res, 200, 0, { keyword: "Item_List", component: {} }, items );
    } catch (error) {
        console.log(error)
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {})
    }
}

const getItemDetails = async (req, res) => {
    try {
        const { item_id } = req.body;
        const [itemDetails] = await db.query(
            `SELECT
                ri.id,
                ri.name,
                c.name AS category_name,
                ri.item_image AS image,
                ri.price,
                ri.calories,
                ri.category_id,
                ri.description,
                ri.preparation_time,
                r.name AS restaurant_name,
                r.latitude AS restaurant_latitude,
                r.longitude AS restaurant_longitude,
                COALESCE(ROUND(AVG(ir.rating), 1), 0) AS average_rating,
                COUNT(DISTINCT ir.id) AS total_ratings,
                MAX(CASE WHEN f.id IS NULL THEN 0 ELSE 1 END) AS is_saved,
                useru.username AS user_name,
                useru.profile_pic AS user_profile_pic,
                itemrating.rating AS user_rating,
                itemrating.description AS user_review,
                date_format(itemrating.created_at, '%Y-%m-%d %H:%i:%s') AS user_reviewed_at
            FROM tbl_restaurant_items ri
            LEFT JOIN tbl_item_rating itemrating
                ON itemrating.item_id = ri.id
                AND itemrating.is_active = 1
                AND itemrating.is_delete = 0
            LEFT JOIN tbl_category c
                ON c.id = ri.category_id
            LEFT JOIN tbl_item_rating ir
                ON ir.item_id = ri.id
                AND ir.is_active = 1
                AND ir.is_delete = 0
            LEFT JOIN tbl_favorites f
                ON f.item_id = ri.id
                AND f.user_id = ?
            LEFT JOIN tbl_user useru 
                on useru.id = itemrating.user_id
            LEFT JOIN tbl_restaurant r
                ON r.id = ri.restaurant_id
            WHERE ri.id = ?
            GROUP BY ri.id, ri.name, ri.item_image, ri.price, ri.category_id, ri.description
        `, [req.loginUser.id, item_id]);
        if (itemDetails.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const [ingredients] = await db.query(
            `SELECT
                i.id,
                i.name,
                i.unit_type,
                i.image
            FROM tbl_items_ingredients ii
            JOIN tbl_ingredients i
                ON i.id = ii.ingrediants_id
            WHERE ii.item_id = ?
                AND ii.is_active = 1
                AND ii.is_delete = 0
                AND i.is_active = 1
                AND i.is_delete = 0
            ORDER BY i.id ASC`,
            [item_id]
        );

        return sendResponse(req, res, 200, 0, { keyword: "Item_Details", component: {} }, {
            ...itemDetails[0],
            ingredients
        });
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
};

const manageCart = async (req, res) => {
    try {
        const { item_id, ingredients_id = null , quantity = 1, action } = req.body;
        const parsedQty = Number(quantity);


        const normalizedAction = String(action).toLowerCase();

        const [itemRows] = await db.query(
            `SELECT id FROM tbl_restaurant_items WHERE id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1`,
            [item_id]
        );

        if (itemRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        if (ingredients_id) {
            const [ingredientMapRows] = await db.query(
                `SELECT ii.id
                 FROM tbl_items_ingredients ii
                 JOIN tbl_ingredients i ON i.id = ii.ingrediants_id
                 WHERE ii.item_id = ?
                   AND ii.ingrediants_id = ?
                   AND ii.is_active = 1
                   AND ii.is_delete = 0
                   AND i.is_active = 1
                   AND i.is_delete = 0
                 LIMIT 1`,
                [item_id, ingredients_id]
            );

            if (ingredientMapRows.length === 0) {
                return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
            }
        }

        const [existingCartItem] = await db.query(
            `SELECT id, quantity FROM tbl_cart WHERE user_id = ? AND item_id = ? AND is_active = 1 AND is_deleted = 0 LIMIT 1`,
            [req.loginUser.id, item_id]
        );

        let cartId = existingCartItem.length > 0 ? existingCartItem[0].id : null;

        if (normalizedAction === "add") {
            if (existingCartItem.length > 0) {
                await db.query(
                    `UPDATE tbl_cart SET quantity = quantity + ? WHERE id = ?`,
                    [parsedQty, cartId]
                );
            } else {
                const [cartInsert] = await db.query(
                    `INSERT INTO tbl_cart (user_id, item_id, quantity) VALUES (?, ?, ?)`,
                    [req.loginUser.id, item_id, parsedQty]
                );
                cartId = cartInsert.insertId;
            }

            if (ingredients_id) {
                const [existingCartIngredient] = await db.query(
                    `SELECT id FROM tbl_cart_ingredients WHERE cart_id = ? AND ingredient_id = ? AND is_active = 1 AND is_deleted = 0 LIMIT 1`,
                    [cartId, ingredients_id]
                );

                if (existingCartIngredient.length > 0) {
                    await db.query(
                        `UPDATE tbl_cart_ingredients SET quantity = quantity + ? WHERE id = ?`,
                        [parsedQty, existingCartIngredient[0].id]
                    );
                } else {
                    await db.query(
                        `INSERT INTO tbl_cart_ingredients (cart_id, ingredient_id, quantity) VALUES (?, ?, ?)`,
                        [cartId, ingredients_id, parsedQty]
                    );
                }
            }

            return sendResponse(req, res, 200, 0, { keyword: "Item_Added_To_Cart", component: {} }, {});
        }

        if (existingCartItem.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const updatedQty = Number(existingCartItem[0].quantity) - parsedQty;

        if (updatedQty > 0) {
            await db.query(`UPDATE tbl_cart SET quantity = ? WHERE id = ?`, [updatedQty, cartId]);
        } else {
            await db.query(
                `UPDATE tbl_cart SET quantity = 0, is_active = 0, is_deleted = 1 WHERE id = ?`,
                [cartId]
            );
        }

        if (ingredients_id) {
            const [existingCartIngredient] = await db.query(
                `SELECT id, quantity FROM tbl_cart_ingredients WHERE cart_id = ? AND ingredient_id = ? AND is_active = 1 AND is_deleted = 0 LIMIT 1`,
                [cartId, ingredients_id]
            );

            if (existingCartIngredient.length > 0) {
                const updatedIngredientQty = Number(existingCartIngredient[0].quantity) - parsedQty;

                if (updatedIngredientQty > 0) {
                    await db.query(
                        `UPDATE tbl_cart_ingredients SET quantity = ? WHERE id = ?`,
                        [updatedIngredientQty, existingCartIngredient[0].id]
                    );
                } else {
                    await db.query(
                        `UPDATE tbl_cart_ingredients SET quantity = 0, is_active = 0, is_deleted = 1 WHERE id = ?`,
                        [existingCartIngredient[0].id]
                    );
                }
            }
        } else if (updatedQty <= 0) {
            await db.query(
                `UPDATE tbl_cart_ingredients SET quantity = 0, is_active = 0, is_deleted = 1 WHERE cart_id = ?`,
                [cartId]
            );
        }

        return sendResponse(req, res, 200, 0, { keyword: "Item_Removed_From_Cart", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const getCartItems = async (req, res) => {
    try {
        const [cartItems] = await db.query(
            `SELECT
                c.id AS cart_id,
                c.quantity AS cart_quantity,
                ri.id AS item_id,
                ri.name AS item_name,
                ri.item_image AS item_image,
                ri.price AS item_price,
                c.quantity * ri.price AS total_price,
                c.created_at AS added_at,
                GROUP_CONCAT(
                    CASE
                        WHEN ci.id IS NOT NULL THEN JSON_OBJECT(
                            'ingredient_id', i.id,
                            'ingredient_name', i.name,
                            'unit_type', i.unit_type,
                            'image', i.image,
                            'quantity', ci.quantity
                        )
                    END
                ) AS ingredients
            FROM tbl_cart c
            JOIN tbl_restaurant_items ri
                ON ri.id = c.item_id
            LEFT JOIN tbl_cart_ingredients ci
                ON ci.cart_id = c.id
            LEFT JOIN tbl_ingredients i
                ON i.id = ci.ingredient_id
            WHERE c.user_id = ?
                AND c.is_active = 1
                AND c.is_deleted = 0
            GROUP BY c.id, c.quantity, ri.id, ri.name, ri.item_image, ri.price, c.created_at
            ORDER BY c.created_at DESC`,
            [req.loginUser.id]
        );
        if (cartItems.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }
        const formattedCartItems = cartItems.map((item) => ({
            cart_id: item.cart_id,
            quantity: item.cart_quantity,
            item_id: item.item_id,
            item_name: item.item_name,
            item_image: item.item_image,
            item_price: item.item_price,
            total_price: item.total_price,
            added_at: item.added_at,
            ingredients: item.ingredients ? JSON.parse(`[${item.ingredients}]`) : [],
        }));
        return formattedCartItems
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const checkOutDetails = async (req, res) => {
    try {
        const { address_id, payment_method_id, voucher_code } = req.body || {};

        const addressParams = [req.loginUser.id];
        let addressFilter = "";
        if (address_id !== undefined && address_id !== null && address_id !== "") {
            addressFilter = " AND ua.id = ?";
            addressParams.push(address_id);
        }

        const [userAddressRows] = await db.query(
            `SELECT
                ua.id AS address_id,
                ua.address,
                ua.latitude,
                ua.longitude
            FROM tbl_user_addresses ua
            WHERE ua.user_id = ?
                AND ua.is_active = 1
                AND ua.is_delete = 0${addressFilter}
            ORDER BY ua.id DESC
            LIMIT 1`,
            addressParams
        );

        const paymentParams = [req.loginUser.id];
        let paymentFilter = "";
        if (payment_method_id !== undefined && payment_method_id !== null && payment_method_id !== "") {
            paymentFilter = " AND pm.id = ?";
            paymentParams.push(payment_method_id);
        }

        const [paymentRows] = await db.query(
            `SELECT
                pm.id AS payment_method_id,
                pm.payment_method,
                pm.UPI_id,
                pm.card_number,
                pm.holder_name,
                pm.expiry_date
            FROM tbl_payment_methods pm
            WHERE pm.user_id = ?
                AND pm.is_active = 1
                AND pm.is_deleted = 0${paymentFilter}
            ORDER BY pm.id DESC
            LIMIT 1`,
            paymentParams
        );

        let voucherDetails = null;

        if (voucher_code) {
            const [voucherRows] = await db.query(
                `SELECT
                    id,
                    voucher_code,
                    voucher_name,
                    discount_type,
                    amount,
                    buy_item,
                    get_item,
                    valid_from,
                    valid_until
                FROM tbl_vouchers
                WHERE voucher_code = ?
                    AND is_active = 1
                    AND is_deleted = 0
                    AND NOW() BETWEEN valid_from AND valid_until
                LIMIT 1`,
                [voucher_code]
            );

            if (voucherRows.length > 0) {
                voucherDetails = voucherRows[0];
            }
        }
        
        
        return sendResponse(req, res, 200, 0, { keyword: "Checkout_Details", component: {} }, {
            user_address: userAddressRows.length > 0 ? userAddressRows[0] : null,
            payment_method: paymentRows.length > 0 ? paymentRows[0] : null,
            voucher: voucherDetails,
        });


    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}


const updateUserAddress = async (req, res) => {
    try {
        const { address_id } = req.body;
        const [addressRows] = await db.query(
            `SELECT id from tbl_user_addresses WHERE id = ? AND user_id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1`,
            [address_id, req.loginUser.id]
        );
        if (addressRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }
        const [userRows] = await db.query(
            `UPDATE tbl_user SET address_id = ? WHERE id = ? AND is_active = 1 AND is_delete = 0`,
            [address_id, req.loginUser.id]
        );
        if (userRows.affectedRows > 0) {
            return sendResponse(req, res, 200, 0, { keyword: "Address_Updated", component: {} }, {});
        } 
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}


const addPaymentMethod = async (req, res) => {
    try {
        const { payment_method, UPI_id, card_number, holder_name, expiry_date } = req.body || {};
        const [existingPaymentRows] = await db.query(
            `SELECT id FROM tbl_payment_methods WHERE user_id = ? AND ( card_number = ? or UPI_id = ? ) AND is_active = 1 AND is_deleted = 0 LIMIT 1`,
            [req.loginUser.id, card_number, UPI_id]
        );
        if (existingPaymentRows.length > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Payment_Method_Already_Exists", component: {} }, {});
        }
        const [paymentInsert] = await db.query(
            `INSERT INTO tbl_payment_methods (user_id, payment_method, UPI_id, card_number, holder_name, expiry_date) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.loginUser.id, payment_method, UPI_id || null, card_number || null, holder_name || null, expiry_date || null]
        );
        if (paymentInsert.affectedRows > 0) {
            return sendResponse(req, res, 200, 0, { keyword: "Payment_Method_Added", component: {} }, {});
        } else {

            return sendResponse(req, res, 500, -1, { keyword: "Failed_To_Add_Payment_Method", component: {} }, {});
        }
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const toggleFavoriteItem = async (req, res) => {
    try {
        const { item_id } = req.body || {};

        if (!item_id) {
            return sendResponse(req, res, 400, -1, { keyword: "Item_Id_Is_Required", component: {} }, {});
        }

        const [itemRows] = await db.query(
            `SELECT id FROM tbl_restaurant_items WHERE id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1`,
            [item_id]
        );

        if (itemRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const [favoriteRows] = await db.query(
            `SELECT id, is_active
             FROM tbl_favorites
             WHERE user_id = ? AND item_id = ?
             LIMIT 1`,
            [req.loginUser.id, item_id]
        );

        if (favoriteRows.length === 0) {
            await db.query(
                `INSERT INTO tbl_favorites (user_id, item_id, is_active) VALUES (?, ?, 1)`,
                [req.loginUser.id, item_id]
            );

            return sendResponse(req, res, 200, 0, { keyword: "Item_Added_To_Favorites", component: {} }, {
                item_id,
                is_favorite: 1
            });
        }

        const existing = favoriteRows[0];
        const shouldActivate = !(Number(existing.is_active) === 1);

        await db.query(
            `UPDATE tbl_favorites SET is_active = ? WHERE id = ?`,
            [shouldActivate ? 1 : 0, existing.id]
        );

        return sendResponse(
            req,
            res,
            200,
            0,
            { keyword: shouldActivate ? "Item_Added_To_Favorites" : "Item_Removed_From_Favorites", component: {} },
            {
                item_id,
                is_favorite: shouldActivate ? 1 : 0
            }
        );
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const fetchFavoriteItems = async (req, res) => {
    try {
        const { category_id } = req.body || {};

        const whereParts = [
            "f.user_id = ?",
            "f.is_active = 1",
            "ri.is_active = 1",
            "ri.is_delete = 0"
        ];
        const params = [req.loginUser.id];

        if (category_id !== undefined && category_id !== null && category_id !== "") {
            whereParts.push("ri.category_id = ?");
            params.push(category_id);
        }

        const [favoriteItems] = await db.query(
            `SELECT
                f.id AS favorite_id,
                ri.id AS item_id,
                ri.name,
                ri.item_image AS image,
                ri.price,
                ri.preparation_time,
                ri.category_id,
                COALESCE(ROUND(AVG(ir.rating), 1), 0) AS average_rating,
                COUNT(DISTINCT ir.id) AS total_ratings
            FROM tbl_favorites f
            JOIN tbl_restaurant_items ri
                ON ri.id = f.item_id
            LEFT JOIN tbl_item_rating ir
                ON ir.item_id = ri.id
                AND ir.is_active = 1
                AND ir.is_delete = 0
            WHERE ${whereParts.join(" AND ")}
            GROUP BY f.id, ri.id, ri.name, ri.item_image, ri.price, ri.preparation_time, ri.category_id
            ORDER BY f.id DESC`,
            params
        );

        if (favoriteItems.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        return sendResponse(req, res, 200, 0, { keyword: "Favorites_List", component: {} }, favoriteItems);
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const placeOrder = async (req, res) => {
    try {
        const {
            address_id,
            payment_method_id,
            subtotal,
            discount,
            delivery_person_id,
        } = req.body || {};

        const [addressRows] = await db.query(
            `SELECT id, address, latitude, longitude
             FROM tbl_user_addresses
             WHERE id = ?
               AND user_id = ?
               AND is_active = 1
               AND is_delete = 0
             LIMIT 1`,
            [address_id, req.loginUser.id]
        );

        if (addressRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const [paymentRows] = await db.query(
            `SELECT id, payment_method
             FROM tbl_payment_methods
             WHERE id = ?
               AND user_id = ?
               AND is_active = 1
               AND is_deleted = 0
             LIMIT 1`,
            [payment_method_id, req.loginUser.id]
        );

        if (paymentRows.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        const paymentMethodRaw = String(paymentRows[0].payment_method || "COD");
        const paymentMethod = paymentMethodRaw.toUpperCase() === "UPI"
            ? "UPI"
            : paymentMethodRaw.toLowerCase() === "card"
                ? "card"
                : "COD";
        
        
        let final_amount = subtotal - discount;
        const [orderInsert] = await db.query(
            `INSERT INTO tbl_orders
                (user_id, delivery_person_id, payment_id, order_number, subtotal, discount, total, address, latitude, longitude, payment_method)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.loginUser.id,
                delivery_person_id || null,
                paymentRows[0].id,
                `ORD${Date.now()}`,
                subtotal,
                discount,
                final_amount,
                addressRows[0].address,
                addressRows[0].latitude,
                addressRows[0].longitude,
                paymentMethod,
            ]
        );
        const cartItems = await getCartItems(req, res);
        const order_id = orderInsert.insertId;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        for (const item of cartItems) {
            const [orderItemInsert] = await db.query(
                `INSERT INTO tbl_order_items
                    (order_id, item_id, quantity, price, address, latitude, longitude, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    order_id,
                    item.item_id,
                    item.quantity,
                    item.item_price,
                    addressRows[0].address,
                    addressRows[0].latitude,
                    addressRows[0].longitude,
                    null,
                ]
            );

            const order_item_id = orderItemInsert.insertId;
            const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];

            for (const ingredient of ingredients) {
                await db.query(
                    `INSERT INTO tbl_order_item_ingredients
                        (order_item_id, ingredient_id, ingredient_name, quantity)
                     VALUES (?, ?, ?, ?)`,
                    [
                        order_item_id,
                        ingredient.ingredient_id,
                        ingredient.ingredient_name,
                        ingredient.quantity || 1,
                    ]
                );
            }
        }

        return sendResponse(req, res, 200, 0, { keyword: "Order_Placed_Successfully", component: {} }, {
            order_id,
        });
    } catch (error) {   
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const trackUserOrders = async (req, res) => {
    try {
        const {delivery_person_id}  = req.body || {};

        const [riderData] = await db.query(
    `SELECT u.id, u.username AS name, u.profile_pic ,u.latitude, u.longitude
        FROM tbl_user u
        WHERE u.id = ?
            AND u.role = 'rider'
            AND u.is_active = 1
            AND u.is_delete = 0
             LIMIT 1`,
            [delivery_person_id]
        );

        if(riderData.length > 0) {
            return sendResponse(req, res, 200, 1, { keyword: "Rider_Found", component: {} }, riderData[0]);
        }
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const userOrders = async (req, res) => {
    try {
        const { type } = req.body || {};

        let statusCondition;
        let statusValues;

        if (type === 'history') {
            statusCondition = 'o.status IN (?, ?)';
            statusValues = ['cancelled', 'delivered'];
        } else if (type === 'myorders') {
            statusCondition = 'o.status IN (?, ?, ?)';
            statusValues = ['pending', 'confirmed', 'preparing'];
        } else {
            return sendResponse(req, res, 400, -1, { keyword: "Invalid_Type", component: {} }, {});
        }

        const [orders] = await db.query(
            `SELECT o.order_number,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'name', ri.name,
                        'image', ri.item_image,
                        'price', ri.price
                    ) 
                ) AS items
            FROM tbl_orders o
            JOIN tbl_order_items oi ON o.id = oi.order_id
            JOIN tbl_restaurant_items ri ON oi.item_id = ri.id
            WHERE o.user_id = ?
                AND ${statusCondition}
            GROUP BY o.id, o.order_number
            ORDER BY o.id DESC
            `,
            [req.loginUser.id, ...statusValues]
        );

        const formattedOrders = orders.map((order) => ({
            ...order,
            items: order.items ? JSON.parse(`[${order.items}]`) : []
        }));

        return sendResponse(req, res, 200, 0, { keyword: "Orders_Fetched_Successfully", component: {} }, { orders: formattedOrders });
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const fetchNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query(
            `SELECT
                n.id,
                n.sender_id,
                u.username AS sender_name,
                u.profile_pic AS sender_profile_pic,
                n.title,
                n.message,
                n.is_read,
                date_format(n.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
            FROM tbl_notifications n
            LEFT JOIN tbl_user u
                ON u.id = n.sender_id
            WHERE n.receiver_id = ?
                AND n.is_active = 1
                AND n.is_deleted = 0
            ORDER BY n.created_at DESC`,
            [req.loginUser.id]
        );

        if (notifications.length === 0) {
            return sendResponse(req, res, 200, 3, { keyword: "No_Data_Found", component: {} }, {});
        }

        return sendResponse(req, res, 200, 0, { keyword: "Notification_List", component: {} }, notifications);
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}

const createNotification = async (req, res) => {
    try {
        const { receiver_id, title, message } = req.body || {};

        const [notificationInsert] = await db.query(
            `INSERT INTO tbl_notifications (sender_id, receiver_id, title, message)
             VALUES (?, ?, ?, ?)`,
            [req.loginUser.id, receiver_id, title, message]
        );

        if (notificationInsert.affectedRows > 0) {
            return sendResponse(req, res, 200, 0, { keyword: "Notification_Created_Successfully", component: {} }, {
                notification_id: notificationInsert.insertId
            });
        }

        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 500, -1, { keyword: "Internal_Server_Error", component: {} }, {});
    }
}


module.exports = {
    fetchcategories,
    getHomePageItems,
    fetchVouchers,
    toOfTheWeekItems,
    getItemDetails,
    updateUserLocation,
    manageCart,
    getCartItems,
    checkOutDetails ,
    updateUserAddress,
    addPaymentMethod,
    placeOrder ,
    trackUserOrders,
    toggleFavoriteItem,
    fetchFavoriteItems,
    fetchNotifications,
    createNotification,
    userOrders
}