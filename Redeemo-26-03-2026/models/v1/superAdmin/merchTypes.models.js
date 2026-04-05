const db = require("../../../config/database");
const { sendResponse } = require("../../../utils/middelware");

const addCategory = async (req , res) => {
    try {
        
        const {name , image}  = req.body
        
        const [exist] = await db.query(`SELECT * FROM tbl_categories WHERE name = ?` , [name])
        if(exist.length > 0){
            return sendResponse(req, res, 200, 0, "Category Name Already Exists", {exist});
        }
        
        const [addCategory] = await db.query(`INSERT INTO tbl_categories (name , image) VALUES (? , ?)` , [name , image])
        if(addCategory.affectedRows > 0){
            return sendResponse(req, res , 200 , 1 , "Category Added Successfully " , {})
        }
        return sendResponse(req, res, 200, 0, "Error Adding Category Data ", {} );

    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

// ─── GET ALL CATEGORIES ───────────────────────────────────────────────────────
const getAllCategories = async (req, res) => {
    try {
        const { search, is_active } = req.query;

        let queryStr = `SELECT * FROM tbl_categories WHERE is_delete = 0`;
        const params = [];

        console.log(search)
        // Search by name
        if (search) {
            queryStr += ` AND name LIKE ?`;
            params.push(`%${search}%`);
        }
        // Filter by active status
        if (is_active !== undefined && is_active !== "") {
            queryStr += ` AND is_active = ?`;
            params.push(is_active);
        }

        queryStr += ` ORDER BY created_at DESC`;

        const [categories] = await db.query(queryStr, params);

        if (categories.length === 0) {
            return sendResponse(req, res, 200, 0, "No Categories Found", { categories: [] });
        }

        return sendResponse(req, res, 200, 1, "Categories Fetched Successfully", { categories });
        
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


const updateCategory = async (req, res) => {
    try {
        const {id , name, image, is_active } = req.body;
        
        if (!id) {
            return sendResponse(req, res, 200, 0, "Category ID Is Required", {});
        }
        

        // Check if another category with same name exists
        if (name) {
            const [nameExist] = await db.query(
                `SELECT * FROM tbl_categories WHERE name = ? AND id != ? AND is_delete = 0`,
                [name, id]
            );
            if (nameExist.length > 0) {
                return sendResponse(req, res, 200, 0, "Category Name Already Exists", {});
            }
        }
        
        // Build dynamic update query
        const fields = [];
        const params = [];

        if (name !== undefined)      { fields.push(`name = ?`);      params.push(name); }
        if (image !== undefined)     { fields.push(`image = ?`);     params.push(image); }
        if (is_active !== undefined) { fields.push(`is_active = ?`); params.push(is_active); }

        if (fields.length === 0) {
            return sendResponse(req, res, 200, 0, "No Fields Provided To Update", {});
        }
        
        params.push(id);
        
        const [updateData] = await db.query(
            `UPDATE tbl_categories SET ${fields.join(", ")} WHERE id = ? AND is_delete = 0`,
            params
        );

        if (updateData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Error Updating Category", {});
        }
        
        const [updatedCategory] = await db.query(
            `SELECT * FROM tbl_categories WHERE id = ?`,
            [id]
        );
        
        return sendResponse(req, res, 200, 1, "Category Updated Successfully", {  updatedCategory });

    } catch (error) {
        console.error("Error in updateCategory:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};



const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return sendResponse(req, res, 200, 0, "Category ID Is Required", {});
        }

        // Check category exists
        const [categoryExist] = await db.query(
            `SELECT * FROM tbl_categories WHERE id = ? AND is_delete = 0`,
            [id]
        );
        if (categoryExist.length === 0) {
            return sendResponse(req, res, 200, 0, "Category Not Found", {});
        }

        // Soft delete
        const [deleteData] = await db.query(
            `UPDATE tbl_categories SET is_active = 0 AND is_delete = 1 WHERE id = ?`,
            [id]
        );

        if (deleteData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Error Deleting Category", {});
        }
        
        return sendResponse(req, res, 200, 1, "Category Deleted Successfully", {});
        
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


// aminities Crud 
const addAminities = async (req , res) => {
    try {
        const {name , image}  = req.body
        
        const [exist] = await db.query(`SELECT * FROM tbl_amenities WHERE name = ?` , [name])
        if(exist.length > 0){
            return sendResponse(req, res, 200, 0, "Amenities Name Already Exists", {exist});
        }
        
        const [addAmenities] = await db.query(`INSERT INTO tbl_amenities (name , image) VALUES (? , ?)` , [name , image])
        if(addAmenities.affectedRows > 0){
            return sendResponse(req, res , 200 , 1 , "Amenities Added Successfully " , {})
        }
        return sendResponse(req, res, 200, 0, "Error Adding Amenities Data ", {} );
        
    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}

const getAllAminities = async (req ,res ) => {
    try {
        
        const [getAminities] = await db.query(`SELECT * FROM tbl_amenities WHERE is_active = 1 AND is_delete = 0`)

        if(getAminities && getAminities.length > 0) {
            return sendResponse(req, res, 200, 1, "Aminities Fetched Successfully", { getAminities });
        }
        return sendResponse(req, res, 200, 0, "No Aminities Found", { });

    } catch (error) {
        console.error("Error in signIn:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error");
    }
}


const deleteAminities = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return sendResponse(req, res, 200, 0, "Aminities ID Is Required", {});
        }

        // Check Aminities exists
        const [AminitiesExist] = await db.query(
            `SELECT * FROM tbl_amenities WHERE id = ? AND is_delete = 0`,
            [id]
        );
        if (AminitiesExist.length === 0) {
            return sendResponse(req, res, 200, 0, "Amenities Not Found", {});
        }

        // Soft delete
        const [deleteData] = await db.query(
            `UPDATE tbl_amenities SET is_active = 0 AND is_delete = 1 WHERE id = ?`,
            [id]
        );

        if (deleteData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Error Deleting Amenities", {});
        }
        
        return sendResponse(req, res, 200, 1, "Amenities Deleted Successfully", {});
        
    } catch (error) {
        console.error("Error in delete Amenities:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};


const updateAminities = async (req, res) => {
    try {
        const { id , name , image} = req.body;

        if (!id) {
            return sendResponse(req, res, 200, 0, "Aminities ID Is Required", {});
        }

        // Check Aminities exists
        const [getAminities] = await db.query(
            `SELECT * FROM tbl_amenities WHERE id = ? AND is_delete = 0`,
            [id]
        );
        if (getAminities.length === 0) {
            return sendResponse(req, res, 200, 0, "Amenities Not Found", {});
        }

        // Soft delete
        const [updateData] = await db.query(
            `UPDATE tbl_amenities SET name = ? , image = ?  WHERE id = ?`,
            [name , image , id]
        );

        if (updateData.affectedRows === 0) {
            return sendResponse(req, res, 200, 0, "Error Deleting Amenities", {});
        }
        
        return sendResponse(req, res, 200, 1, "Amenities Updated Successfully", {});
        
    } catch (error) {
        console.error("Error in Updating Amenities:", error);
        return sendResponse(req, res, 500, 0, "Internal Server Error", {});
    }
};





module.exports = {
    addCategory ,
    addAminities,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getAllAminities,
    deleteAminities ,
    updateAminities
}
