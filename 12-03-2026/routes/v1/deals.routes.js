const express = require('express')
const { getCategories, getDealsPosts, getdeal, getdealbyCategory, getallcomments, toggleBookmark, addComments, addRatings, getNotification, addReport, deleteComment, deleteNotification, getBookmarks, createPost, deletePost } = require('../../models/v1/deal-model')
const { checkApiKey, checkToken, validateJoi } = require('../../utils/middleware')
const Joi = require('joi')

const routes = express.Router()

routes.get('/getcategory', checkApiKey, checkToken, getCategories)

routes.post('/getdealslisting', validateJoi(Joi.object({
        category_id: Joi.number().optional(),
        page: Joi.number().optional(),
        minkm: Joi.number().optional(),
        maxkm: Joi.number().optional(),
    })),
    checkApiKey, checkToken,
    getDealsPosts)

routes.post('/getsingledeal', validateJoi(Joi.object({
        postId: Joi.number().required()
    })),
    checkApiKey, checkToken,
    getdeal)

routes.post('/getdealbycategory',
    validateJoi(Joi.object({
        categoryId: Joi.number().required()
    })),
    checkApiKey, checkToken,
    getdealbyCategory)

routes.get('/comments',
    validateJoi(Joi.object({
        postId: Joi.number().required()
    })),
    checkApiKey, checkToken,
    getallcomments)

routes.post('/addcomments',
    validateJoi(Joi.object({
        post_id: Joi.number().required(),
        description: Joi.string().required()
    })),
    checkApiKey, checkToken,
    addComments)

routes.post('/addratings',
    validateJoi(Joi.object({
        post_id: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required()
    })),
    checkApiKey, checkToken,
    addRatings)

routes.post('/togglebookmark',
    validateJoi(Joi.object({
        post_id: Joi.number().required()
    })),
    checkApiKey, checkToken,
    toggleBookmark)


routes.get('/getnotification',
    validateJoi(Joi.object({
        userId: Joi.number().required()
    })),
    checkApiKey, checkToken,
    getNotification)


routes.post('/addreport',
    validateJoi(Joi.object({
        post_id            : Joi.number().required(),
        report_description : Joi.string().valid(
            'inappropriate_and_abusive_content',
            'feels_like_spam',
            'inappropriate_photo'
        ).required(),
        others : Joi.string().optional()
    })),
    checkApiKey, checkToken,
    addReport)

routes.post('/deletecomment',
    validateJoi(Joi.object({
        comment_id: Joi.number().required()
    })),
    checkApiKey, checkToken,
    deleteComment)

routes.post('/deletenotification',
    validateJoi(Joi.object({
        notification_id: Joi.number().required()
    })),
    checkApiKey, checkToken,
    deleteNotification)

routes.post('/bookmarks' , checkApiKey , checkToken , getBookmarks)

routes.post('/createpost',
    validateJoi(Joi.object({
        title       : Joi.string().required(),
        description : Joi.string().required(),
        lat         : Joi.number().optional(),
        long        : Joi.number().optional(),
        website_url : Joi.string().optional(),
        images      : Joi.array().items(Joi.string()).min(1).required(),
        tags        : Joi.array().items(Joi.number()).optional()
    })),
    checkApiKey, checkToken,
    createPost)

routes.post('/deletepost',
    validateJoi(Joi.object({
        post_id: Joi.number().required() 
    })),
    checkApiKey, checkToken,
    deletePost )



module.exports = routes