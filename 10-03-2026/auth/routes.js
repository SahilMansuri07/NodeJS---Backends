const express = require('express');

const routes = express.Router()

const {signup, otpVerification, personalDetails, forgetpass, login, resendOtp , passwordverify, matchpassword } = require('./auth-models.js');

routes.post('/signup' , signup)
routes.post('/otp' , otpVerification)
routes.post('/resendOtp' , resendOtp)
routes.post('/personaldetails' , personalDetails )
routes.post('/forgetpass' , forgetpass)
routes.post('/passwordverify' , passwordverify)
routes.post('/compairpass' , matchpassword)
routes.get('/login' , login)

module.exports = routes