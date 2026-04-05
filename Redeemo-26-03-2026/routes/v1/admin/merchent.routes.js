/**
 * @swagger
 * tags:
 *   - name: MerchantAdmin
 *     description: Merchant management endpoints
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
 *       name: token
 *
 *   schemas:
 *     MerchantTime:
 *       type: object
 *       properties:
 *         start_time:
 *           type: string
 *           example: "09:00:00"
 *         end_time:
 *           type: string
 *           example: "18:00:00"
 *         day:
 *           type: string
 *           enum: [mon, tue, wed, thu, fri, sat, sun]
 *           example: "mon"
 *         is_opened:
 *           type: integer
 *           enum: [0, 1]
 *           example: 1
 *       required:
 *         - start_time
 *         - end_time
 *         - day
 *
 *     MerchantAmenity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "WiFi"
 *
 *     MerchantMedia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         media_url:
 *           type: string
 *           example: "gallery1.jpg"
 *
 *     MerchantDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         admin_id:
 *           type: integer
 *           example: 2
 *         merchant_name:
 *           type: string
 *           example: "ABC Restaurant"
 *         email:
 *           type: string
 *           nullable: true
 *           example: "merchant@example.com"
 *         country_code:
 *           type: string
 *           nullable: true
 *           example: "+91"
 *         mobile_number:
 *           type: string
 *           nullable: true
 *           example: "9876543210"
 *         category_id:
 *           type: integer
 *           example: 2
 *         category_name:
 *           type: string
 *           nullable: true
 *           example: "Restaurant"
 *         logo_image:
 *           type: string
 *           nullable: true
 *           example: "logo.png"
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: "cover.jpg"
 *         lat:
 *           type: number
 *           nullable: true
 *           example: 28.6139
 *         log:
 *           type: number
 *           nullable: true
 *           example: 77.2090
 *         address:
 *           type: string
 *           nullable: true
 *           example: "Connaught Place, Delhi"
 *         about_description:
 *           type: string
 *           nullable: true
 *           example: "A premium dining place"
 *         is_active:
 *           type: integer
 *           example: 1
 *         is_delete:
 *           type: integer
 *           example: 0
 *         amenities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MerchantAmenity'
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MerchantMedia'
 *         timings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MerchantTime'
 *
 *     MerchantRatingUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         profile_image:
 *           type: string
 *           nullable: true
 *           example: "profile.jpg"
 *
 *     MerchantRatingItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         rating:
 *           type: number
 *           example: 4.5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: "Great service"
 *         created_at:
 *           type: string
 *           example: "2025-04-01 10:20:30"
 *         user:
 *           $ref: '#/components/schemas/MerchantRatingUser'
 *
 *     AddMerchantRequest:
 *       type: object
 *       properties:
 *         merchant_name:
 *           type: string
 *           maxLength: 255
 *           example: "ABC Restaurant"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: "merchant@example.com"
 *         country_code:
 *           type: string
 *           nullable: true
 *           example: "+91"
 *         mobile_number:
 *           type: string
 *           nullable: true
 *           example: "9876543210"
 *         category_id:
 *           type: integer
 *           example: 2
 *         logo_image:
 *           type: string
 *           nullable: true
 *           example: "logo.png"
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: "cover.jpg"
 *         lat:
 *           type: number
 *           nullable: true
 *           example: 28.6139
 *         log:
 *           type: number
 *           nullable: true
 *           example: 77.2090
 *         address:
 *           type: string
 *           nullable: true
 *           example: "Connaught Place, Delhi"
 *         about_description:
 *           type: string
 *           nullable: true
 *           example: "A premium dining place"
 *         amenities_id:
 *           oneOf:
 *             - type: integer
 *               example: 1
 *             - type: array
 *               items:
 *                 type: integer
 *               example: [1, 2, 3]
 *         image_url:
 *           oneOf:
 *             - type: string
 *               example: "gallery1.jpg"
 *             - type: array
 *               items:
 *                 type: string
 *               example: ["gallery1.jpg", "gallery2.jpg"]
 *         times:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MerchantTime'
 *       required:
 *         - merchant_name
 *         - category_id
 *
 *     UpdateMerchantBasicRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         merchant_name:
 *           type: string
 *           nullable: true
 *           example: "Updated Merchant"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: "updated@example.com"
 *         country_code:
 *           type: string
 *           nullable: true
 *           example: "+91"
 *         mobile_number:
 *           type: string
 *           nullable: true
 *           example: "9999999999"
 *         category_id:
 *           type: integer
 *           example: 3
 *         logo_image:
 *           type: string
 *           nullable: true
 *           example: "updated-logo.png"
 *         cover_image:
 *           type: string
 *           nullable: true
 *           example: "updated-cover.jpg"
 *         lat:
 *           type: number
 *           nullable: true
 *           example: 19.0760
 *         log:
 *           type: number
 *           nullable: true
 *           example: 72.8777
 *         address:
 *           type: string
 *           nullable: true
 *           example: "Mumbai, India"
 *         about_description:
 *           type: string
 *           nullable: true
 *           example: "Updated description"
 *       required:
 *         - id
 *
 *     DeleteMerchantRequest:
 *       type: object
 *       properties:
 *         merchant_id:
 *           type: integer
 *           example: 1
 *       required:
 *         - merchant_id
 *
 *     UpdateMerchantTimingsRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         times:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 nullable: true
 *                 example: "10:00:00"
 *               end_time:
 *                 type: string
 *                 nullable: true
 *                 example: "20:00:00"
 *               day:
 *                 type: string
 *                 nullable: true
 *                 example: "fri"
 *               is_opened:
 *                 type: integer
 *                 enum: [0, 1]
 *                 nullable: true
 *                 example: 1
 *       required:
 *         - id
 *         - times
 *
 *     UpdateMerchantAmenitiesRequest:
 *       type: object
 *       properties:
 *         amenities_id:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 5]
 *       required:
 *         - amenities_id
 *
 * /admin/merch/addMerchant:
 *   post:
 *     tags: [MerchantAdmin]
 *     summary: Create a new merchant
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMerchantRequest'
 *     responses:
 *       200:
 *         description: Add merchant response
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
 *                   example: Merchant Added Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       $ref: '#/components/schemas/MerchantDetails'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Added Successfully
 *                   data:
 *                     merchant:
 *                       id: 1
 *                       admin_id: 2
 *                       merchant_name: ABC Restaurant
 *                       email: merchant@example.com
 *                       country_code: "+91"
 *                       mobile_number: "9876543210"
 *                       category_id: 2
 *                       category_name: Restaurant
 *                       logo_image: logo.png
 *                       cover_image: cover.jpg
 *                       lat: 28.6139
 *                       log: 77.209
 *                       address: Connaught Place, Delhi
 *                       about_description: A premium dining place
 *                       is_active: 1
 *                       is_delete: 0
 *                       amenities: []
 *                       media: []
 *                       timings: []
 *               emailExists:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Merchant With This Email Already Exists
 *                   data: {}
 *               mobileExists:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Merchant With This Mobile Number Already Exists
 *                   data: {}
 *               categoryNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: Category Not Found
 *                   data: {}
 *               amenitiesNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: One Or More Amenities Not Found
 *                   data: {}
 *               failedToAdd:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Add Merchant
 *                   data: {}
 *               noMerchantFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: No Merchants Found
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
 * /admin/merch/getMerchantList:
 *   get:
 *     tags: [MerchantAdmin]
 *     summary: Get merchants for admin (with pagination)
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
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Page size
 *     responses:
 *       200:
 *         description: Merchant list response
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
 *                   example: Merchant Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MerchantDetails'
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Fetched Successfully
 *                   data:
 *                     merchants: []
 *                     total: 25
 *                     page: 1
 *                     limit: 10
 *               noData:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: No Merchants Found
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
 * /admin/merch/updateMerchantBasic:
 *   post:
 *     tags: [MerchantAdmin]
 *     summary: Update merchant info
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMerchantBasicRequest'
 *     responses:
 *       200:
 *         description: Update merchant basic response
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
 *                   example: Merchant Basic Info Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       $ref: '#/components/schemas/MerchantDetails'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Basic Info Updated Successfully
 *                   data:
 *                     merchant:
 *                       id: 1
 *               merchantNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: Merchant Not Found
 *                   data: {}
 *               noFieldsToUpdate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: No Fields To Update
 *                   data: {}
 *               failedToUpdate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Update Merchant
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
 * /admin/merch/deleteMerchant:
 *   put:
 *     tags: [MerchantAdmin]
 *     summary: Delete merchant (soft)
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteMerchantRequest'
 *     responses:
 *       200:
 *         description: Delete merchant response
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
 *                   example: Merchant Deleted Successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Deleted Successfully
 *                   data: {}
 *               merchantNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: Merchant Not Found
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
 * /admin/merch/updateMerchantTimings:
 *   put:
 *     tags: [MerchantAdmin]
 *     summary: Update timing list for merchant
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMerchantTimingsRequest'
 *     responses:
 *       200:
 *         description: Update merchant timings response
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
 *                   example: Merchant Timings Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       $ref: '#/components/schemas/MerchantDetails'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Timings Updated Successfully
 *                   data:
 *                     merchant:
 *                       id: 1
 *               merchantNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: Merchant Not Found
 *                   data: {}
 *               timesRequired:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Times Array Is Required
 *                   data: {}
 *               failedToUpdate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Update Timing
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
 * /admin/merch/updateMerchantAmenities/{id}:
 *   put:
 *     tags: [MerchantAdmin]
 *     summary: Update merchant amenities
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMerchantAmenitiesRequest'
 *     responses:
 *       200:
 *         description: Update merchant amenities response
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
 *                   example: Merchant Amenities Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       $ref: '#/components/schemas/MerchantDetails'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Amenities Updated Successfully
 *                   data:
 *                     merchant:
 *                       id: 1
 *               merchantNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: Merchant Not Found
 *                   data: {}
 *               amenitiesRequired:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Amenities ID Array Is Required
 *                   data: {}
 *               amenitiesNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: One Or More Amenities Not Found
 *                   data: {}
 *               failedToUpdate:
 *                 value:
 *                   code: 200
 *                   status: 0
 *                   message: Failed To Update Amenities
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
 * /admin/merch/fetchRating:
 *   post:
 *     tags: [MerchantAdmin]
 *     summary: Fetch merchant rating items
 *     security:
 *       - ApiKeyAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - merchant_id
 *     responses:
 *       200:
 *         description: Fetch merchant rating response
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
 *                   example: Merchant Rating and Reviews Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     ratingReviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MerchantRatingItem'
 *             examples:
 *               success:
 *                 value:
 *                   code: 200
 *                   status: 1
 *                   message: Merchant Rating and Reviews Fetched Successfully
 *                   data:
 *                     ratingReviews:
 *                       - id: 1
 *                         rating: 4
 *                         comment: Great service
 *                         created_at: "2025-04-01 10:20:30"
 *                         user:
 *                           id: 1
 *                           first_name: John
 *                           last_name: Doe
 *                           profile_image: profile.jpg
 *               merchantNotFound:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: No Merchant Data Found
 *                   data: {}
 *               noReviews:
 *                 value:
 *                   code: 200
 *                   status: 3
 *                   message: No Rating and Review Data Found for this Merchant
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
 *         description: Error during fetching merchant rating and reviews
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
 *                   example: Error During Fetching Merchant Rating and Reviews
 *                 data:
 *                   type: object
 *                   properties:
 *                     err:
 *                       type: object
 */
