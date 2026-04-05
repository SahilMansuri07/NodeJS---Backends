/**
 * @swagger
 * tags:
 *   - name: AdminAuth
 *     description: Admin authentication / logout
 *
 * /admin/auth/signIn:
 *   post:
 *     tags: [AdminAuth]
 *     summary: Admin sign in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               username:
 *                 type: string
 *                 nullable: true
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Admin sign in response
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
 *                     admin_id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token
 *             examples:
 *               success:
 *                 summary: Successful sign in
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Sign In Successful
 *                   data:
 *                     admin_id: 1
 *                     email: admin@example.com
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token
 *               invalidCredentials:
 *                 summary: Invalid credentials
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Invalid Credentials
 *                   data: null
 *               lockedAdmin:
 *                 summary: Admin locked
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Admin Has Been Locked
 *                   data: null
 *               inactiveAdmin:
 *                 summary: Admin inactive
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Admin Account Is Not Active
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
 * /admin/auth/logOut:
 *   post:
 *     tags: [AdminAuth]
 *     summary: Admin logout
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Admin logout response
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
 *                 summary: Successful logout
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Logout Successful
 *                   data: {}
 *               tokenMissing:
 *                 summary: Token missing
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Token is Missing
 *                   data: null
 *               alreadyLoggedOut:
 *                 summary: Already logged out
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Admin Already Logged Out
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
 */
const express = require("express")
const { signIn, logOut } = require("../../../models/v1/auth.models")
const { checkToken, checkApi, validateJoi } = require("../../../utils/middelware")
const joi = require("joi")

const authRoutes = express.Router()


authRoutes.post("/signIn", checkApi, validateJoi(joi.object({
    email:    joi.string().email().optional().allow('', null),
    username: joi.string().optional().allow('', null),
    password: joi.string().required()
}).options({ stripUnknown: true })), signIn)

authRoutes.post("/logOut", checkApi, checkToken, logOut)


module.exports = authRoutes