const joi = require("joi")
const { checkApi, validateJoi, checkToken } = require("../../utils/middleware")
const { signUp, profileSetUp, forgotPassword, resendOtp, verifyOtp, updatePassword, changePassword, logout, signIn } = require("../../models/v1/auth_model")

const authRoute = require("express").Router()

authRoute.post("/signup", checkApi, validateJoi(joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    country_code: joi.string().required(),
    mobile_number: joi.string().required(),
    password: joi.string().required()
})
), signUp)

authRoute.post("/profileSetUp", checkApi, validateJoi(joi.object({
    user_id: joi.number().required(),
    full_name: joi.string().required(),
    dob: joi.string().required(),
    device_type: joi.string().required(),
    device_name: joi.string().required(),
    device_model: joi.string().required(),
    os_version: joi.string().required(),
    ip: joi.string().required()
})
), profileSetUp)

//signIn 
authRoute.post("/signIn", checkApi, validateJoi(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
    device_type: joi.string().required(),
    device_name: joi.string().required(),
    device_model: joi.string().required(),
    os_version: joi.string().required(),
    ip: joi.string().required()
})), signIn)

//forget Password
authRoute.post("/forgotPassword", checkApi, validateJoi(joi.object({
    email: joi.string().optional(),
    country_code:joi.string().optional(),
    phone:joi.string().optional()
})
,true), forgotPassword)

authRoute.post("/resendOtp", checkApi, validateJoi(
    joi.object({
        phone: joi.string().optional(),
        email:joi.string().optional()
    })
), resendOtp)

authRoute.post("/verifyOtp", checkApi, validateJoi(
    joi.object({
        email:joi.string().optional(),
        phone: joi.string().optional(),
        otp: joi.string().required()
    })
), verifyOtp)

authRoute.post("/updatePassword", checkApi, validateJoi(joi.object({
    id:joi.number().required(),
    newPassword: joi.string().required()
})
), updatePassword)

authRoute.post("/changePassword", checkApi, checkToken, validateJoi(joi.object({
    oldPass: joi.string().required(),
    newPass: joi.string().required()
})
), changePassword)

authRoute.get("/logout", checkApi, checkToken, logout)


module.exports = authRoute