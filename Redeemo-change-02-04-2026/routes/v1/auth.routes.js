const express = require("express")
const joi = require("joi")
const { checkApi, checkToken, validateJoi, decryption } = require("../../utils/middelware")
const { signUp, otpVerification, resendOtp, forgetPassword, forgetOtpVerify, updatePass, setUserDetails, userSignIn, changePassword, userSignOut, getInterest, userInterestSetup, getprofileDetails, setprofileDetails, updateInterests, adminSignIn, adminSignOut } = require("../../models/v1/auth.models")
const adminAuthRoute = express.Router()
const userAuthRoute = express.Router()

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
userAuthRoute.post('/signup', checkApi, decryption, validateJoi(joi.object({

    login_type: joi.string().valid('s', 'g', 'f', 'a').required().messages({
        'any.only': 'login_type must be s for normal, g for google, f for facebook, a for apple'
    }),

    email: joi.string().email().lowercase().trim().required(),

    country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().required(),

    mobile_number: joi.string().pattern(/^\d{6,15}$/).trim().required(),

    // password → required only for simple login (s), forbidden for social
    password: joi.string()
        .min(8)
        .max(128)
        .when('login_type', {
            is: 's',
            then: joi.required(),
            otherwise: joi.forbidden()
        }),

    // social_id → required for social logins, forbidden for simple
    social_id: joi.string()
        .max(255)
        .when('login_type', {
            is: joi.not('s'),
            then: joi.required(),
            otherwise: joi.forbidden()
        }),

    // first_name → required for social logins, forbidden for simple
    first_name: joi.string()
        .max(255)
        .when('login_type', {
            is: joi.not('s'), 
            then: joi.required(),
            otherwise: joi.forbidden()
        }),

    // last_name → required for social logins, forbidden for simple
    last_name: joi.string()
        .max(255)
        .when('login_type', {
            is: joi.not('s'),
            then: joi.required(),
            otherwise: joi.forbidden()
        }),

    // profile_image → required for social logins, forbidden for simple
    profile_image: joi.string()
        .max(255)
        .when('login_type', {
            is: joi.not('s'),
            then: joi.required(),
            otherwise: joi.forbidden()
        })

}).options({ stripUnknown: true })), signUp)

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
userAuthRoute.post('/verifyOtp', checkApi, decryption, validateJoi(joi.object({
    mobile: joi.string().pattern(/^\d{6,15}$/).trim().required(),
    otp: joi.string().length(6).required()
}).options({ stripUnknown: true })), otpVerification)

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
userAuthRoute.post('/resendOtp', checkApi, decryption, validateJoi(joi.object({
    mobile: joi.string().pattern(/^\d{6,15}$/).trim().required(),
    country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().required(),
    // type tells the system what the OTP is for (signup / forgotpassword etc.)
    type: joi.string().valid('signup', 'forgotpassword').required()
}).options({ stripUnknown: true })), resendOtp)

// ─── FORGET PASSWORD ──────────────────────────────────────────────────────────
userAuthRoute.post('/forgetpass', checkApi, decryption, validateJoi(joi.object({
    mobile: joi.string().pattern(/^\d{6,15}$/).trim().required(),
    country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().required()
}).options({ stripUnknown: true })), forgetPassword)

// ─── FORGET OTP VERIFY ────────────────────────────────────────────────────────
userAuthRoute.post('/forgetOtpVerify', checkApi, decryption, validateJoi(joi.object({
    mobile: joi.string().pattern(/^\d{6,15}$/).trim().required(),
    otp: joi.string().length(6).required()
}).options({ stripUnknown: true })), forgetOtpVerify)

// ─── UPDATE PASSWORD (after forget-password OTP verify) ───────────────────────
userAuthRoute.post('/updatePass', checkApi, decryption, validateJoi(joi.object({
    user_id: joi.number().integer().positive().required(),
    newPass: joi.string().min(8).max(128).required()
}).options({ stripUnknown: true })), updatePass)

