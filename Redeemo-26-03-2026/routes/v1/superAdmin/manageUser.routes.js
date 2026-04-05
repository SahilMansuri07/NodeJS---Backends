/**
 * @swagger
 * tags:
 *   - name: SuperAdminUsers
 *     description: Superadmin user management
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
 *     LockUserRequest:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 101
 *         is_lock:
 *           type: integer
 *           enum: [0, 1]
 *           description: "0 for unlock, 1 for lock"
 *           example: 1
 *       required:
 *         - user_id
 *         - is_lock
 *
 *     DeleteUserRequest:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 101
 *       required:
 *         - user_id
 *
 *     UserItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
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
 *         profile_image:
 *           type: string
 *           nullable: true
 *           example: "profile.jpg"
 *         gender:
 *           type: string
 *           nullable: true
 *           example: "male"
 *         dob:
 *           type: string
 *           nullable: true
 *           example: "1998-10-20"
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
 *           type: integer
 *           example: 0
 *         is_locked:
 *           type: integer
 *           example: 0
 *         created_at:
 *           type: string
 *           nullable: true
 *           example: "2025-04-02 12:30:45"
 *         updated_at:
 *           type: string
 *           nullable: true
 *           example: "2025-04-02 12:30:45"
 *
 * /superAdmin/user/fetchUsers:
 *   get:
 *     tags: [SuperAdminUsers]
 *     summary: Fetch users
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Fetch users response
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
 *                   example: User Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userData:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: User Data Fetched Successfully
 *                   data:
 *                     userData:
 *                       - id: 101
 *                         first_name: John
 *                         last_name: Doe
 *                         email: john@example.com
 *                         country_code: "+91"
 *                         mobile_number: "9876543210"
 *                         profile_image: profile.jpg
 *                         gender: male
 *                         dob: "1998-10-20"
 *                         is_active: 1
 *                         is_delete: 0
 *                         is_locked: 0
 *                         created_at: "2025-04-02 12:30:45"
 *                         updated_at: "2025-04-02 12:30:45"
 *               noUsers:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: No Users Found
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
 *                   type: object
 *                   example: {}
 *
 * /superAdmin/user/lockUser:
 *   post:
 *     tags: [SuperAdminUsers]
 *     summary: Lock/unlock a user
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LockUserRequest'
 *     responses:
 *       200:
 *         description: Lock/unlock user response
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
 *                   example: User Locked Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     is_locked:
 *                       type: integer
 *                       example: 1
 *             examples:
 *               locked:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: User Locked Successfully
 *                   data:
 *                     is_locked: 1
 *               unlocked:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: User Unlocked Successfully
 *                   data:
 *                     is_locked: 0
 *               userNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: User Not Found
 *                   data: {}
 *               failedToUpdate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Update User
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
 *                   type: object
 *                   example: {}
 *
 * /superAdmin/user/deleteUser:
 *   post:
 *     tags: [SuperAdminUsers]
 *     summary: Delete user
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserRequest'
 *     responses:
 *       200:
 *         description: Delete user response
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
 *                   example: John Doe Deleted Successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: John Doe Deleted Successfully
 *                   data: {}
 *               userNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: User Not Found
 *                   data: {}
 *               alreadyDeleted:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: User Already Deleted
 *                   data: {}
 *               failedToDelete:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Delete User
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
 *                   type: object
 *                   example: {}
 */

const express = require("express")
const { fetchUsers, lockUser, deleteUser } = require("../../../models/v1/superAdmin/manageUser.models")
const { checkApi, checkToken, validateJoi, allowRolles } = require("../../../utils/middelware")
const joi = require("joi")


const manageUserRoute = express.Router()

manageUserRoute.get("/fetchUsers", checkApi, checkToken, allowRolles("superadmin") , fetchUsers)

manageUserRoute.post("/lockUser", checkApi, checkToken, validateJoi(joi.object({
    user_id: joi.number().integer().positive().required(),
    is_lock: joi.number().valid(0, 1).required()
}).options({ stripUnknown: true })),  allowRolles("superadmin")  , lockUser)

manageUserRoute.post("/deleteUser", checkApi, checkToken, validateJoi(joi.object({
    user_id: joi.number().integer().positive().required()
}).options({ stripUnknown: true })),  allowRolles("superadmin")   ,deleteUser)


module.exports = manageUserRoute