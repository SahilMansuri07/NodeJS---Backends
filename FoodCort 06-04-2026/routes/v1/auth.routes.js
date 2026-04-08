const express = require("express")
const joi = require("joi");
const { signUp, otpVerification, resendOtp, forgetPassword, forgetOtpVerify, updatePass, signIn, signOut, editProfile, changePassword } = require("../../models/v1/auth.models");
const { validateJoi, checkApi, checkToken, decryption } = require("../../utils/middleware");

const userAuthRoutes = express.Router()

/**
 * @swagger
 * /api/v1/auth/user/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user or rider using simple or social login.
 *     tags:
 *       - Auth
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login_type
 *               - role
 *             properties:
 *               login_type:
 *                 type: string
 *                 enum: [s, g, f]
 *               role:
 *                 type: string
 *                 enum: [user, rider]
 *               profile_pic:
 *                 type: string
 *                 nullable: true
 *               username:
 *                 type: string
 *                 nullable: true
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *               country_code:
 *                 type: string
 *                 example: +91
 *                 nullable: true
 *               mobile_number:
 *                 type: string
 *                 nullable: true
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 nullable: true
 *               social_id:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Signup response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "4"
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 data:
 *                   type: object
 *             examples:
 *               otpSent:
 *                 summary: OTP sent for simple signup
 *                 value:
 *                   code: "4"
 *                   message: OTP sent successfully
 *                   data:
 *                     userData:
 *                       - id: 101
 *                         username: demo
 *                         email: demo@example.com
 *                         mobile_number: "9510447000"
 *                         country_code: "+91"
 *                         role: user
 *               socialSignupSuccess:
 *                 summary: Social signup immediate success
 *                 value:
 *                   code: "1"
 *                   message: User signed in successfully
 *                   data: {}
 *               emailExists:
 *                 summary: Email already exists
 *                 value:
 *                   code: "0"
 *                   message: Email already exists
 *                   data: {}
 *               mobileExists:
 *                 summary: Mobile number already exists
 *                 value:
 *                   code: "0"
 *                   message: Mobile number already exists
 *                   data: {}
 *               invalidLoginType:
 *                 summary: Invalid login type
 *                 value:
 *                   code: "0"
 *                   message: Invalid login type
 *                   data: {}
 *               userFetchFailed:
 *                 summary: User data fetch failed
 *                 value:
 *                   code: "3"
 *                   message: Could not fetch data for the given user
 *                   data: {}
 *       400:
 *         description: Validation or bad request error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "-1"
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 data:
 *                   type: object
 *                   example: {}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "0"
 *                 message:
 *                   type: string
 *                   example: Error during registration
 *                 data:
 *                   type: object
 *                   example: {}
 */
userAuthRoutes.post("/signup", checkApi, decryption, validateJoi(
	joi.object({
		login_type: joi.string().valid("s", "g", "f").required().messages({
			"any.only": "login_type must be s for simple, g for google, f for facebook"
		}),
			role: joi.string().valid("user", "rider").required().messages({
				"any.only": "role must be user or rider"
			}),
			profile_pic: joi.string().trim().max(256).allow("", null).default(""),
		username: joi.string().trim().allow("", null),
		email: joi.string().email().lowercase().trim().allow("", null),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().allow("", null),
		mobile_number: joi.string().pattern(/^\d{6,15}$/).trim().allow("", null),
		password: joi.string().min(8).max(128).when("login_type", {
			is: "s",
			then: joi.required(),
			otherwise: joi.forbidden()
		}),
		social_id: joi.string().max(255).when("login_type", {
			is: joi.valid("g", "f"),
			then: joi.required(),
			otherwise: joi.forbidden()
		})
	}).options({ stripUnknown: true })
), signUp);

