

function sendResponse(req , res, statusCode , code,  message , data = {}){
    return res.status(statusCode).json({
        code : code,
        message : message,
        data : data
    })
}

module.exports = {sendResponse}