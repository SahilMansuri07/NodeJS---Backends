const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../config/config.js');

// Standard Response Helper
const sendResponse = (res, statusCode, code, message, data = {}) => {
    return res.status(statusCode).json({
        code: code,
        message: message,
        data: data
    });
};


// API Key Validation 
const checkApiKey = (req, res, next) => {
    try {
        const reqApiKey = req.headers['api-key'];
        const apiKey = process.env.API_KEY;

        if (!reqApiKey || reqApiKey !== apiKey) {
            return sendResponse(res, 401, 0, "Invalid API Key or API Key is Missing");
        }

        next();
    } catch (error) {
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

//JWT Token Validation
const checkToken = async (req, res, next) => {
    try {
        req.loginUser = false;

        const token = req.headers['token'];

        if (!token) {
            return sendResponse(res, 401, 0, "Token is Missing");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const [device] = await db.query(
            `SELECT user_id FROM tbl_user_device WHERE user_token = ? AND is_active = 1 AND is_delete = 0`,
            [token]
        );

        if (device.length === 0) {
            return sendResponse(res, 401, 0, "Invalid Token or Session Expired");
        }

        req.loginUser = decoded;
        next();

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

//Joi Validation Middleware
const validateJoi = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);

        if (error) {
            return sendResponse(res, 400, 0, error.message);
        }

        req.body = value;
        next();
    };
};

module.exports = { checkApiKey, sendResponse, validateJoi, checkToken };