import localizify from "localizify";
import Codes from "../config/status_codes.js";
const { default: local , t } = localizify;
import dotenv from "dotenv";
import en from "../languages/en.js";
import ar from "../languages/ar.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import common from "../config/common.js";
import db from "../config/db.js";
import e from "express";
dotenv.config();

local
  .add("en", en)
  .add("ar", ar);

  let is_lang = "en";
const key = process.env.KEY || "";
const iv = process.env.IV || "";
const bypassRoutes = [
    "/api/v1/auth/login",
    "/api/v1/auth/add-address",
    "/api/v1/auth/validate-user",
    "/api/v1/auth/request-otp",
    "/api/v1/auth/verify-otp",
    "/api/v1/auth/resend-otp",
    "/api/v1/auth/forget-password",
    "/api/v1/auth/verify-forget-password-otp",
    "/api/v1/auth/reset-password",
    "/api/v1/auth/logout",
    "/api/v1/user/faq-listing",
    "/api/v1/user/contact-us",
]

const resolveMessage = (responseMessage) => {
    if (!responseMessage) {
        return { keyword: '', components: {} };
    }
 
    if (typeof responseMessage === 'string') {
        const entry = Object.entries(en).find(([, value]) => value === responseMessage);
        return { keyword: entry ? entry[0] : responseMessage, components: {} };
    }
 
    if (typeof responseMessage === 'object') {
        return {
            keyword: responseMessage.keyword || responseMessage.message || '',
            components: responseMessage.components || {},
        };
    }
 
    return { keyword: '', components: {} };
};

const getMessage = (requestLanguage, keywords, components, callback) => {
    local.setLocale(requestLanguage || 'en');
    const returnmessage = t(keywords, components);
    callback(returnmessage);
};
 
const extractHeaderLanguage = (req, res, next) => {
    const headerLang = (req.headers['accept-language'] || 'en').split(',')[0].split('-')[0].toLowerCase();
    console.log("Extracted header language: ", headerLang);
    req.lang = headerLang === 'ar' ? 'ar' : 'en';
    res.locals.language = req.lang;
    is_lang = req.lang;
    local.setLocale(req.lang);
    req.getTranslation = (key, components = {}) => t(key, components);
    next();
};
 
const getHeaderLanguage = () => {
    return is_lang;
};

 
// const verifykey = (req, res, next) => {
//     const apiKey = req.headers['api-key'];
//     if (!apiKey || apiKey !== process.env.API_KEY) {
//         const language = (res.locals && res.locals.language) || getHeaderLanguage() || 'en';
//         local.setLocale(language);
//         const unauthorizedMessage = t('rest_keywords_unauthorized');
//         return res.status(Codes.RESPONSE_Codes.ERROR.UNAUTHORIZED.code).json({
//             code: Codes.APP_RESPONSE_CODE.FAILED,
//             message: unauthorizedMessage
//         });
//     }
//     next();
// };

// const sendResponse = async ( req,res,statuscode,responsecode,responsemessage,response_data,) => {
    
//       const translated_message = t(
//         responsemessage.keyword,
//         responsemessage.components || {},
//       );
    
//       if (response_data != null) {
//         response_data = {
//           code: responsecode,
//           message: translated_message,
//           data: response_data,
//         };
    
//         // const encrypted = await encryption(response_data);
//         res.status(statuscode);
//         res.json(response_data);
//       } else {
//         response_data = { code: responsecode, message: translated_message };
    
//         // const encrypted = await encryption(response_data);
//         res.status(statuscode);
//         res.json(response_data);
//       }
//     };

const sendApiResponse = async (res, httpStatus = Codes.SUCCESS , resCode, msgKey, resData ) => {
    const language = (res.locals && res.locals.language) || "en";
    local.setLocale(language);
    const { keyword, components } = resolveMessage(msgKey);

    const responsejson = {
    code: resCode,
    message: t(keyword, components),
    };
    if (resData != null) {
    responsejson.data = resData;    
    }

    // const encryptedResponse = await encryption(responsejson);
    res.status(httpStatus);
    res.json(responsejson);
};

const validateJoi = (schema, allowEmpty = false) => {
    return (req, res, next) => {
        if (!allowEmpty && (!req.body || Object.keys(req.body).length === 0)) {
            return sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "rest_keywords_required_fields_missing",
                null,
            );
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = {};
            error.details.forEach((err) => {
                const field = err.path && err.path.length ? err.path[0] : "field";
                errors[field] = err.message.replace(/"/g, "");
            });

            return sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "rest_keywords_required_fields_missing",
                errors,
            );
        }

        req.body = value;
        return next();
    };
};

