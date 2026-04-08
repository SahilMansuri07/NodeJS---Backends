const express = require("express")
const joi = require("joi");
const { fetchcategories, fetchVouchers, getHomePageItems, updateUserLocation, getItemDetails, manageCart, getCartItems, checkOutDetails, updateUserAddress, addPaymentMethod, placeOrder, toggleFavoriteItem, fetchFavoriteItems, trackUserOrders, fetchNotifications, createNotification, userOrders } = require("../../models/v1/user.models");
const { checkToken, validateJoi, checkApi, decryption } = require("../../utils/middleware");

const userRoutes = express.Router()

/**
 * @swagger
 * /api/v1/user/fetchcategories:
 *   get:
 *     summary: Fetch categories
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Category list response
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/fetchcategories", checkApi, decryption, fetchcategories)

/**
 * @swagger
 * /api/v1/user/home-page-items:
 *   post:
 *     summary: Fetch home page items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min_price: { type: number }
 *               max_price: { type: number }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               max_distance_km: { type: number }
 *     responses:
 *       200:
 *         description: Item list response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/home-page-items", checkApi , checkToken , decryption , validateJoi(
    joi.object({
        min_price: joi.number().min(0).optional(),
        max_price: joi.number().min(0).optional(),
        latitude: joi.number().optional(),
        longitude: joi.number().optional(),
        max_distance_km: joi.number().min(0).optional()
    }).options({ stripUnknown: true })
    , true), getHomePageItems)

/**
 * @swagger
 * /api/v1/user/vouchers:
 *   get:
 *     summary: Fetch vouchers
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Voucher list response
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/vouchers", checkApi, decryption, fetchVouchers)

/**
 * @swagger
 * /api/v1/user/update_location:
 *   patch:
 *     summary: Update user location
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude: { type: number }
 *               longitude: { type: number }
 *     responses:
 *       200:
 *         description: Location update response
 *       500:
 *         description: Internal server error
 */
userRoutes.patch("/update_location", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        latitude: joi.number().required(),
        longitude: joi.number().required()
    }).options({ stripUnknown: true })
), updateUserLocation)

/**
 * @swagger
 * /api/v1/user/item-details:
 *   post:
 *     summary: Get item details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_id]
 *             properties:
 *               item_id: { type: integer }
 *     responses:
 *       200:
 *         description: Item details response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/item-details", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        item_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })
), getItemDetails)

/**
 * @swagger
 * /api/v1/user/manage-cart:
 *   post:
 *     summary: Add or remove cart items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_id, action]
 *             properties:
 *               item_id: { type: integer }
 *               ingredients_id: { type: integer, nullable: true }
 *               quantity: { type: integer }
 *               action: { type: string, enum: [add, remove] }
 *     responses:
 *       200:
 *         description: Cart update response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/manage-cart", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        item_id: joi.number().integer().positive().required(),
        ingredients_id: joi.number().integer().positive().allow(null),
        quantity: joi.number().integer().min(1).optional(),
        action: joi.string().valid("add", "remove").required()
    }).options({ stripUnknown: true })
), manageCart)

/**
 * @swagger
 * /api/v1/user/cart:
 *   get:
 *     summary: Fetch cart items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart list response
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/cart", checkApi, checkToken, decryption, getCartItems)

/**
 * @swagger
 * /api/v1/user/checkout-details:
 *   post:
 *     summary: Fetch checkout details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_id: { type: integer }
 *               payment_method_id: { type: integer }
 *               voucher_code: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Checkout details response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/checkout-details", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        address_id: joi.number().integer().positive().optional(),
        payment_method_id: joi.number().integer().positive().optional(),
        voucher_code: joi.string().trim().allow("", null)
    }).options({ stripUnknown: true })
    , true), checkOutDetails)

/**
 * @swagger
 * /api/v1/user/update-address:
 *   put:
 *     summary: Update selected address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address_id]
 *             properties:
 *               address_id: { type: integer }
 *     responses:
 *       200:
 *         description: Address update response
 *       500:
 *         description: Internal server error
 */
