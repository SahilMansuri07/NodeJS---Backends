const express = require('express')
const { getCategories, getDealsPosts, getUserDetails , getdeal, getdealbyCategory, getallcomments}  = require('./deal-model')


const routes = express.Router()

routes.get('/getuser' , getUserDetails)
routes.get('/getcategory' , getCategories)
routes.get('/getdealsDetails' , getDealsPosts)
routes.get('/getdeal' , getdeal)
routes.get('/dealsbycategory' , getdealbyCategory)
routes.get('/comments' , getallcomments)
module.exports = routes