const db = require("../../../config/database");
const { sendResponse } = require("../../../utils/middelware")

const addInterets = async (req ,res ) => {
    try {
         const { name } = req.body;

        const [exist] = await db.query(
            "SELECT id FROM  tbl_interest WHERE name = ? AND is_delete = 0",
            [name]
        );

        if (exist.length > 0) {
            return sendResponse(req, res, 200, 0, "Interest Already Exists", {});
        }

        const [insertData] = await db.query(
            `INSERT INTO  tbl_interest (name) VALUES (?)`,
            [name ]
        );

        if (insertData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Failed To Create Interest", {});
        }

        return sendResponse(req, res, 200, 1, "Interest Added Successfully", { });


    } catch (error) {
        console.log(error)
        return sendResponse(req , res , 500 , 0 , "Internal Server Error")
    }
}


const getInterest = async (req ,res ) => {
    try {

        const [listInterest] = await db.query(
            "SELECT * FROM  tbl_interest WHERE  is_active = 1",);

        if (listInterest.length > 0) {
            return sendResponse(req, res, 200, 1 ,  "Interest Details Fetched", {listInterest});
        
        }

        return sendResponse(req, res, 200, 0 , "No interest Found", { });


    } catch (error) {
        console.log(error)
        return sendResponse(req , res , 500 , 0 , "Internal Server Error")
    }
}


module.exports = {
    addInterets , 
    getInterest ,
   
} 