userRoutes.put("/update-address", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        address_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })
), updateUserAddress)

/**
 * @swagger
 * /api/v1/user/add-payment-method:
 *   post:
 *     summary: Add payment method
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [payment_method]
 *             properties:
 *               payment_method: { type: string, enum: [COD, card, UPI] }
 *               UPI_id: { type: string, nullable: true }
 *               card_number: { type: string, nullable: true }
 *               holder_name: { type: string, nullable: true }
 *               expiry_date: { type: string, format: date, nullable: true }
 *     responses:
 *       200:
 *         description: Payment method response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/add-payment-method", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        payment_method: joi.string().valid("COD", "card", "UPI").required(),
        UPI_id: joi.string().trim().allow("", null),
        card_number: joi.string().trim().allow("", null),
        holder_name: joi.string().trim().allow("", null),
        expiry_date: joi.date().allow(null)
    }).options({ stripUnknown: true })
), addPaymentMethod)

/**
 * @swagger
 * /api/v1/user/toggle-favorite:
 *   post:
 *     summary: Toggle item favorite status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_id]
 *             properties:
 *               item_id: { type: integer }
 *     responses:
 *       200:
 *         description: Favorite toggle response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/toggle-favorite", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        item_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })
), toggleFavoriteItem)

/**
 * @swagger
 * /api/v1/user/favorite-items:
 *   post:
 *     summary: Fetch favorite items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id: { type: integer }
 *     responses:
 *       200:
 *         description: Favorite list response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/favorite-items", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        category_id: joi.number().integer().positive().optional()
    }).options({ stripUnknown: true })
    , true), fetchFavoriteItems)

/**
 * @swagger
 * /api/v1/user/place-order:
 *   post:
 *     summary: Place order
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address_id, payment_method_id, subtotal, discount]
 *             properties:
 *               address_id: { type: integer }
 *               payment_method_id: { type: integer }
 *               subtotal: { type: number }
 *               discount: { type: number }
 *               delivery_person_id: { type: integer }
 *     responses:
 *       200:
 *         description: Place order response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/place-order", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        address_id: joi.number().integer().positive().required(),
        payment_method_id: joi.number().integer().positive().required(),
        subtotal: joi.number().min(0).required(),
        discount: joi.number().min(0).required(),
        delivery_person_id: joi.number().integer().min(0).optional()
    }).options({ stripUnknown: true })
), placeOrder)

/**
 * @swagger
 * /api/v1/user/track-order:
 *   get:
 *     summary: Track order rider details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order_id]
 *             properties:
 *               order_id: { type: integer }
 *     responses:
 *       200:
 *         description: Track order response
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/track-order", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        order_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })
), trackUserOrders)

/**
 * @swagger
 * /api/v1/user/listorders:
 *   post:
 *     summary: Fetch user orders by type
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, enum: [history, myorders] }
 *     responses:
 *       200:
 *         description: Order list response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/listorders", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        type: joi.string().valid("history", "myorders").required()
    }).options({ stripUnknown: true })
), userOrders)

/**
 * @swagger
 * /api/v1/user/fetch-notifications:
 *   get:
 *     summary: Fetch notifications
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list response
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/fetch-notifications", checkApi, checkToken, decryption, fetchNotifications)

/**
 * @swagger
 * /api/v1/user/create-notification:
 *   post:
 *     summary: Create notification
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         text/plain:
 *           schema:
 *             type: object
 *             required: [receiver_id, title, message]
 *             properties:
 *               receiver_id: { type: integer }
 *               title: { type: string }
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: Notification creation response
 *       500:
 *         description: Internal server error
 */
userRoutes.post("/create-notification", checkApi, checkToken, decryption, validateJoi(
    joi.object({
        receiver_id: joi.number().integer().positive().required(),
        title: joi.string().trim().required(),
        message: joi.string().trim().required()
    }).options({ stripUnknown: true })
), createNotification)

module.exports = userRoutes
