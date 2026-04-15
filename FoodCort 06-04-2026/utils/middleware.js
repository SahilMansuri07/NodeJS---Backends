const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const db = require("../config/database.js");
const { default: localizify  } = require("localizify");
const { t } = require("localizify");
const en = require('../language/en.js');
const chn = require('../language/chin.js');
const { common } = require("./common.js");
const cryptoLib = require('cryptlib');
const shaKey = cryptoLib.getHashSha256(process.env.KEY,32);
dotenv.config();

const sendResponse = async (req , res, statusCode, code, { keyword = "Failed" , component = {} },  data = {}) => {
    // console.log("lang fr ", req.headers['accept-language'])
    const formateMessage = await getMessage(req.headers['accept-language'] , keyword , component) ;
    // console.log(formateMessage)
    if(keyword == 'no_data'){
        code = 2 ;
    }

    //  let encrypted_data = { code: String(code), message: formateMessage, data: data };
     let encrypted_data = await encryption({code : String(code) , message : formateMessage , data : data} , req );
     console.log(encrypted_data)
    
    res.status(statusCode);
    res.send(encrypted_data);
};


// prepare message for response based on language
const getMessage = async (requestLang = "en" , key , value ) => {
    try {
        console.log("requestLang " , requestLang)
        localizify
            .add("en" , en)
            .add("chn" , chn)
            .setLocale(requestLang);
        // console.log("req lang" ,requestLang)
        let message = t(key , value)
        // console.log("message " ,message)

        return message
    } catch (error) {
        return "Something Went Wrong"
    }
}


const checkApi = (req, res, next) => {

    if (!req.headers['api-key']) {
        return sendResponse(req, res, 401, -1, { keyword: "Api_Key_Is_Missing", component: {} }, {})
    }
    const apiKey = req.headers['api-key']
    if (apiKey == process.env.API_KEY) {
       
        next()
    } else {
        return sendResponse(req, res, 401, -1, { keyword: "Invalid_Api_Key", component: {} }, {})
    }
}


const validateJoi = (schema, allowEmpty = false) => {
    return (req, res, next) => {
        if (!allowEmpty && (!req.body || Object.keys(req.body).length === 0)) {
            return sendResponse(req, res, 400, 2, { keyword: "Fields_Are_Empty" ,component : {} }, {});
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

            return sendResponse(req, res, 400, 2, { keyword: "Validation_Error", component: {} }, errors);
        }
        next()
    }
}



const encryption  = (responseData , req = null) => {
    console.log( "response Data" ,responseData)
    let encrypt = cryptoLib.encrypt(JSON.stringify(responseData) ,shaKey , process.env.IV)
    console.log("encrypt "  , encrypt)
    console.log(shaKey)
    console.log(process.env.IV)
    return encrypt
}

const decryption = ( req ,  res , next ) =>{
    console.log("req body ")
    try {
        if(req.body !== undefined && Object.keys(req.body).length !== 0){
          
            console.log("shaKey" , shaKey)
            console.log("IV" ,  process.env.IV)
           let value =  cryptoLib.decrypt(req.body , shaKey , process.env.IV);
           console.log(value)
              req.body = JSON.parse(value)
            next();
        }else{
            next();
        }
    } catch (error) {   
        res.status(200);
        console.log(error)
        res.json({ code : 0 , message : "badEncrypt" , });
    }
}


const checkToken = async function (req, res, next) {
    try {
        req.loginUser = false;

        const token = req.headers['token'] || req.headers['authorization']  ;
       console.log(token)  
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        
        let decoded;
        
        try {
            decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);
          //  console.log("decode user " , decoded)
           console.log("decode token" , bearerToken)
        } catch (err) {
           // console.log(err)
            if (err.name === "TokenExpiredError") {
                return sendResponse(req, res, 401, -1, { keyword: "Token_expired_Please_login_again", component: {} }, {});
            }
            return sendResponse(req, res, 401, -1, { keyword: "Invalid_token", component: {} }, {});
        }
      
        const device = await db.query(
            `SELECT id, user_id FROM tbl_user_device
             WHERE user_id=? AND token=? AND is_active=1 AND is_delete =0`,
            [decoded.id , bearerToken]
        );
        // console.log()
        console.log(device)
        if (!device[0] || device[0].length === 0) {
            return sendResponse(req, res, 200, 0 , { keyword: "Session_expired_Please_login_again", component: {} }, {});
        }
        console.log("device " , device[0][0].id)
        if (device[0] && device[0][0] && device[0][0].user_id) {
            const user = await common.getUser(device[0][0].user_id)
            console.log(user)

            if (!user || !user[0]) {
                return sendResponse(req, res, 401, -1, { keyword: "Unauthorized", component: {} }, {});
            }

            if (user[0].is_active == 0 || user[0].is_delete == 1) {
                return sendResponse(req, res, 200, 0, { keyword: "User_Locked", component: {} }, {});
            }
        }

        req.loginUser = decoded;
        // req.login_user_id = decoded.id;
        next();

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 401, -1, { keyword: "Unauthorized", component: {} }, {});
    }
};


module.exports = {
    sendResponse ,
    checkApi,
    validateJoi,
    checkToken,
    encryption,
    decryption
}