/**
 * @swagger
 * /api/v1/auth/user/otp-verification:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp: { type: integer }
 *               email: { type: string, format: email, nullable: true }
 *               mobile: { type: string, nullable: true }
 *               country_code: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: OTP verification response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/otp-verification", checkApi, decryption, validateJoi(
	joi.object({
		otp: joi.number().integer().required(),
		email: joi.string().email().lowercase().trim().allow("", null),
		mobile: joi.string().pattern(/^\d{6,15}$/).trim().optional(),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().optional()
	}).options({ stripUnknown: true })
), otpVerification);

/**
 * @swagger
 * /api/v1/auth/user/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, enum: [signup, forgotpassword] }
 *               email: { type: string, format: email, nullable: true }
 *               mobile: { type: string, nullable: true }
 *               country_code: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Resend OTP response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/resend-otp", checkApi, decryption, validateJoi(
	joi.object({
		type: joi.string().valid("signup", "forgotpassword").required().messages({
			"any.only": "type must be signup or forgotpassword"
		}),
		email: joi.string().email().lowercase().trim().allow("", null),
		mobile: joi.string().pattern(/^\d{6,15}$/).trim().optional(),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().optional()
	}).options({ stripUnknown: true })
), resendOtp);

/**
 * @swagger
 * /api/v1/auth/user/forget-password:
 *   post:
 *     summary: Send forgot password OTP
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, nullable: true }
 *               mobile: { type: string, nullable: true }
 *               country_code: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Forgot password response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/forget-password", checkApi, decryption, validateJoi(
	joi.object({
		email: joi.string().email().lowercase().trim().allow("", null),
		mobile: joi.string().pattern(/^\d{6,15}$/).trim().allow("", null),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().allow("", null)
	}).options({ stripUnknown: true })
), forgetPassword);

/**
 * @swagger
 * /api/v1/auth/user/forget-otp-verify:
 *   post:
 *     summary: Verify forgot password OTP
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp: { type: integer }
 *               email: { type: string, format: email, nullable: true }
 *               mobile: { type: string, nullable: true }
 *               country_code: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Forgot OTP verify response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/forget-otp-verify", checkApi, decryption, validateJoi(
	joi.object({
		otp: joi.number().integer().required(),
		email: joi.string().email().lowercase().trim().allow("", null),
		mobile: joi.string().pattern(/^\d{6,15}$/).trim().optional(),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().optional()
	}).options({ stripUnknown: true })
), forgetOtpVerify);

/**
 * @swagger
 * /api/v1/auth/user/update-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, newPass]
 *             properties:
 *               user_id: { type: integer }
 *               newPass: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Password reset response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/update-password", checkApi, decryption, validateJoi(
	joi.object({
		user_id: joi.number().integer().positive().required(),
		newPass: joi.string().min(8).max(128).required()
	}).options({ stripUnknown: true })
), updatePass);


/**
 * @swagger
 * /api/v1/auth/user/signin:
 *   post:
 *     summary: User sign in
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, rider] }
 *               login_type: { type: string, enum: [s, g, f], nullable: true }
 *               email: { type: string, format: email, nullable: true }
 *               password: { type: string, nullable: true }
 *               mobile: { type: string, nullable: true }
 *               country_code: { type: string, nullable: true }
 *               social_id: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Sign in response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.post("/signin", checkApi, decryption, validateJoi(
    joi.object({
		role: joi.string().valid("user", "rider").required(),
		login_type: joi.string().valid("s", "g", "f").allow("", null),
        email: joi.string().email().lowercase().trim().allow("", null),
		password: joi.string().min(8).max(128).allow("", null),
        mobile: joi.string().pattern(/^\d{6,15}$/).trim().allow("", null),
        country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().allow("", null),
        social_id: joi.string().max(255).allow("", null),
    }).options({ stripUnknown: true })
), signIn);


/**
 * @swagger
 * /api/v1/auth/user/signout:
 *   get:
 *     summary: User sign out
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sign out response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.get("/signout", checkApi, checkToken, decryption, signOut);


/**
 * @swagger
 * /api/v1/auth/user/editprofile:
 *   patch:
 *     summary: Edit user profile
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, nullable: true }
 *               email: { type: string, format: email, nullable: true }
 *               country_code: { type: string, nullable: true }
 *               mobile_number: { type: string, nullable: true }
 *               social_id: { type: string, nullable: true }
 *               profile_pic: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Edit profile response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.patch("/editprofile", checkApi, checkToken, decryption, validateJoi(
	joi.object({
		username: joi.string().trim().max(64).allow("", null),
		email: joi.string().email().lowercase().trim().allow("", null),
		country_code: joi.string().pattern(/^\+\d{1,4}$/).trim().allow("", null),
		mobile_number: joi.string().pattern(/^\d{6,15}$/).trim().allow("", null),
		social_id: joi.string().trim().max(255).allow("", null),
		profile_pic: joi.string().trim().max(255).allow("", null)
	}).options({ stripUnknown: true })
), editProfile);

/**
 * @swagger
 * /api/v1/auth/user/update-password:
 *   patch:
 *     summary: Change password for logged in user
 *     tags: [Auth]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Change password response
 *       500:
 *         description: Internal server error
 */
userAuthRoutes.patch("/update-password", checkApi, checkToken, decryption, validateJoi(
	joi.object({
		oldPassword: joi.string().min(8).max(128).required(),
		newPassword: joi.string().min(8).max(128).required()
	}).options({ stripUnknown: true })
), changePassword);


module.exports = userAuthRoutes