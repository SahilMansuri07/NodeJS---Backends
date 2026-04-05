const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const db = require("../config/db");
const common = require("./common");

dotenv.config();

const checkApi = (req, res, next) => {

    if (!req.headers['api-key']) {
        return sendResponse(req, res, 401, -1, "Api Key Is Missing", {})
    }
    const apiKey = req.headers['api-key']
    if (apiKey == process.env.API_KEY) {
        next()
    } else {
        return sendResponse(req, res, 401, -1, "Invalid Api Key", {})
    }
}

const sendResponse = (req, res, statuscode, responsecode, message, responsedata) => {
    let data = {
        code: responsecode,
        message: message,
        data: responsedata
    }

    res.status(statuscode).send(data)
}

const validateJoi = (schema, allowEmpty = false) => {
    return (req, res, next) => {
        if (!allowEmpty && (!req.body || Object.keys(req.body).length === 0)) {
            return sendResponse(req, res, 400, 2, "Fields Are Empty", {});
        }

        // console.log(req.body)

        const { error } = schema.validate(req.body, {
            abortEarly: false
        })

        // console.log(error)

        if (error) {
            const errors = {}

            error.details.forEach(err => {
                errors[err.path[0]] = err.message.replace(/"/g, '');
            })

            return sendResponse(req, res, 400, 2, errors, {});
        }
        next()
    }
}

const checkToken = async function (req, res, next) {
    try {
        req.loginUser = false;

        const token = req.headers['authorization'] ;
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        
        let decoded;
        
        try {
            decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);
            // console.log(decoded)
        } catch (err) {
            console.log(err)
            if (err.name === "TokenExpiredError") {
                return sendResponse(req, res, 401, -1, "Token expired. Please login again", {});
            }
            return sendResponse(req, res, 401, -1, "Invalid token", {err});
        }

        
        const device = await db.query(
            `SELECT id FROM tbl_user_device 
             WHERE user_id=? AND token=? AND is_active=1 AND is_deleted=0`,
            [decoded.data.user_id, bearerToken]
        );

        if (!device[0] || device[0].length === 0) {
            return sendResponse(req, res, 401, -1, "Session expired, Please login again", {});
        }

        if (device[0] && device[0][0] && device[0][0].id) {
            const user = await common.getUser(device[0][0].id)
            if (user.is_active == 0 || user.is_delete == 1) {
                return sendResponse(req, res, 200, 0, "User Locked", {});
            }
        }

        req.loginUser = decoded;
        next();

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 401, -1, "Unauthorized", {});
    }
};

module.exports = { checkApi, sendResponse, validateJoi, checkToken }