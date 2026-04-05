const db = require('../database/database.js')
const {SingleQuery} = require('../constrain.js')
                
// GET /user/
const getUserDetails = (req, res) => {
    const id = req.body.id; 
    const query = `SELECT * FROM tbl_user WHERE id = ?`;

    db.query(query, [id], (error, userData) => {
        if (error) return res.status(500).json({ error, message: "Database error" });
        if (userData.length === 0) return res.status(404).json({ message: "User not found" });

        res.json({
            message: "User details fetched",
            data: userData[0]  
        });
    });
};

// GET /categories
const getCategories = (req, res) => {
    const query = `
        SELECT count(p.title) as Total_deals , p.title, b.category_id, c.name, c.image_url 
        FROM tbl_deals_post p 
        JOIN tbl_user u ON u.id = p.user_id 
        JOIN tbl_business b ON b.user_id = u.id 
        JOIN tbl_deals_category c ON c.id = b.category_id 
        WHERE c.is_active = 1 
        GROUP BY c.name`;

    db.query(query, (error, categoryData) => {
        if (error) return res.status(500).json({ error, message: "Category fetch error" });
        
        res.json({
            message: "Categories fetched",
            data: categoryData
        });
    });
};


// GET /posts
const getDealsPosts = (req, res) => {
    const postQuery = `
        SELECT  
            u.first_name, u.profile_pic, p.id, p.title, 
            DATE_FORMAT(p.created_at, '%d %M %Y %h %i %p') as date,  
            b.address, 
            ROUND((6371 * ACOS(COS(RADIANS(u.latitude)) * COS(RADIANS(p.lat)) 
            * COS(RADIANS(p.long) - RADIANS(u.longitude)) + SIN(RADIANS(u.latitude)) 
            * SIN(RADIANS(p.lat)))), 1) as Nearest, 
            (SELECT GROUP_CONCAT(pi.media_url) FROM tbl_deals_post_image pi WHERE pi.post_id = p.id) as postImage, 
            (SELECT COUNT(*) FROM tbl_post_comments pc WHERE pc.post_id = p.id) as total_comments, 
            (SELECT AVG(pr.rating) FROM tbl_post_rating pr WHERE pr.post_id = p.id) as Rating  
        FROM tbl_deals_post p  
        JOIN tbl_user u ON u.id = p.user_id 
        JOIN tbl_business b ON b.user_id = u.id 
        JOIN tbl_deals_category c ON c.id = b.category_id  
        WHERE p.is_active = 1 
        ORDER BY Nearest`;

    db.query(postQuery, (error, postsData) => {
        if (error) return res.status(500).json({ error, message: "Post fetch error" });

        res.json({
            message: "Posts fetched successfully",
            data: postsData
        });
    });
};

// get singledeal
const getdeal = async (req , res ) => {
      const postId = req.body.postId
      const userId = req.body.userId
      console.log(postId)
    
      const data = await SingleQuery({postId , userId} , req , res)
    
        if (data.length > 0) {
            return res.json({
                code : 0,
                message : "Single Post Detail Fetch",
                data : data
            })
        } else {
           return res.json({
                code : 1,
                message : "Failed Getting Post"
            })
        }
}

// Get deal By Category
const getdealbyCategory = async (req , res) => {
    const categoryId = req.body.categoryId
    const categoryData = await SingleQuery({categoryId} , req , res)
        if (categoryData.length > 0) {
            return res.json({
                code : 1,
                message : "single Category Data with Post",
                data : categoryData
            })
        } else {
           return res.json({
                code : 0,
                message : "Failed to get Data ",
            })
        }
}

//post commetns 
const getallcomments = (req , res) => {
    let commentsData = {}
    const postId = req.body.postId
    const postq = `
    SELECT  
    p.id,  
    p.title , 
    u.first_name,  
    DATE_FORMAT(  
        p.created_at,  
        '%d %M %Y %h %i %p'  
    ) AS DATE, 
    pi.media_url 
    FROM tbl_deals_post p
    JOIN tbl_user u ON u.id = p.user_id
    JOIN tbl_deals_post_image pi ON pi.post_id = p.id 
    WHERE p.id = ? AND p.is_active = 1 LIMIT 1;      
    `
    db.query(postq , [postId] , (error , postData) => {
        // console.log(error , postData);
        if(postData.length > 0) {
            commentsData.postData = postData
            
        }else{
            res.json({
                code : 1,
                message : `Error Getting Post Data : ${error}`
            })
        }
    })

    const commentsq = `
    SELECT 
    pc.id AS comment_id, 
    pc.description, 
    u.profile_pic, 
    DATE_FORMAT(pc.created_at,'%d %M %Y %h:%i %p') AS date, 
    u.first_name, 
    u.id AS user_id 
FROM tbl_post_comments pc 
LEFT JOIN tbl_user u ON u.id = pc.user_id 
WHERE pc.post_id = ?
ORDER BY pc.created_at DESC;       
    `
    db.query(commentsq , [postId], (error , comData) => {
        // console.log(error , postData);
        if(comData.length > 0) {
            commentsData.comData = comData
            return res.json({
                code : 1,
                message : `Comments Data Fetch`,
                data : commentsData
            })
        }else{
            res.json({
                code : 1,
                message : `Error Getting Post Data : ${error}`
            })
        }
    })
}


module.exports = {getCategories , getDealsPosts , getUserDetails , getdeal , getdealbyCategory , getallcomments}