const express = require("express")
const { checkApi, checkToken, validateJoi  , allowRolles} = require("../../../utils/middelware")
const { addMerchant, getMerchantList, updateMerchantBasic, deleteMerchant, updateMerchantTimings, updateMerchantAmenities, fetchRating } = require("../../../models/v1/admin/manageMerch.model")
const joi = require("joi")


const manageMerchRoutes = express.Router()

manageMerchRoutes.post("/addMerchant", checkApi, checkToken, validateJoi(joi.object({
    merchant_name:     joi.string().max(255).required(),
    email:             joi.string().email().optional().allow('', null),
    country_code:      joi.string().pattern(/^\+\d{1,4}$/).optional().allow('', null),
    mobile_number:     joi.string().pattern(/^\d{6,15}$/).optional().allow('', null),
    category_id:       joi.number().integer().positive().required(),
    logo_image:        joi.string().max(255).optional().allow('', null),
    cover_image:       joi.string().max(255).optional().allow('', null),
    lat:               joi.number().optional().allow(null),
    log:               joi.number().optional().allow(null),
    address:           joi.string().optional().allow('', null),
    about_description: joi.string().optional().allow('', null),
    
    // Added Amenities validation (Handles single ID or Array of IDs)
    amenities_id:      joi.alternatives().try(
                            joi.array().items(joi.number().integer()),
                            joi.number().integer()
                       ).optional(),

    // Added Media Gallery validation
     image_url: joi.alternatives().try(
        joi.array().items(joi.string().max(255)),
        joi.string().max(255)
    ).optional().allow(null, ""), 

    // Added Working Hours validation
    times:   joi.array().items(joi.object({
                start_time: joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(), // HH:mm:ss
                end_time:   joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(),
                day:        joi.string().valid('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun').required(),
                is_opened:  joi.number().valid(0, 1).default(1)
            })).optional().default([])

}).options({ stripUnknown: true })), addMerchant);

