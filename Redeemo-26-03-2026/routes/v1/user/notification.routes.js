/**
 * @swagger
 * tags:
 *   - name: UserNotification
 *     description: User notification endpoints
 * security:
 *   - ApiKeyAuth: []
 *   - UserAuth: []
 * /user/notification/fetchNotification:
 *   get:
 *     tags: [UserNotification]
 *     summary: Fetch notifications
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification list
 * /user/notification/addNotification:
 *   post:
 *     tags: [UserNotification]
 *     summary: Create a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, receiver_id, receiver_type]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               receiver_id:
 *                 type: integer
 *               receiver_type:
 *                 type: string
 *                 enum: [user, merchant, admin, superadmin]
 *               sender_id:
 *                 type: integer
 *               sender_type:
 *                 type: string
 *                 enum: [user, merchant, admin, superadmin]
 *     responses:
 *       200:
 *         description: Notification created
 */
const express = require("express")
const joi = require("joi")
const { fetchNotification, createNotification } = require("../../../models/v1/user/notification.models")
const { checkApi, checkToken, validateJoi } = require("../../../utils/middelware")

const notificationRoutes = express.Router()

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

module.exports = notificationRoutes