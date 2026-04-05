const express = require("express");
const joi = require("joi");
const { checkApi, checkToken, validateJoi, decryption } = require("../../utils/middelware");
const { allowRolles } = require("../../utils/middelware");

// ── Controllers from Admin Models ───────────────────────────────────────────────
const adminModels = require("../../models/v1/admin.models");

// ==================== ROUTER INITIALIZATION ====================

const adminAuthRoute = express.Router();      
const interestRoute = express.Router();    
const manageUserRoute = express.Router();    
const managetypeRoutes = express.Router();    
const voucherRoutes = express.Router();     
const manageMerchRoutes = express.Router();   
const cmsRoutes = express.Router();   

// ==================== ADMIN CRUD (superadmin only) ====================

adminAuthRoute.post("/createAdmin",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        password: joi.string().required()
    }).options({ stripUnknown: true })),
    adminModels.createAdmin
);

adminAuthRoute.post("/deleteAdmin",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        admin_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteAdmin
);

adminAuthRoute.post("/getAdminList",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    adminModels.getAdminList
);

adminAuthRoute.post("/updateAdmin",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        admin_id: joi.number().integer().positive().required(),
        email: joi.string().email().optional().allow('', null),
        username: joi.string().optional().allow('', null),
        password: joi.string().optional().allow('', null),
        is_lock: joi.number().valid(0, 1).optional(),
        is_active: joi.number().valid(0, 1).optional()
    }).options({ stripUnknown: true })),
    adminModels.updateAdmin
);

// ==================== INTEREST MANAGEMENT (superadmin only) ====================

interestRoute.post("/addInterest",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        name: joi.string().required()
    }).options({ stripUnknown: true })),
    adminModels.addAdminInterets
);

interestRoute.get("/getInterest",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    adminModels.getInterest
);

// ==================== USER MANAGEMENT (superadmin only) ====================

manageUserRoute.get("/fetchUsers",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    adminModels.fetchUsers
);

manageUserRoute.post("/lockUser",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        user_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.lockUser
);

manageUserRoute.post("/deleteUser",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        user_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteUser
);

// ==================== CATEGORY MANAGEMENT ====================

managetypeRoutes.post("/addCategory",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        name: joi.string().required(),
        image: joi.string().required()
    }).options({ stripUnknown: true })),
    adminModels.addCategory
);

managetypeRoutes.get("/getAllCategories",
    checkApi,
    checkToken,
    allowRolles("superadmin", "admin"),
    adminModels.getAllCategories
);

managetypeRoutes.put("/updateCategory",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required(),
        name: joi.string().optional(),
        image: joi.string().optional(),
        is_active: joi.number().valid(0, 1).optional()
    }).options({ stripUnknown: true })),
    adminModels.updateCategory
);

managetypeRoutes.post("/deleteCategory",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteCategory
);

// ==================== AMENITIES MANAGEMENT ====================

managetypeRoutes.post("/addAmenities",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        name: joi.string().required(),
        image: joi.string().required()
    }).options({ stripUnknown: true })),
    adminModels.addAdminAminities
);

managetypeRoutes.get("/getAmenities",
    checkApi,
    checkToken,
    allowRolles("superadmin", "admin"),
    adminModels.getAllAminities
);

managetypeRoutes.put("/updateAmenities",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required(),
        name: joi.string().required(),
        image: joi.string().required()
    }).options({ stripUnknown: true })),
    adminModels.updateAminities
);

managetypeRoutes.post("/deleteAmenities",
    checkApi,
    checkToken,
    allowRolles("superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteAminities
);

// ==================== VOUCHER MANAGEMENT ====================

voucherRoutes.post("/createVoucher",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        merchant_id: joi.number().integer().positive().required(),
        voucher_name: joi.string().required(),
        voucher_description: joi.string().optional().allow('', null),
        voucher_code: joi.string().required(),
        expiry_date: joi.string().optional().allow('', null),
        image_path: joi.string().optional().allow('', null),
        discount_type: joi.string().required(),
        discount_amount: joi.number().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.createVoucher
);

voucherRoutes.get("/fetchVoucherList",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    validateJoi(joi.object({
        page: joi.number().integer().min(1).optional(),
        size: joi.number().integer().min(1).optional(),
        search: joi.string().optional().allow('', null)
    }).options({ stripUnknown: true }), true),
    adminModels.fetchVoucherList
);

voucherRoutes.post("/updateVoucher",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        voucher_id: joi.number().integer().positive().required(),
        voucher_name: joi.string().optional(),
        voucher_description: joi.string().optional().allow('', null),
        voucher_code: joi.string().optional(),
        expiry_date: joi.string().optional().allow('', null),
        image_path: joi.string().optional().allow('', null),
        discount_type: joi.string().optional(),
        discount_amount: joi.number().positive().optional()
    }).options({ stripUnknown: true })),
    adminModels.updateVoucher
);

