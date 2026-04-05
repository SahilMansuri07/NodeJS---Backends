const joi = require("joi")
const { checkApi, validateJoi, checkToken } = require("../../utils/middleware")
const { getUserProfile, toggleFollow, updateProfile, userSavePostList, followerList, followingList, contactUs } = require("../../models/v1/user_model")
 
const userRoute = require("express").Router()
 
userRoute.get("/getUserProfile", checkApi, checkToken, getUserProfile)
userRoute.post("/followUnfollowUser", checkApi, checkToken, validateJoi(
    joi.object({
        other_user_id: joi.number().required()
    })
), toggleFollow)
 
 
userRoute.post("/updateProfile", checkApi, checkToken, validateJoi(
    joi.object({
        full_name: joi.string().optional(),
        email: joi.string().email().optional(),
        username: joi.string().optional(),
        country_code:joi.string().optional(),
        phone: joi.number().optional(),
        profile_photo: joi.string().optional(),
        dob: joi.date().optional()
    })
), updateProfile)
 
userRoute.post("/userSavePostList", checkApi, checkToken,validateJoi(
    joi.object({
        page: joi.number().optional(),
        size: joi.number().optional()
    })
,true), userSavePostList)
 
userRoute.post("/followerList", checkApi, checkToken, validateJoi(
    joi.object({
        user_id: joi.number().required()
    })
), followerList)
 
userRoute.post("/followingList", checkApi, checkToken, validateJoi(
    joi.object({
        user_id: joi.number().required()
    })
), followingList)
 
userRoute.post("/contactUs",checkApi,checkToken,validateJoi(
    joi.object({
        full_name:joi.string().required(),
        email:joi.string().email().required(),
        subject:joi.string().required(),
        description:joi.string().required()
    })
),contactUs)
 
module.exports = userRoute