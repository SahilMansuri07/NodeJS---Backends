/**
 * @swagger
 * tags:
 *   - name: SuperAdminTypes
 *     description: Merchant categories and amenities
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
 *     CategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Restaurants"
 *         image:
 *           type: string
 *           example: "categories/restaurant.png"
 *       required:
 *         - name
 *         - image
 *
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Updated Category Name"
 *         image:
 *           type: string
 *           example: "categories/updated.png"
 *       required:
 *         - id
 *         - name
 *         - image
 *
 *     DeleteCategoryRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *
 *     AmenityRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Free WiFi"
 *         image:
 *           type: string
 *           example: "amenities/wifi.png"
 *       required:
 *         - name
 *         - image
 *
 *     UpdateAmenityRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: "Updated Amenity Name"
 *         image:
 *           type: string
 *           example: "amenities/updated.png"
 *       required:
 *         - id
 *         - name
 *         - image
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           example: 1
 *         message:
 *           type: string
 *           example: "Request successful"
 *         data:
 *           type: object
 *           additionalProperties: true
 *
 *     AddCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category Added Successfully"
 *         data:
 *           type: object
 *           properties:
 *             exist:
 *               type: array
 *               items:
 *                 type: object
 *           additionalProperties: true
 *
 *     GetAllCategoriesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Categories Fetched Successfully"
 *         data:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Restaurants"
 *                   image:
 *                     type: string
 *                     example: "categories/restaurant.png"
 *                   is_active:
 *                     type: integer
 *                     example: 1
 *                   is_delete:
 *                     type: integer
 *                     example: 0
 *           additionalProperties: true
 *
 *     UpdateCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category Updated Successfully"
 *         data:
 *           type: object
 *           properties:
 *             updatedCategory:
 *               type: array
 *               items:
 *                 type: object
 *           additionalProperties: true
 *
 *     DeleteCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Category Deleted Successfully"
 *         data:
 *           type: object
 *           additionalProperties: true
 *
 *     AddAmenityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Amenities Added Successfully"
 *         data:
 *           type: object
 *           properties:
 *             exist:
 *               type: array
 *               items:
 *                 type: object
 *           additionalProperties: true
 *
 *     GetAllAmenitiesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Aminities Fetched Successfully"
 *         data:
 *           type: object
 *           properties:
 *             getAminities:
 *               type: array
 *               items:
 *                 type: object
 *           additionalProperties: true
 *
 *     UpdateAmenityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Amenities Updated Successfully"
 *         data:
 *           type: object
 *           additionalProperties: true
 *
 * /superAdmin/types/addCategory:
 *   post:
 *     tags: [SuperAdminTypes]
 *     summary: Add category
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *     responses:
 *       200:
 *         description: Category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddCategoryResponse'
 *
 * /superAdmin/types/getAllCategories:
 *   get:
 *     tags: [SuperAdminTypes]
 *     summary: Get all categories
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllCategoriesResponse'
 *
 * /superAdmin/types/updateCategory:
 *   put:
 *     tags: [SuperAdminTypes]
 *     summary: Update category
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCategoryResponse'
 *
 * /superAdmin/types/deleteCategory:
 *   post:
 *     tags: [SuperAdminTypes]
 *     summary: Delete category
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteCategoryRequest'
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteCategoryResponse'
 *
 * /superAdmin/types/addAmenities:
 *   post:
 *     tags: [SuperAdminTypes]
 *     summary: Add amenity
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AmenityRequest'
 *     responses:
 *       200:
 *         description: Amenity added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddAmenityResponse'
 *
 * /superAdmin/types/getAminities:
 *   get:
 *     tags: [SuperAdminTypes]
 *     summary: Get amenities list
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     responses:
 *       200:
 *         description: Amenities fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllAmenitiesResponse'
 *
 * /superAdmin/types/updateAminities:
 *   put:
 *     tags: [SuperAdminTypes]
 *     summary: Update amenity
 *     security:
 *       - ApiKeyAuth: []
 *       - SuperadminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAmenityRequest'
 *     responses:
 *       200:
 *         description: Amenity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateAmenityResponse'
 */

const express = require("express")
const { checkApi, checkToken ,allowRolles, validateJoi } = require("../../../utils/middelware")
const { addCategory, addAminities, getAllCategories, updateCategory, deleteCategory, getAllAminities, updateAminities } = require("../../../models/v1/superAdmin/merchTypes.models")
const joi = require("joi")

const managetypeRoutes = express.Router()

managetypeRoutes.post("/addCategory" , checkApi , checkToken , validateJoi(joi.object({
    name : joi.string().required(),
    image : joi.string().required(),
})) ,  allowRolles("superadmin") , addCategory)

managetypeRoutes.get("/getAllCategories", checkApi, checkToken, allowRolles("superadmin", "admin"), getAllCategories)

managetypeRoutes.put("/updateCategory", checkApi, checkToken, validateJoi(joi.object({
    id: joi.number().integer().positive().required(),
    name: joi.string().required(),
    image: joi.string().required(),
}).options({ stripUnknown: true })), allowRolles("superadmin"), updateCategory)

managetypeRoutes.post("/deleteCategory", checkApi, checkToken, validateJoi(joi.object({
    id: joi.number().integer().positive().required(),
}).options({ stripUnknown: true })), allowRolles("superadmin"), deleteCategory)



// Aminities Details 

managetypeRoutes.post("/addAmenities", checkApi, checkToken, validateJoi(joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
}).options({ stripUnknown: true })), allowRolles("superadmin"), addAminities)

managetypeRoutes.get("/getAminities", checkApi, checkToken, allowRolles("superadmin", "admin"), getAllAminities)

managetypeRoutes.put("/updateAminities", checkApi, checkToken, validateJoi(joi.object({
   id: joi.number().integer().positive().required(),
   name: joi.string().required(),
   image: joi.string().required()
}).options({ stripUnknown: true })), allowRolles("superadmin"), updateAminities) 


module.exports = managetypeRoutes