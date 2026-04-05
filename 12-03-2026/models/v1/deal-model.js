const db = require('../../config/config.js');
const { commonApiFunctions } = require('../../utils/common.js');
const { sendResponse } = require('../../utils/middleware.js');


// GET /categories
const getCategories = async (req, res) => {
    try {
        const [categoryData] = await db.query(`
            SELECT count(p.title) as Total_deals, p.title, b.category_id, c.name, c.image_url 
            FROM tbl_deals_post p 
            JOIN tbl_user u ON u.id = p.user_id 
            JOIN tbl_business b ON b.user_id = u.id 
            JOIN tbl_deals_category c ON c.id = b.category_id 
            WHERE c.is_active = 1 
            GROUP BY c.name`
        );

        if (categoryData.length > 0) {
            return sendResponse(res, 200, 1, "Categories Fetched", categoryData);
        }

        return sendResponse(res, 200 , 3, "No Category Data Found");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// // GET /posts
const getDealsPosts = async (req, res) => {
    try {
        let { category_id, page, minkm, maxkm } = req.body;
        const limit = 10;
        const offset = ((page || 1) - 1) * limit;
        const user_id = req.loginUser.id;

        let dealsQuery = `
            SELECT
                p.id AS post_id,
                p.title AS deal_title,
                p.description AS deal_description,
                p.created_at AS deal_date,
                b.company_name AS business_name,
                b.profile_pic AS business_logo,
                b.address AS location_name,
                (
                    SELECT media_url FROM tbl_deals_post_image
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                    LIMIT 1
                ) AS deal_image,
                (
                    SELECT COUNT(*) FROM tbl_post_comments
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                ) AS total_comments,
                (
                    SELECT COALESCE(AVG(rating), 0) FROM tbl_post_rating
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                ) AS avg_rating,
                COALESCE(s.is_save, 0) AS is_saved,
                ROUND(
                    6371 * ACOS(
                        COS(RADIANS(login_user.latitude))
                        * COS(RADIANS(p.lat))
                        * COS(RADIANS(p.long) - RADIANS(login_user.longitude))
                        + SIN(RADIANS(login_user.latitude))
                        * SIN(RADIANS(p.lat))
                    ),
                1) AS distance_km
            FROM tbl_deals_post p
            JOIN tbl_user u ON p.user_id = u.id
            JOIN tbl_business b ON u.id = b.user_id AND b.is_active = 1 AND b.is_delete = 0
            JOIN (SELECT id, latitude, longitude FROM tbl_user WHERE id = ?) AS login_user
            LEFT JOIN tbl_post_saved s ON s.user_id = login_user.id AND p.id = s.post_id AND s.is_save = 1
            WHERE p.is_active = 1 AND p.is_delete = 0
        `;

        let params = [user_id];

        if (category_id) {
            dealsQuery += " AND b.category_id = ?";
            params.push(category_id);
        }

        if (minkm && maxkm) {
            dealsQuery += " HAVING distance_km BETWEEN ? AND ? "
            params.push(minkm, maxkm)
        }
        dealsQuery += " ORDER BY distance_km ASC LIMIT ? OFFSET ?";
        params.push(limit, offset);


        const [deals] = await db.query(dealsQuery, params);

        if (deals.length === 0)
            return sendResponse(res, 404, 3, "No Data Found");

        return sendResponse(res, 200, 1, "Deals Fetched Successfully", {
            currentPage: page || 1,
            deals: deals,
        });

    } catch (err) {
        console.error(err);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// GET single deal
const getdeal = async (req, res) => {
    try {
        const userId = req.loginUser.id;
        const { postId } = req.body;
        console.log(userId, "user id", postId, "postid")
        if (!postId) {
            return sendResponse(res, 400, 2, "Missing Field");
        }

        const data = await commonApiFunctions.SingleQuery({ postId, userId }, req, res);

        if (data.length > 0) {
            return sendResponse(res, 200, 1, "Single Post Detail Fetched", data);
        }

        return sendResponse(res, 404, 3, "No Data Found");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// GET deals by category
const getdealbyCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return sendResponse(res, 400, 2, "Missing Field");
        }

        const categoryData = await commonApiFunctions.SingleQuery({ categoryId }, req, res);

        if (categoryData.length > 0) {
            return sendResponse(res, 200, 1, "Category Data With Posts Fetched", categoryData);
        }
        return sendResponse(res, 404, 3, "No Data Found");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// GET all comments for a post
const getallcomments = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId)
            return sendResponse(res, 400, 2, "Missing Field");

        const [postData] = await db.query(`
            SELECT  
                p.id, p.title, u.first_name,  
                DATE_FORMAT(p.created_at, '%d %M %Y %h %i %p') AS date, 
                pi.media_url 
            FROM tbl_deals_post p
            JOIN tbl_user u ON u.id = p.user_id
            JOIN tbl_deals_post_image pi ON pi.post_id = p.id 
            WHERE p.id = ? AND p.is_active = 1 
            LIMIT 1`,
            [postId]
        );

        if (postData.length === 0) {
            return sendResponse(res, 404, 3, "No Data Found");
        }

        const [comData] = await db.query(`
            SELECT 
                pc.id AS comment_id, pc.description, u.profile_pic, 
                DATE_FORMAT(pc.created_at, '%d %M %Y %h:%i %p') AS date, 
                u.first_name, u.id AS user_id 
            FROM tbl_post_comments pc 
            LEFT JOIN tbl_user u ON u.id = pc.user_id 
            WHERE pc.post_id = ?
            ORDER BY pc.created_at DESC`,
            [postId]
        );

        if (comData.length > 0) {
            return sendResponse(res, 200, 1, "Comments Fetched", { postData: postData[0], comData });
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// POST /bookmark 
const toggleBookmark = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { post_id } = req.body;

        if (!post_id) {
            return sendResponse(res, 400, 2, "Missing Field");
        }


        // Check if bookmark record already exists
        const [existing] = await db.query(
            `SELECT id, is_save FROM tbl_post_saved WHERE user_id = ? AND post_id = ?`,
            [user_id, post_id]
        );

        if (existing.length > 0) {
            // Toggle is_save value
            const newStatus = existing[0].is_save === 1 ? 0 : 1;

            await db.query(
                `UPDATE tbl_post_saved SET is_save = ?, updated_at = NOW() WHERE user_id = ? AND post_id = ?`,
                [newStatus, user_id, post_id]
            );

            const message = newStatus === 1 ? "Post Bookmarked Successfully" : "Post Unbookmarked Successfully";
            return sendResponse(res, 200, 1, message, { is_saved: newStatus });

        } else {
            // Insert new bookmark record
            await db.query(
                `INSERT INTO tbl_post_saved (user_id, post_id, is_save, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())`,
                [user_id, post_id]
            );

            return sendResponse(res, 200, 1, "Post Bookmarked Successfully", { is_saved: 1 });
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// Add comments Details 
const addComments = async (req, res) => {
    try {
        const user_id = req.loginUser.id
        const { post_id } = req.body
        const {
            description
        } = req.body

        const [postData] = await db.query(`SELECT * FROM tbl_deals_post WHERE id = ? AND is_active = 1`, [post_id])
        if (postData.length === 0) {
            return sendResponse(res, 404, 3, "No Post Founded Added");
        }
        const [commentsadd] = await db.query(`INSERT INTO tbl_post_comments(post_id , user_id ,description) VALUES(? ,? ,?)`,
            [post_id, user_id, description]
        )
        if (commentsadd.affectedRows > 0) {
            return commonApiFunctions.sendNotification(
                res,
                user_id,
                postData[0].user_id,
                'Comment',
                commentsadd.insertId,
                'New Comments',
                `Someone Has Commented ${description} to Your ${postData[0].title} POST`
            )
        }
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
}

//add rating api 
const addRatings = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { post_id, rating } = req.body;

        if (!post_id || !rating)
            return sendResponse(res, 400, 2, "Missing Field");

        //get post data 
        const [postData] = await db.query(`SELECT * FROM tbl_deals_post WHERE id = ? AND is_active = 1`, [post_id])
        if (postData.length === 0) {
            return sendResponse(res, 404, 3, "No Post Founded Added");
        }

        // Check if user has already rated this post
        const [existingRating] = await db.query(
            `SELECT id FROM tbl_post_rating WHERE post_id = ? AND user_id = ?`,
            [post_id, user_id]
        );

        if (existingRating.length > 0) {
            // Update existing rating
            const [updateRating] = await db.query(
                `UPDATE tbl_post_rating SET rating = ? WHERE post_id = ? AND user_id = ?`,
                [rating, post_id, user_id]
            );

            if (updateRating.affectedRows > 0) {
                return sendResponse(res, 200, 1, "Rating Updated Successfully");
            }

        } else {
            // Insert new rating
            const [addRating] = await db.query(
                `INSERT INTO tbl_post_rating (post_id, user_id, rating) VALUES (?, ?, ?)`,
                [post_id, user_id, rating]
            );

            if (addRating.affectedRows > 0)
                return commonApiFunctions.sendNotification(
                    res,
                    user_id,
                    postData[0].user_id,
                    'Rating',
                    commentsadd.insertId,
                    'New Rating',
                    `Someone Has Rated ${addRating[0].rating} to Your ${postData[0].title} POST`
                )
        }

        return sendResponse(res, 400, 0, "Failed To Process Rating");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

//GET /notification - get All Notification For single User 
const getNotification = async (req, res) => {
    try {

        const userId = req.loginUser.id
        const page =
            (req.body && req.body.page) || (req.query && req.query.page) || 1;
        const pageNum = parseInt(page) || 1;

        const limit = 20;
        const offset = (pageNum - 1) * limit;

        const [notificationData] = await db.query(`
            SELECT
        n.id AS notify_id,
        n.title,
        n.message,
        n.notification_type,
        n.notify_id AS target_id,
        u.first_name AS sender_name,
        u.profile_pic AS sender_profile,
        n.is_read,
        DATE_FORMAT(n.notify_time, '%W, %M %d, %Y') AS group_date,
        DATE_FORMAT(n.notify_time, '%h:%i %p') AS display_time
      FROM tbl_notification n
      LEFT JOIN tbl_user u ON n.sender_user_id = u.id
      WHERE n.receiver_user_id = ?
      ORDER BY n.notify_time DESC;
     LIMIT ? OFFSET ?      
      `, [userId, limit, offset])
        if (notificationData.length > 0) {
            const [updateReadQuery] = await db.query(`UPDATE tbl_notification SET is_read = 1 WHERE receiver_user_id = ? AND is_read = 0`, [userId]);
        }
        return sendResponse(res, 200, 1, "Notifications fetched", {
            notifications: notificationData,
        });

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 0, "Internal Server Error ")
    }
}

// POST /addreport
const addReport = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { post_id, report_description, others } = req.body;


        // Check if user already reported this post
        const [existing] = await db.query(
            `SELECT id FROM tbl_post_report WHERE post_id = ? AND user_id = ? AND is_delete = 0`,
            [post_id, user_id]
        );

        if (existing.length > 0) {
            return sendResponse(res, 400, 2, "You Have Already Reported This Post");
        }

        // Insert report
        const [report] = await db.query(
            `INSERT INTO tbl_post_report (post_id, user_id, report_description, others, is_active, is_delete, created_at, updated_at) 
             VALUES (?, ?, ?, ?, 1, 0, NOW(), NOW())`,
            [post_id, user_id, report_description || null, others || null]
        );

        if (report.affectedRows > 0) {
            return sendResponse(res, 200, 1, "Post Reported Successfully");
        }

        return sendResponse(res, 500, 0, "Failed To Report Post");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// GET /bookmarks  — Get all saved posts of logged in user
const getBookmarks = async (req, res) => {
    try {
        const user_id = req.loginUser.id;

        const [bookmarks] = await db.query(`
            SELECT
                p.id AS post_id,
                p.title AS deal_title,
                p.description AS deal_description,
                p.created_at AS deal_date,
                b.company_name AS business_name,
                b.profile_pic AS business_logo,
                b.address AS location_name,
                (
                    SELECT media_url FROM tbl_deals_post_image
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                    LIMIT 1
                ) AS deal_image,
                (
                    SELECT COUNT(*) FROM tbl_post_comments
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                ) AS total_comments,
                (
                    SELECT COALESCE(AVG(rating), 0) FROM tbl_post_rating
                    WHERE post_id = p.id AND is_active = 1 AND is_delete = 0
                ) AS avg_rating,
                s.created_at AS saved_at
            FROM tbl_post_saved s
            JOIN tbl_deals_post p ON p.id = s.post_id AND p.is_active = 1 AND p.is_delete = 0
            JOIN tbl_user u ON u.id = p.user_id
            JOIN tbl_business b ON b.user_id = u.id AND b.is_active = 1 AND b.is_delete = 0
            WHERE s.user_id = ? AND s.is_save = 1
            ORDER BY s.created_at DESC`,
            [user_id]
        );

        if (bookmarks.length === 0)
            return sendResponse(res, 404, 3, "No Bookmarks Found");

        return sendResponse(res, 200, 1, "Bookmarks Fetched Successfully", {
            bookmarks
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// DELETE /deletecomment
const deleteComment = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { comment_id } = req.body;

        // Soft delete
        const [deleted] = await db.query(
            `UPDATE tbl_post_comments SET is_delete = 1, is_active = 0, updated_at = NOW() WHERE id = ? AND user_id = ?`,
            [comment_id, user_id]
        );

        if (deleted.affectedRows > 0) {
            return sendResponse(res, 200, 1, "Comment Deleted Successfully");
        }

        return sendResponse(res, 500, 0, "Failed To Delete Comment");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// DELETE /deletenotification
const deleteNotification = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { notification_id } = req.body;

        const [deleted] = await db.query(
            `DELETE FROM tbl_notification WHERE id = ? AND receiver_user_id = ?`,
            [notification_id, user_id]
        );

        if (deleted.affectedRows > 0) {
            return sendResponse(res, 200, 1, "Notification Deleted Successfully");
        }

        return sendResponse(res, 500, 0, "Failed To Delete Notification");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// POST /createpost
const createPost = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { title, description, lat, long, website_url, images, tags } = req.body;
        // images = array of media_url strings  e.g. ["url1", "url2"]
        // tags   = array of tag_id numbers     e.g. [1, 2, 3]

        // Check if business exists for this user
        const [business] = await db.query(
            `SELECT id FROM tbl_business WHERE user_id = ? AND is_active = 1 AND is_delete = 0`,
            [user_id]
        );

        if (business.length === 0) {
            return sendResponse(res, 404, 3, "Business Profile Not Found");
        }

        // Insert post
        const [post] = await db.query(
            `INSERT INTO tbl_deals_post (user_id, title, description, lat, long, website_url, is_active, is_delete, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`,
            [user_id, title, description, lat || null, long || null, website_url || null]
        );

        if (post.affectedRows === 0) {
            return sendResponse(res, 500, 0, "Failed To Create Post");
        }

        const post_id = post.insertId;

        // Insert images
        if (images && images.length > 0) {
            const imageValues = images.map(url => [post_id, url]);
            await db.query(
                `INSERT INTO tbl_deals_post_image (post_id, media_url) VALUES ?`,
                [imageValues]
            );
        }

        // Insert tags
        if (tags && tags.length > 0) {
            const tagValues = tags.map(tag_id => [post_id, tag_id]);
            await db.query(
                `INSERT INTO tbl_post_tag_bridge (post_id, tag_id) VALUES ?`,
                [tagValues]
            );
        }

        return sendResponse(res, 200, 1, "Post Created Successfully", { post_id });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};

// POST /deletepost
const deletePost = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { post_id } = req.body;

        // Check if post exists and belongs to logged in user
        const [post] = await db.query(
            `SELECT id FROM tbl_deals_post WHERE id = ? AND user_id = ? AND is_delete = 0`,
            [post_id, user_id]
        );

        if (post.length === 0) {
            return sendResponse(res, 404, 3, "Post Not Found");
        }

        // Soft delete post tags from bridge table
        await db.query(
            `UPDATE tbl_post_tag_bridge SET is_active = 0, is_delete = 1 WHERE post_id = ?`,
            [post_id]
        );

        // Soft delete post images
        await db.query(
            `UPDATE tbl_deals_post_image SET is_active = 0, is_delete = 1 WHERE post_id = ?`,
            [post_id]
        );

        // Soft delete post comments
        await db.query(
            `UPDATE tbl_post_comments SET is_active = 0, is_delete = 1 WHERE post_id = ?`,
            [post_id]
        );

        // Soft delete post ratings
        await db.query(
            `UPDATE tbl_post_rating SET is_active = 0, is_delete = 1 WHERE post_id = ?`,
            [post_id]
        );

        // Soft delete post
        await db.query(
            `UPDATE tbl_deals_post SET is_active = 0, is_delete = 1 WHERE id = ? AND user_id = ?`,
            [post_id, user_id]
        );

        return sendResponse(res, 200, 1, "Post Deleted Successfully");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};
module.exports = { getCategories, getDealsPosts, createPost , deletePost, getdeal, getdealbyCategory,   getallcomments, deleteNotification, getNotification, deleteComment, toggleBookmark, addComments, addRatings, addReport, getBookmarks };