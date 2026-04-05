const express = require("express")
const joi = require("joi")
const { checkApi, checkToken, validateJoi, decryption } = require("../../utils/middelware")
const {  addContactUs, getUser , createNotification, updateLocation, nearestVouchers, fetchCategories, fetchTrendingMerchants, fetchNearByMerchCategory, fetchAllNearByMerch, toggleFavouriteMerchant, toggleFavouriteVoucher, fetchVoucherDetails, redeemVoucher, addMerchantRating, fetchFavourites, nearestVouchersMerchants, deleteRating, fetchRatingListing, fetchNotification } = require("../../models/v1/user.models")

const merchRoutes = express.Router()
const notificationRoutes = express.Router()
const cmsRoutes = express.Router()

merchRoutes.get('/getUser' , checkApi , checkToken , getUser)
merchRoutes.post('/updateLocation' , checkApi , checkToken , decryption , validateJoi(joi.object({
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

merchRoutes.post('/addfavoriteMerchant', checkApi, checkToken, decryption, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required()
})), toggleFavouriteMerchant);

merchRoutes.post('/addfavoriteVoucher', checkApi, checkToken, decryption, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), toggleFavouriteVoucher);

merchRoutes.post('/fetchVoucherDetails', checkApi, checkToken, decryption, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), fetchVoucherDetails);

merchRoutes.post('/redeemVoucher', checkApi, checkToken, decryption, validateJoi(joi.object({
    voucher_id: joi.number().integer().positive().required()
})), redeemVoucher);

merchRoutes.post('/addMerchantRating', checkApi, checkToken, decryption, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required(),
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().optional().allow('', null)
})), addMerchantRating);

merchRoutes.post('/deleteRating', checkApi, checkToken, decryption, validateJoi(joi.object({
    rating_id: joi.number().integer().positive().required()
})), deleteRating);

merchRoutes.post('/fetchTrendingMerchants', checkApi, checkToken, decryption, validateJoi(joi.object({
    lat: joi.number().optional(),
    log: joi.number().optional(),
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).optional(),
    category_id: joi.number().integer().optional(),
    amenity_ids: joi.array().items(joi.number().integer()).optional(),
    min_rating: joi.number().min(0).max(5).optional(),
    max_rating: joi.number().min(0).max(5).optional()
}).options({ stripUnknown: true }), true), fetchTrendingMerchants);

merchRoutes.post('/fetchRatingListing', checkApi, checkToken, decryption, validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required()
})), fetchRatingListing);

notificationRoutes.get(
    "/fetchNotification",
    checkApi,
    checkToken,
    validateJoi(
        joi.object({
            page: joi.number().integer().min(1).optional(),
            size: joi.number().integer().min(1).optional(),
        }).options({ stripUnknown: true }),
        true
    ),
    fetchNotification
)

notificationRoutes.post(
    "/addNotification",
    checkApi,
    checkToken,
    decryption,
    validateJoi(
        joi.object({
            title: joi.string().max(255).required(),
            description: joi.string().max(1000).required(),
            receiver_id: joi.number().integer().positive().required(),
            receiver_type: joi.string().valid('user','merchant','admin','superadmin').required(),
            sender_id: joi.number().integer().positive().optional(),
            sender_type: joi.string().valid('user','merchant','admin','superadmin').optional()
        }).options({ stripUnknown: true })
    ),
    createNotification
)

cmsRoutes.post(
    "/contactUs",
    checkApi,
    checkToken,
    decryption,
    validateJoi(
        joi.object({
              subject: joi.string().max(255).required(),
            message: joi.string().max(1000).required()
        }).options({ stripUnknown: true })
    ),
    addContactUs
)
                                                                                                  
module.exports = {merchRoutes  ,notificationRoutes , cmsRoutes}