voucherRoutes.post("/deleteVoucher",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        voucher_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteVoucher
);

// ==================== MERCHANT MANAGEMENT ====================

manageMerchRoutes.post("/addMerchant",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        merchant_name: joi.string().max(255).required(),
        email: joi.string().email().optional().allow('', null),
        country_code: joi.string().pattern(/^\+\d{1,4}$/).optional().allow('', null),
        mobile_number: joi.string().pattern(/^\d{6,15}$/).optional().allow('', null),
        category_id: joi.number().integer().positive().required(),
        logo_image: joi.string().max(255).optional().allow('', null),
        cover_image: joi.string().max(255).optional().allow('', null),
        lat: joi.number().optional().allow(null),
        log: joi.number().optional().allow(null),
        address: joi.string().optional().allow('', null),
        about_description: joi.string().optional().allow('', null),
        amenities_id: joi.alternatives().try(
            joi.array().items(joi.number().integer()),
            joi.number().integer()
        ).optional(),
        image_url: joi.alternatives().try(
            joi.array().items(joi.string().max(255)),
            joi.string().max(255)
        ).optional().allow(null, ""),
        times: joi.array().items(joi.object({
            start_time: joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(),
            end_time: joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(),
            day: joi.string().valid('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun').required(),
            is_opened: joi.number().valid(0, 1).default(1)
        })).optional().default([])
    }).options({ stripUnknown: true })),
    adminModels.addMerchant
);

manageMerchRoutes.get("/getMerchantList",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    adminModels.getMerchantList
);

manageMerchRoutes.post("/updateMerchantBasic",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
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
    }).options({ stripUnknown: true })),
    adminModels.updateMerchantBasic
);

manageMerchRoutes.put("/updateMerchantTimings",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required(),
        times: joi.array().items(joi.object({
            start_time: joi.string().optional().allow('', null),
            end_time: joi.string().optional().allow('', null),
            day: joi.string().optional().allow('', null),
            is_opened: joi.number().valid(0, 1).optional().allow(null)
        })).required()
    }).options({ stripUnknown: true })),
    adminModels.updateMerchantTimings
);

manageMerchRoutes.put("/updateMerchantImages",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        id: joi.number().integer().positive().required(),
        image_url: joi.array().items(joi.string()).required()
    }).options({ stripUnknown: true })),
    adminModels.updateMerchantImages
);

manageMerchRoutes.put("/updateMerchantAmenities/:id",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        amenities_id: joi.array().items(joi.number().integer().positive()).required()
    }).options({ stripUnknown: true })),
    adminModels.updateMerchantAmenities
);

manageMerchRoutes.put("/deleteMerchant",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        merchant_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.deleteMerchant
);

manageMerchRoutes.post("/fetchRating",
    checkApi,
    checkToken,
    allowRolles("admin", "superadmin"),
    decryption,
    validateJoi(joi.object({
        merchant_id: joi.number().integer().positive().required()
    }).options({ stripUnknown: true })),
    adminModels.fetchRating
);

// -------------------- Contact Us -------------------------

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
    adminModels.fetchContactUs
)

// ==================== EXPORTS ====================

module.exports = {
    adminAuthRoute,     // mount at /admin/auth
    interestRoute,      // mount at /admin/interest
    manageUserRoute,    // mount at /admin/user
    managetypeRoutes,   // mount at /admin/type
    voucherRoutes,      // mount at /admin/voucher
    manageMerchRoutes,   // mount at /admin/merch
    cmsRoutes   // mount at /admin
};