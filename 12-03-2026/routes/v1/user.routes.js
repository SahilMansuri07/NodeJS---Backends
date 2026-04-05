const express = require('express')

const Joi = require('joi');
const { checkApiKey, checkToken, validateJoi } = require('../../utils/middleware');
const { getUserDetails, userProfile, toggleFollow, getFollowers, getFollowing } = require('../../models/v1/user-model');

const routes = express.Router()


routes.get('/getuser', checkApiKey, checkToken, getUserDetails)


routes.get('/userprofile' , checkApiKey , checkToken , userProfile)

routes.post('/togglefollow',
    validateJoi(Joi.object({
        receiver_user_id: Joi.number().required()
    })),
    checkApiKey, checkToken,
    toggleFollow)

routes.get('/followers',
    validateJoi(Joi.object({
        page: Joi.number().optional()
    })),
    checkApiKey, checkToken,
    getFollowers)

routes.get('/following',
    validateJoi(Joi.object({
        page: Joi.number().optional()
    })),
    checkApiKey, checkToken,
    getFollowing)

module.exports = routes