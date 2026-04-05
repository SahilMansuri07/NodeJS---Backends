/**
 * @swagger
 * tags:
 *   - name: VoucherAdmin
 *     description: Admin voucher management
 *
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: api-key
 *     AdminAuth:
 *       type: apiKey
 *       in: header
 *       name: authorization
 *
 *   schemas:
 *     CreateVoucherRequest:
 *       type: object
 *       properties:
 *         merchant_id:
 *           type: integer
 *           example: 1
 *         voucher_name:
 *           type: string
 *           example: "Flat 20 Off"
 *         voucher_description:
 *           type: string
 *           nullable: true
 *           example: "Get flat 20% off on all orders"
 *         voucher_code:
 *           type: string
 *           example: "FLAT20"
 *         expiry_date:
 *           type: string
 *           nullable: true
 *           example: "2026-12-31"
 *         image_path:
 *           type: string
 *           nullable: true
 *           example: "voucher/banner.png"
 *         discount_type:
 *           type: string
 *           example: "percentage"
 *         discount_amount:
 *           type: number
 *           example: 20
 *       required:
 *         - merchant_id
 *         - voucher_name
 *         - voucher_code
 *         - discount_type
 *         - discount_amount
 *
 *     UpdateVoucherRequest:
 *       type: object
 *       properties:
 *         voucher_id:
 *           type: integer
 *           example: 10
 *         voucher_name:
 *           type: string
 *           example: "Updated Flat 20 Off"
 *         voucher_description:
 *           type: string
 *           nullable: true
 *           example: "Updated voucher description"
 *         voucher_code:
 *           type: string
 *           example: "NEW20"
 *         expiry_date:
 *           type: string
 *           nullable: true
 *           example: "2026-12-31"
 *         image_path:
 *           type: string
 *           nullable: true
 *           example: "voucher/new-banner.png"
 *         discount_type:
 *           type: string
 *           example: "fixed"
 *         discount_amount:
 *           type: number
 *           example: 100
 *       required:
 *         - voucher_id
 *
 *     DeleteVoucherRequest:
 *       type: object
 *       properties:
 *         voucher_id:
 *           type: integer
 *           example: 10
 *       required:
 *         - voucher_id
 *
 *     VoucherItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         merchant_id:
 *           type: integer
 *           example: 1
 *         merchant_name:
 *           type: string
 *           example: "ABC Restaurant"
 *         voucher_name:
 *           type: string
 *           example: "Flat 20 Off"
 *         voucher_description:
 *           type: string
 *           nullable: true
 *           example: "Get flat 20% off on all orders"
 *         voucher_code:
 *           type: string
 *           example: "FLAT20"
 *         expiry_date:
 *           type: string
 *           nullable: true
 *           example: "2026-12-31"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "voucher/banner.png"
 *         discount_type:
 *           type: string
 *           example: "percentage"
 *         discount_amount:
 *           type: number
 *           example: 20
 *
 *     VoucherRawItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         merchant_id:
 *           type: integer
 *           example: 1
 *         voucher_name:
 *           type: string
 *           example: "Flat 20 Off"
 *         voucher_description:
 *           type: string
 *           nullable: true
 *           example: "Get flat 20% off on all orders"
 *         voucher_code:
 *           type: string
 *           example: "FLAT20"
 *         expiry_date:
 *           type: string
 *           nullable: true
 *           example: "2026-12-31"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "voucher/banner.png"
 *         discount_type:
 *           type: string
 *           example: "percentage"
 *         discount_amount:
 *           type: number
 *           example: 20
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
 *           type: integer
 *           example: 0
 *
 * /admin/voucher/createVoucher:
 *   post:
 *     tags: [VoucherAdmin]
 *     summary: Create voucher
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVoucherRequest'
 *     responses:
 *       200:
 *         description: Create voucher response
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
 *                   example: Voucher Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     voucherData:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VoucherRawItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Voucher Created Successfully
 *                   data:
 *                     voucherData:
 *                       - id: 10
 *                         merchant_id: 1
 *                         voucher_name: Flat 20 Off
 *                         voucher_description: Get flat 20% off on all orders
 *                         voucher_code: FLAT20
 *                         expiry_date: "2026-12-31"
 *                         image: voucher/banner.png
 *                         discount_type: percentage
 *                         discount_amount: 20
 *                         is_active: 1
 *                         is_delete: 0
 *               codeExist:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Voucher Code Already Exist for this Merchant
 *                   data: {}
 *               errorCreating:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Error During Creating Voucher
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
 *         description: Error during creating voucher
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
 *                   example: Error During Creating Voucher
 *                 data:
 *                   type: object
 *                   properties:
 *                     err:
 *                       type: object
 *
 * /admin/voucher/fetchVoucherList:
 *   get:
 *     tags: [VoucherAdmin]
 *     summary: Fetch voucher list
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Page size
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *           example: "flat"
 *         description: Search term
 *     responses:
 *       200:
 *         description: Fetch voucher list response
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
 *                   example: Voucher List Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vouchers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VoucherItem'
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Voucher List Fetched Successfully
 *                   data:
 *                     vouchers:
 *                       - id: 10
 *                         merchant_id: 1
 *                         merchant_name: ABC Restaurant
 *                         voucher_name: Flat 20 Off
 *                         voucher_description: Get flat 20% off on all orders
 *                         voucher_code: FLAT20
 *                         expiry_date: "2026-12-31"
 *                         image: voucher/banner.png
 *                         discount_type: percentage
 *                         discount_amount: 20
 *                     currentPage: 1
 *                     pageSize: 10
 *               noData:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: No Voucher Data Found
 *                   data:
 *                     vouchers: []
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
 *         description: Error during fetching voucher list
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
 *                   example: Error During Fetching Voucher List
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: SQL error message
 *
 * /admin/voucher/updateVoucher:
 *   post:
 *     tags: [VoucherAdmin]
 *     summary: Update voucher details
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVoucherRequest'
 *     responses:
 *       200:
 *         description: Update voucher response
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
 *                   example: Voucher Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     voucherData:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VoucherRawItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Voucher Updated Successfully
 *                   data:
 *                     voucherData:
 *                       - id: 10
 *                         merchant_id: 1
 *                         voucher_name: Updated Flat 20 Off
 *                         voucher_description: Updated voucher description
 *                         voucher_code: NEW20
 *                         expiry_date: "2026-12-31"
 *                         image: voucher/new-banner.png
 *                         discount_type: fixed
 *                         discount_amount: 100
 *                         is_active: 1
 *                         is_delete: 0
 *               notFound:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Voucher Not Found
 *                   data: {}
 *               codeExist:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Voucher Code Already Exist
 *                   data: {}
 *               errorUpdating:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Error During Updating Voucher
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
 *         description: Error during updating voucher
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
 *                   example: Error During Updating Voucher
 *                 data:
 *                   type: object
 *                   properties:
 *                     err:
 *                       type: object
 *
 * /admin/voucher/deleteVoucher:
 *   post:
 *     tags: [VoucherAdmin]
 *     summary: Delete voucher
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteVoucherRequest'
 *     responses:
 *       200:
 *         description: Delete voucher response
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
 *                   example: Voucher Deleted Successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Voucher Deleted Successfully
 *                   data: {}
 *               notFound:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Voucher Not Found
 *                   data: {}
 *               errorDeleting:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Error During Deleting Voucher
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
 *         description: Error during deleting voucher
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
 *                   example: Error During Deleting Voucher
 *                 data:
 *                   type: object
 *                   properties:
 *                     err:
 *                       type: object
 */