async function tokenMiddleware (req, res, next) {
    // check if route should bypass
    const requestPath = (req.originalUrl || req.url || req.path || "").split("?")[0];
    if (bypassRoutes.some((route) => requestPath.startsWith(route))) {
        return next(); // skip API key check
    }

      const token = req.headers['token'] || req.headers['authorization']  ;
    //    console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        
        let decoded;
        
        try {
            decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);
          //  console.log("decode user " , decoded)
           // console.log("decode token" , bearerToken)
        } catch (err) {
           // console.log(err)
            if (err.name === "TokenExpiredError") {
                return sendApiResponse(
                    res,
                    Codes.UNAUTHORIZED,
                    Codes.INVALID_TOKEN,
                    "Token_expired_Please_login_again",
                    null,
                );
            }
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_TOKEN,
                "Invalid_token",
                null,
            );
        }
          const tableName = (decoded.role === "admin" || decoded.role === "superadmin") 
            ? "tbl_admin_device" 
            : "tbl_user_device";

            
            const id = (decoded.role === "admin" || decoded.role === "superadmin") 
            ? "admin_id" 
            : "user_id";
        const device = await db.query(
            `SELECT id FROM ${tableName} 
             WHERE ${id}=? AND token=? AND is_active=1 AND is_delete =0`,
            [decoded.id, bearerToken]
        );
        // console.log()
        // console.log(device)
        if (!device[0] || device[0].length === 0) {
            return sendApiResponse(res, Codes.SUCCESS , Codes.UNAUTHORIZED, "You_Are_Not_Logged_In", null);
        }

        if (device[0] && device[0][0] && device[0][0].id) {
            const user = await common.getUserDetails(device[0][0].id)
            // console.log(user)
            if (user.is_active == 0 || user.is_delete == 1) {
                return sendApiResponse(res, Codes.SUCCESS , Codes.UNAUTHORIZED, "rest_keywords_unauthorized", null);
            }
        }

        req.loginUser = decoded;
        next();
}



const checkApi = (req, res, next) => {
    try {
        // const requestPath = (req.originalUrl || req.url || req.path || "").split("?")[0];
        // if (bypassRoutes.some((route) => requestPath.startsWith(route))) {
        //     return next();
        // }

        const apiKey = req.headers['api-key'];
        // console.log("Received API key: ", apiKey);
        if (!apiKey || apiKey !== process.env.API_KEY) {
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_APIKEY,
                "rest_keywords_unauthorized",
                null
            );
        }
        next();
    } catch (error) {
        console.log("Error in API key verification: ", error);
        return sendApiResponse(
            res,
            Codes.UNAUTHORIZED,
            Codes.INVALID_APIKEY,
            "rest_keywords_unauthorized",
            null
        );
    }
}

const encryption = async (req) => {
    // Implement your encryption logic here
    try {
        const key = CryptoJS.enc.Utf8.parse(process.env.KEY || "");
        const iv = CryptoJS.enc.Utf8.parse(process.env.IV || "");

        if (!process.env.KEY || !process.env.IV) {
            throw new Error("Missing KEY or IV in environment variables");
        }

        if(typeof req === 'object') {
            req = JSON.stringify(req);
        }
        const encryptedData = CryptoJS.AES.encrypt(req, key, {
            iv: iv,
          }).toString();
        return encryptedData;
    } catch (error) {
        console.log("Error in encryption: ", error);
        throw new Error("Encryption failed");
    }
}

const decryption = (req, res, next) => {
    if (req.body && Object.keys(req.body).length !== 0) {
        let encryptedBody = "";

        if (typeof req.body === "string") {
            encryptedBody = req.body;
        } else if (typeof req.body.data === "string") {
            encryptedBody = req.body.data;
        } else if (typeof req.body.payload === "string") {
            encryptedBody = req.body.payload;
        } else {
            // Request body is plain JSON, so skip AES decryption.
            return next();
        }

        const decryptedData = CryptoJS.AES.decrypt(
            encryptedBody,
            CryptoJS.enc.Utf8.parse(key),
            { iv: CryptoJS.enc.Utf8.parse(iv) },
        ).toString(CryptoJS.enc.Utf8);
 
    let decryptionSend;
 
    try {
      decryptionSend = JSON.parse(decryptedData);
    } catch (error) {
      console.log("Error parsing decrypted data:", error.message);
      return sendApiResponse(
        res,
                Codes.SUCCESS,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
        null,
      );
    }
 
    req.body = decryptionSend;
    return next();
  }
 
  return next();
};

export default {
    // sendResponse,
    resolveMessage,
    getMessage ,
    extractHeaderLanguage,
    getHeaderLanguage,
    sendApiResponse ,
    checkApi ,
    tokenMiddleware,
    decryption,
    validateJoi,
}