manageMerchRoutes.get('/getMerchantList', checkApi, checkToken, allowRolles('admin', 'superadmin'), getMerchantList)

manageMerchRoutes.post('/updateMerchantBasic', checkApi, checkToken, allowRolles('admin', 'superadmin'), validateJoi(joi.object({
    id: joi.number().integer().positive().required(),
    merchant_name: joi.string().optional().allow('', null),
    email: joi.string().email().optional().allow('', null),
    country_code: joi.string().optional().allow('', null),
    mobile_number: joi.string().optional().allow('', null),
    category_id: joi.number().integer().positive().optional(),
    logo_image: joi.string().optional().allow('', null),
    cover_image: joi.string().optional().allow('', null),
    lat: joi.number().optional().allow(null),
    log: joi.number().optional().allow(null),
    address: joi.string().optional().allow('', null),
    about_description: joi.string().optional().allow('', null)
}).options({ stripUnknown: true })), updateMerchantBasic)

manageMerchRoutes.put("/deleteMerchant", checkApi, checkToken, allowRolles("superadmin" , "admin"), validateJoi(joi.object({
    merchant_id: joi.number().integer().positive().required()
}).options({ stripUnknown: true })), deleteMerchant)

manageMerchRoutes.put("/updateMerchantTimings", checkApi, checkToken, allowRolles("superadmin" ,"admin"), validateJoi(joi.object({
    id: joi.number().integer().positive().required(),
    times: joi.array().items(joi.object({
        start_time: joi.string().optional().allow('', null),
        end_time: joi.string().optional().allow('', null),
        day: joi.string().optional().allow('', null),
        is_opened: joi.number().valid(0,1).optional().allow(null)
    })).required()
}).options({ stripUnknown: true })), updateMerchantTimings)

manageMerchRoutes.put("/updateMerchantAmenities/:id", checkApi, checkToken, allowRolles("superadmin" , "admin"), validateJoi(joi.object({
    amenities_id: joi.array().items(joi.number().integer().positive()).required()
}).options({ stripUnknown: true })), updateMerchantAmenities) 

manageMerchRoutes.post("/fetchRating" , checkApi , checkToken ,  validateJoi(joi.object({
    merchant_id : joi.number().integer().positive().required()
}).options({ stripUnknown: true })), fetchRating)

module.exports = manageMerchRoutes