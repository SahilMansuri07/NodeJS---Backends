/**
 * @swagger
 * tags:
 *   - name: UserMerchants
 *     description: User-facing merchant discovery and voucher operations
 * security:
 *   - ApiKeyAuth: []
 *   - UserAuth: []
 *
 * /user/home/getUser:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get current user details
 *     responses:
 *       200:
 *         description: User profile
 *
 * /user/home/updateLocation:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Update user location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lat, log]
 *             properties:
 *               lat:
 *                 type: number
 *               log:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated
 *
 * /user/home/fetchNearestVouchers:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get nearest vouchers
 *     responses:
 *       200:
 *         description: Nearest vouchers
 *
 * /user/home/fetchCategories:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get merchant categories
 *     responses:
 *       200:
 *         description: Categories list
 *
 * /user/home/nearesVouchersMerchants:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get list of merchants nearest vouchers
 *     responses:
 *       200:
 *         description: Merchant list
 *
 * /user/home/fetchCategoryMerchants:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get merchants by category
 *     responses:
 *       200:
 *         description: Category merchant list
 *
 * /user/home/fetchAllNearByMerch:
 *   get:
 *     tags: [UserMerchants]
 *     summary: Get all nearby merchants
 *     responses:
 *       200:
 *         description: All nearby merchants
 *
 * /user/home/addfavoriteMerchant:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Add merchant to favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [merchant_id]
 *             properties:
 *               merchant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Favorite added
 *
 * /user/home/addfavoriteVoucher:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Add voucher to favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voucher_id]
 *             properties:
 *               voucher_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Favorite voucher added
 *
 * /user/home/fetchVoucherDetails:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Fetch voucher details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voucher_id]
 *             properties:
 *               voucher_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Voucher details
 *
 * /user/home/redeemVoucher:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Redeem voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voucher_id]
 *             properties:
 *               voucher_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Voucher redeemed
 *
 * /user/home/addMerchantRating:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Merchant rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [merchant_id, rating]
 *             properties:
 *               merchant_id:
 *                 type: integer
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating added
 *
 * /user/home/deleteRating:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Delete a rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating_id]
 *             properties:
 *               rating_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating deleted
 *
 * /user/home/fetchTrendingMerchants:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Fetch trending merchants
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *               log:
 *                 type: number
 *               page:
 *                 type: integer
 *               limit:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               amenity_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Trending merchants
 *
 * /user/home/fetchRatingListing:
 *   post:
 *     tags: [UserMerchants]
 *     summary: Merchant ratings listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [merchant_id]
 *             properties:
 *               merchant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating listing
 */
const express = require("express")
const joi = require("joi")
const { checkApi, checkToken, validateJoi } = require("../../../utils/middelware")
const { getUser, updateLocation, nearestVouchers, fetchCategories, fetchTrendingMerchants, fetchNearByMerchCategory, fetchAllNearByMerch, toggleFavouriteMerchant, toggleFavouriteVoucher, fetchVoucherDetails, redeemVoucher, addMerchantRating, fetchFavourites, nearestVouchersMerchants, deleteRating, fetchRatingListing } = require("../../../models/v1/user/merchants.models")
const merchRoutes = express.Router()


merchRoutes.get('/getUser' , checkApi , checkToken , getUser)
merchRoutes.post('/updateLocation' , checkApi , checkToken , validateJoi(joi.object({
    lat: joi.number().required(),
    log: joi.number().required()
})) , updateLocation)



// Nearest Vouchers
merchRoutes.get('/fetchNearestVouchers', checkApi, checkToken, nearestVouchers);
 
// Fetch Categories
merchRoutes.get('/fetchCategories', checkApi, checkToken, fetchCategories);
 
// Fetch Trending Merchants
merchRoutes.get('/nearestVouchersMerchants', checkApi, checkToken, nearestVouchersMerchants);

merchRoutes.get('/fetchCategoryMerchants', checkApi, checkToken, fetchNearByMerchCategory);

merchRoutes.get('/fetchAllNearByMerch', checkApi, checkToken, fetchAllNearByMerch);

merchRoutes.post('/addfavoriteMerchant', checkApi, checkToken, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required()
})), toggleFavouriteMerchant);

merchRoutes.post('/addfavoriteVoucher', checkApi, checkToken, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), toggleFavouriteVoucher);

merchRoutes.post('/fetchVoucherDetails', checkApi, checkToken, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), fetchVoucherDetails);

merchRoutes.post('/redeemVoucher', checkApi, checkToken, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), redeemVoucher);

merchRoutes.post('/addMerchantRating', checkApi, checkToken, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required(),
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().optional().allow('', null)
})), addMerchantRating);

merchRoutes.post('/deleteRating', checkApi, checkToken, validateJoi(joi.object({
    rating_id: joi.number().integer().positive().required()
})), deleteRating);

merchRoutes.post('/fetchTrendingMerchants', checkApi, checkToken, validateJoi(joi.object({
    lat: joi.number().optional(),
    log: joi.number().optional(),
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).optional(),
    category_id: joi.number().integer().optional(),
    amenity_ids: joi.array().items(joi.number().integer()).optional(),
    min_rating: joi.number().min(0).max(5).optional(),
    max_rating: joi.number().min(0).max(5).optional()
}).options({ stripUnknown: true }), true), fetchTrendingMerchants);

merchRoutes.post('/fetchRatingListing', checkApi, checkToken, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required()
})), fetchRatingListing);

module.exports = merchRoutes