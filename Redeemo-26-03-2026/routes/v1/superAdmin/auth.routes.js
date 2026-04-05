/**
 * @swagger
 * tags:
 *   - name: SuperAdminAuth
 *     description: Superadmin auth and admin management
 *
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: api-key
 *     SuperadminAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 *
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: "superadmin@example.com"
 *         username:
 *           type: string
 *           nullable: true
 *           example: "super_user"
 *         password:
 *           type: string
 *           example: "StrongPassword123!"
 *         device_token:
 *           type: string
 *           nullable: true
 *           example: "fcm_token_12345"
 *         device_type:
 *           type: string
 *           enum: [android, ios, web]
 *           example: "web"
 *         device_name:
 *           type: string
 *           nullable: true
 *           example: "Chrome Browser"
 *         device_model:
 *           type: string
 *           nullable: true
 *           example: "Windows 11"
 *         os_version:
 *           type: string
 *           nullable: true
 *           example: "10.0.1"
 *         uuid:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         ip:
 *           type: string
 *           nullable: true
 *           example: "192.168.1.1"
 *       required:
 *         - password
 *         - device_type
 *         - uuid
 *
 *     CreateAdminRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *         username:
 *           type: string
 *           example: "admin_user"
 *         password:
 *           type: string
 *           example: "AdminPass123!"
 *       required:
 *         - email
 *         - username
 *         - password
 *
 *     DeleteAdminRequest:
 *       type: object
 *       properties:
 *         admin_id:
 *           type: integer
 *           example: 5
 *       required:
 *         - admin_id
 *
 *     UpdateAdminRequest:
 *       type: object
 *       properties:
 *         admin_id:
 *           type: integer
 *           example: 5
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: "updated_admin@example.com"
 *         username:
 *           type: string
 *           nullable: true
 *           example: "updated_user"
 *         password:
 *           type: string
 *           nullable: true
 *           example: "NewPass123!"
 *       required:
 *         - admin_id
 *
 *     AdminItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         email:
 *           type: string
 *           example: "admin@example.com"
 *         username:
 *           type: string
 *           example: "admin_user"
 *         role:
 *           type: string
 *           example: "admin"
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
 *           type: integer
 *           example: 0
 *
 * /superAdmin/auth/signIn:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: Superadmin sign in
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Superadmin sign in response
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
 *                   example: Sign In Successful
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     super_admin_id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: superadmin@example.com
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Sign In Successful
 *                   data:
 *                     super_admin_id: 1
 *                     email: superadmin@example.com
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token
 *               invalidCredentials:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Invalid Credentials
 *                   data: null
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
 *                   nullable: true
 *                   example: null
 *
 * /superAdmin/auth/logOut:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: Superadmin logout
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Superadmin logout response
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
 *                   example: Logout Successful
 *                 data:
 *                   type: object
 *                   nullable: true
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Logout Successful
 *                   data: {}
 *               tokenMissing:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Token is Missing
 *                   data: null
 *               alreadyLoggedOut:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: User Already Logged Out
 *                   data: {}
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
 *                   nullable: true
 *                   example: null
 *
 * /superAdmin/auth/createAdmin:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: Create a sub-admin (superadmin only)
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       200:
 *         description: Create admin response
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
 *                   example: Admin created successfully
 *                 data:
 *                   type: object
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Admin created successfully
 *                   data: {}
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
 *
 * /superAdmin/auth/deleteAdmin:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: Delete a sub-admin
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAdminRequest'
 *     responses:
 *       200:
 *         description: Delete admin response
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
 *                   example: Admin deleted successfully
 *                 data:
 *                   type: object
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Admin deleted successfully
 *                   data: {}
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
 *
 * /superAdmin/auth/getAdminList:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: List sub-admins
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Admin list fetched successfully
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
 *                   example: Admin list fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     admins:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Admin list fetched successfully
 *                   data:
 *                     admins:
 *                       - id: 5
 *                         email: admin@example.com
 *                         username: admin_user
 *                         role: admin
 *                         is_active: 1
 *                         is_delete: 0
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
 *
 * /superAdmin/auth/updateAdmin:
 *   post:
 *     tags: [SuperAdminAuth]
 *     summary: Update sub-admin details
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdminRequest'
 *     responses:
 *       200:
 *         description: Update admin response
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
 *                   example: Admin updated successfully
 *                 data:
 *                   type: object
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Admin updated successfully
 *                   data: {}
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
 */

const express = require("express")
const { signIn, logOut } = require("../../../models/v1/superAdmin/auth.models")
const { checkToken, checkApi, allowRolles ,validateJoi } = require("../../../utils/middelware")
const { createAdmin, deleteAdmin, getAdminList, updateAdmin } = require("../../../models/v1/admin.models")
const joi = require("joi")

const authRoutes = express.Router()


// ─── AUTH ─────────────────────────────────────────────────────────────────────

authRoutes.post("/signIn", checkApi, validateJoi(joi.object({
    email:    joi.string().email().optional().allow('', null),
    username: joi.string().optional().allow('', null),
    password: joi.string().required(), 
    // device Data
    device_token: joi.string().optional().allow('', null),
    device_type:  joi.string().valid('android', 'ios', 'web').required(),
    device_name:  joi.string().optional().allow('', null),
    device_model: joi.string().optional().allow('', null),
    os_version:   joi.string().optional().allow('', null),
    uuid:         joi.string().required(),
    ip:           joi.string().optional().allow('', null)

}).options({ stripUnknown: true })), signIn)

authRoutes.post("/logOut", checkApi, checkToken, logOut)


// ─── ADMIN CRUD ───────────────────────────────────────────────────────────────

authRoutes.post("/createAdmin", checkApi, checkToken, validateJoi(joi.object({
    email:    joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string().required()
}).options({ stripUnknown: true })), allowRolles("superadmin") ,  createAdmin)

authRoutes.post("/deleteAdmin", checkApi, checkToken, validateJoi(joi.object({
    admin_id: joi.number().integer().positive().required()
}).options({ stripUnknown: true })), allowRolles("superadmin") ,  deleteAdmin)

authRoutes.post("/getAdminList", checkApi, checkToken, allowRolles("superadmin"), getAdminList)

authRoutes.post("/updateAdmin", checkApi, checkToken, validateJoi(joi.object({
    admin_id: joi.number().integer().positive().required(),
    email:    joi.string().email().optional().allow('', null),
    username: joi.string().optional().allow('', null),
    password: joi.string().optional().allow('', null)
}).options({ stripUnknown: true })), allowRolles("superadmin") ,  updateAdmin)


module.exports = authRoutes