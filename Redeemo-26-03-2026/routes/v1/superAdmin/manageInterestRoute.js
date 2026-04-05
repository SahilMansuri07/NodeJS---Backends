/**
 * @swagger
 * tags:
 *   - name: SuperAdminInterest
 *     description: Superadmin interest management
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
 *     AddInterestRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Fine Dining"
 *       required:
 *         - name
 *
 *     InterestItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Fine Dining"
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
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
 * /superAdmin/interest/addInteret:
 *   post:
 *     tags: [SuperAdminInterest]
 *     summary: Add interest
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddInterestRequest'
 *     responses:
 *       200:
 *         description: Add interest response
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
 *                   example: Interest Added Successfully
 *                 data:
 *                   type: object
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Interest Added Successfully
 *                   data: {}
 *               alreadyExists:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Interest Already Exists
 *                   data: {}
 *               failedToCreate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Create Interest
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
 * /superAdmin/interest/getInterest:
 *   get:
 *     tags: [SuperAdminInterest]
 *     summary: List interests
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Get interest list response
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
 *                   example: Interest Details Fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     listInterest:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/InterestItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Interest Details Fetched
 *                   data:
 *                     listInterest:
 *                       - id: 1
 *                         name: Fine Dining
 *                         is_active: 1
 *                         is_delete: 0
 *                         created_at: "2025-04-02 12:30:45"
 *                         updated_at: "2025-04-02 12:30:45"
 *               noInterest:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: No interest Found
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

const { checkApi, checkToken, validateJoi, allowRolles } = require("../../../utils/middelware")
const joi = require("joi")
const { addInterets, getInterest, updateInterests } = require("../../../models/v1/superAdmin/manageInterest.models")


const manageInterestRoute = express.Router()

manageInterestRoute.post("/addInteret", checkApi, checkToken, allowRolles("superadmin") , validateJoi(joi.object({
      name : joi.string().required(),
})), addInterets)

manageInterestRoute.get("/getInterest", checkApi, checkToken, allowRolles("superadmin") , getInterest) 



module.exports = manageInterestRoute
