const express = require('express');

const routes = express.Router()
const Joi = require('joi');
const { checkApiKey, validateJoi, checkToken } = require('../../utils/middleware.js');
const { signUp, signIn, otpVerification, resendOtp, setUserDetails, forgetPass, passwordVerify, updatePassword, editProfile, changePassword, logOut } = require('../../models/v1/auth-models.js')




routes.post('/signUp',validateJoi(
    Joi.object({
    username : Joi.string().required(),
    country_code : Joi.string().required(),
    mobile :Joi.string().required(),  
    email: Joi.string().required(),
    referral_code: Joi.string(),
    password: Joi.string().required()
    })
), checkApiKey , signUp);

routes.post('/signIn',
checkApiKey,
validateJoi(
    Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
), checkApiKey , 
signIn);

routes.post('/otpVerification',
validateJoi(
    Joi.object({
        otp: Joi.string().length(4).required(),
        mobile: Joi.string().required()
    })
), checkApiKey ,
otpVerification);


routes.post('/resendOtp',validateJoi(
    Joi.object({
        userId: Joi.number().required(),
        type: Joi.string().valid('register','forgot_password').required()
    })
),checkApiKey ,resendOtp);

routes.patch('/setUserDetails' ,
//     ,
// validateJoi(
//     Joi.object({
//         first_name: Joi.string().required(),
//         last_name: Joi.string().required(),
//         bio: Joi.string().required(),
//         profile_pic: Joi.string().required(),
//         banner_pic: Joi.string().required(),
//         id: Joi.number().required()
//     })
// ),
 checkApiKey ,
setUserDetails );

routes.post('/forgetPass', checkApiKey ,forgetPass);

routes.post('/passwordVerify',
validateJoi(
    Joi.object({
        otp: Joi.string().length(4).required(),
        mobile: Joi.string().required()
    })
), checkApiKey ,
passwordVerify);

routes.patch('/updatePassword',
validateJoi(
    Joi.object({
        forgetuserid: Joi.number().required(),
        password: Joi.string().min(6).required()
    })
), checkApiKey ,
updatePassword);

routes.get('/logOut' , checkApiKey ,checkToken , logOut )

routes.post('/editprofile' ,
validateJoi(
    Joi.object({
        username : Joi.string().required(),
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        country_code : Joi.string().required(),
        mobile : Joi.string().min(10).required(),
        email :Joi.string().email().required(),
        bio: Joi.string().required(),
        profile_pic: Joi.string().required(),
    })
)  ,checkApiKey ,checkToken , editProfile )

routes.post('/changePass', validateJoi(
    Joi.object({
        old_pass : Joi.string().required() ,
        new_pass : Joi.string().required()
    })
)  , checkApiKey ,checkToken , changePassword )

module.exports = routes