// ─── SET USER DETAILS (profile step 2 → 3) ────────────────────────────────────
userAuthRoute.post('/setUserDetails', checkApi, decryption, validateJoi(joi.object({
    user_id: joi.number().integer().positive().required(),
    first_name: joi.string().max(100).required(),
    last_name: joi.string().max(100).required(),
    address: joi.string().max(255).optional().allow('', null),
    dob: joi.date().iso().optional().allow('', null),
    gender: joi.string().valid('m', 'f', 'o').optional().allow('', null),
    profile_image: joi.string().max(255).optional().allow('', null)
}).options({ stripUnknown: true })), setUserDetails)

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
// login_type drives which fields are required — same pattern as signup
userAuthRoute.post('/signIn', checkApi, decryption, validateJoi(joi.object({

    login_type: joi.string().valid('s', 'g', 'f', 'a').required().messages({
        'any.only': 'login_type must be s for normal, g for google, f for facebook, a for apple'
    }),

    // social_id → required for social logins (g/f/a), forbidden for simple
    social_id: joi.string()
        .max(255)
        .when('login_type', {
            is: joi.not('s'),
            then: joi.required(),
            otherwise: joi.forbidden()
        }),

    // email → required for simple login, optional otherwise
    email: joi.string().email().lowercase().trim()
        .when('login_type', {
            is: 's',
            then: joi.optional().allow('', null),
            otherwise: joi.forbidden()
        }),

    // mobile + country_code → optional for simple (user may login via email OR mobile)
    mobile: joi.string().pattern(/^\d{6,15}$/).trim()
        .when('login_type', {
            is: 's',
            then: joi.optional().allow('', null),
            otherwise: joi.forbidden()
        }),

    country_code: joi.string().pattern(/^\+\d{1,4}$/).trim()
        .when('login_type', {
            is: 's',
            then: joi.optional().allow('', null),
            otherwise: joi.forbidden()
        }),

    // password → required only for simple login
    password: joi.string()
        .min(8)
        .max(128)
        .when('login_type', {
            is: 's',
            then: joi.required(),
            otherwise: joi.forbidden()
        })
 
}).options({ stripUnknown: true })), userSignIn)

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
userAuthRoute.post('/changePassword', checkApi, checkToken, decryption, validateJoi(joi.object({
    oldPass: joi.string().min(8).max(128).required(),
    newPass: joi.string().min(8).max(128).required()
}).options({ stripUnknown: true })), changePassword)

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
userAuthRoute.post('/logOut', checkApi, checkToken, userSignOut)

// ─── GET INTERESTS ────────────────────────────────────────────────────────────
userAuthRoute.get('/getInterest', checkApi, checkToken, getInterest)

// ─── SET INTERESTS ────────────────────────────────────────────────────────────
userAuthRoute.post('/setInterest', checkApi, checkToken, decryption, validateJoi(joi.object({
    user_id: joi.number().integer().positive().required(),
    // interests can be a single id or an array of ids
    interests: joi.alternatives().try(
        joi.array().items(joi.number().integer().positive()).min(1).required(),
        joi.number().integer().positive()
    ).required()
}).options({ stripUnknown: true })), userInterestSetup)

// ─── GET PROFILE DETAILS ──────────────────────────────────────────────────────
userAuthRoute.get('/getprofileDetails', checkApi, checkToken, getprofileDetails)

// ─── SET PROFILE DETAILS ──────────────────────────────────────────────────────
userAuthRoute.put('/setprofileDetails', checkApi, checkToken, decryption, validateJoi(joi.object({
    userId: joi.number().integer().positive().required(),
    first_name: joi.string().max(100).optional().allow('', null),
    last_name: joi.string().max(100).optional().allow('', null),
    address: joi.string().max(255).optional().allow('', null),
    dob: joi.date().iso().optional().allow('', null),
    gender: joi.string().valid('m', 'f', 'o').optional().allow('', null),
    country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().optional().allow('', null),
    mobile_number: joi.string().pattern(/^\d{6,15}$/).trim().optional().allow('', null)
}).options({ stripUnknown: true })), setprofileDetails)

userAuthRoute.post("/updateInterests", checkApi, checkToken, decryption, validateJoi(joi.object({
    interests: joi.array().items(joi.number()).required()
})
), updateInterests)

// ---------------------------- Admin auth Routes ---------------------------------
adminAuthRoute.post("/signIn", checkApi, decryption, validateJoi(joi.object({
    email:    joi.string().email().optional().allow('', null),
    username: joi.string().optional().allow('', null),
    password: joi.string().required() ,
    // device Data 
    device_type: joi.string().optional(),
    uuid: joi.string().optional(),
    device_name: joi.string().optional(),
    device_model:joi.string().optional(),
    os_version: joi.string().optional(),
    device_token:joi.string().optional().allow('', null),
    ip: joi.string().optional()
}).options({ stripUnknown: true })), adminSignIn)

adminAuthRoute.post("/logOut", checkApi, checkToken, adminSignOut)

module.exports = {adminAuthRoute , userAuthRoute}