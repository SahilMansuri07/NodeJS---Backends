/**
 * @swagger
 * tags:
 *   - name: CMS
 *     description: CMS contact requests
 *
 * components:
 *   schemas:
 *     AddContactUsRequest:
 *       type: object
 *       properties:
 *         subject:
 *           type: string
 *           maxLength: 255
 *           example: "Need help with booking"
 *         message:
 *           type: string
 *           maxLength: 1000
 *           example: "I want to know more about merchant availability."
 *       required:
 *         - subject
 *         - message
 *
 *     ContactUsItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 12
 *         subject:
 *           type: string
 *           example: "Need help with booking"
 *         message:
 *           type: string
 *           example: "I want to know more about merchant availability."
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
 *           type: integer
 *           example: 0
 *         created_at:
 *           type: string
 *           example: "2025-04-02 12:30:45"
 *         updated_at:
 *           type: string
 *           example: "2025-04-02 12:30:45"
 *         first_name:
 *           type: string
 *           nullable: true
 *           example: "John"
 *         last_name:
 *           type: string
 *           nullable: true
 *           example: "Doe"
 *         email:
 *           type: string
 *           nullable: true
 *           example: "john@example.com"
 *         country_code:
 *           type: string
 *           nullable: true
 *           example: "+91"
 *         mobile_number:
 *           type: string
 *           nullable: true
 *           example: "9876543210"
 *
 * /cms/contactUs:
 *   post:
 *     tags: [CMS]
 *     summary: Add contact request
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddContactUsRequest'
 *     responses:
 *       200:
 *         description: Contact request response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Contact message submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 12
 *                     subject:
 *                       type: string
 *                       example: Need help with booking
 *                     message:
 *                       type: string
 *                       example: I want to know more about merchant availability.
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Contact message submitted successfully
 *                   data:
 *                     id: 1
 *                     user_id: 12
 *                     subject: Need help with booking
 *                     message: I want to know more about merchant availability.
 *       400:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal server error / failed to submit message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *             examples:
 *               failedToSubmit:
 *                 value:
 *                   code: 500
 *                   status: 0
 *                   message: Failed to submit contact message
 *                   data: {}
 *               internalServerError:
 *                 value:
 *                   code: 500
 *                   status: 0
 *                   message: Internal Server Error
 *                   data:
 *                     error: {}
 *
 * /cms/getContactUs:
 *   get:
 *     tags: [CMS]
 *     summary: Get contact requests
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Contact requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Contact messages fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ContactUsItem'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Contact messages fetched successfully
 *                   data:
 *                     messages:
 *                       - id: 1
 *                         user_id: 12
 *                         subject: Need help with booking
 *                         message: I want to know more about merchant availability.
 *                         is_active: 1
 *                         is_delete: 0
 *                         created_at: "2025-04-02 12:30:45"
 *                         updated_at: "2025-04-02 12:30:45"
 *                         first_name: John
 *                         last_name: Doe
 *                         email: john@example.com
 *                         country_code: "+91"
 *                         mobile_number: "9876543210"
 *                     pagination:
 *                       page: 1
 *                       size: 10
 *                       total: 50
 *                       totalPages: 5
 *       400:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: object
 *             examples:
 *               internalServerError:
 *                 value:
 *                   code: 500
 *                   status: 0
 *                   message: Internal Server Error
 *                   data:
 *                     error: {}
 */
const express = require("express")
const joi = require("joi")
const { checkApi, checkToken, validateJoi, allowRolles } = require("../../../utils/middelware")
const { addContactUs, fetchContactUs } = require("../../../models/v1/cms/cms.models")

const cmsRoutes = express.Router()

cmsRoutes.post(
    "/contactUs",
    checkApi,
    checkToken,
    validateJoi(
        joi.object({
            subject: joi.string().max(255).required(),
            message: joi.string().max(1000).required()
        }).options({ stripUnknown: true })
    ),
    addContactUs
)

cmsRoutes.get(
    "/getContactUs",
    checkApi,
    checkToken,
    allowRolles('admin' , "superadmin") ,
    validateJoi(
        joi.object({
            page: joi.number().integer().min(1).optional(),
            size: joi.number().integer().min(1).optional()
        }).options({ stripUnknown: true }),
        true
    ),
    fetchContactUs
)

module.exports = cmsRoutes