const express = require("express")
const joi = require("joi")
const { createVoucher, fetchVoucherList, deleteVoucher, updateVoucher } = require("../../../models/v1/admin/manageVoucher.models")
const { checkApi, checkToken, allowRolles, validateJoi } = require("../../../utils/middelware")

const voucherRoutes = express.Router()



voucherRoutes.post(
    "/createVoucher",
    checkApi,
    checkToken,
    allowRolles("admin"),
    validateJoi(
        joi.object({
            merchant_id: joi.number().integer().positive().required(),
            voucher_name: joi.string().required(),
            voucher_description: joi.string().optional().allow('', null),
            voucher_code: joi.string().required(),
            expiry_date: joi.string().optional().allow('', null),
            image_path: joi.string().optional().allow('', null),
            discount_type: joi.string().required(),
            discount_amount: joi.number().positive().required(),
        }).options({ stripUnknown: true }),
    ),
    createVoucher
)

voucherRoutes.get(
    "/fetchVoucherList",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    validateJoi(
        joi.object({
            page: joi.number().integer().min(1).optional(),
            size: joi.number().integer().min(1).optional(),
            search: joi.string().optional().allow('', null),
        }).options({ stripUnknown: true }),
        true
    ),
    fetchVoucherList
)

voucherRoutes.post(
    "/updateVoucher",
    checkApi,
    checkToken,
    allowRolles("admin"),
    validateJoi(
        joi.object({
            voucher_id: joi.number().integer().positive().required(),
            voucher_name: joi.string().optional(),
            voucher_description: joi.string().optional().allow('', null),
            voucher_code: joi.string().optional(),
            expiry_date: joi.string().optional().allow('', null),
            image_path: joi.string().optional().allow('', null),
            discount_type: joi.string().optional(),
            discount_amount: joi.number().positive().optional(),
        }).options({ stripUnknown: true }),
    ),
    updateVoucher
)

voucherRoutes.post(
    "/deleteVoucher",
    checkApi,
    checkToken,
    allowRolles("admin"),
    validateJoi(
        joi.object({
            voucher_id: joi.number().integer().positive().required(),
        }).options({ stripUnknown: true }),
    ),
    deleteVoucher
)

module.exports = voucherRoutes