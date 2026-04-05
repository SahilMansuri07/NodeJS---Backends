
// GET /user/
const getUserDetails = async (req, res) => {
    try {
        const userId = req.loginUser.id;

        const [userData] = await db.query(
            `SELECT * FROM tbl_user WHERE id = ?`,
            [userId]
        );

        if (userData.length > 0) {
            return sendResponse(res, 200, 1, "User Details Fetched", userData[0]);
        }
        return sendResponse(res, 404, 3, "No Data Found");

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};



//GET - User Profile
const userProfile = async (req, res) => {
    try {
        const userId = req.loginUser.id;
        const requestedUserId = req.body.user_id ? req.body.user_id : requestedUserId
        const q = (`
            SELECT 
                u.id AS user_id, 
                u.is_premium, 
                CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
                u.profile_pic, 
                u.banner_pic AS cover_photo, 
                u.bio, 
                b.company_name, 
                c.name AS business_category, 
                (SELECT COUNT(*) FROM tbl_user_follows WHERE sender_user_id = u.id AND is_delete = 0) AS following_count, 
                (SELECT COUNT(*) FROM tbl_user_follows WHERE receiver_user_id = u.id AND is_delete = 0) AS followers_count, 
                (SELECT COUNT(*) FROM tbl_deals_post WHERE user_id = u.id AND is_delete = 0) AS total_posts_count 
            FROM tbl_user u 
            LEFT JOIN tbl_business b ON u.id = b.user_id 
            LEFT JOIN tbl_deals_category c ON b.category_id = c.id 
            WHERE u.id = ?
        `);

        const [profileData] = await db.query(q, [requestedUserId]);

        // If no user found at all
        if (profileData.length === 0) {
            return sendResponse(res, 404, 3, "User Not Found");
        }

        const q1 = (`
            SELECT
                p.id AS post_id,
                (
                    SELECT media_url FROM tbl_deals_post_image
                    WHERE post_id = p.id LIMIT 1
                ) AS post_image
            FROM tbl_deals_post p
            WHERE p.user_id = ? AND p.is_active = 1 AND p.is_delete = 0  
            ORDER BY p.created_at DESC
        `);

        const [postData] = await db.query(q1, [requestedUserId]);

        return sendResponse(res, 200, 1, "User Profile Details Fetched Successfully", {
            profileData: profileData[0],
            postData: postData
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// POST /togglefollow
const toggleFollow = async (req, res) => {
    try {
        const sender_user_id = req.loginUser.id;
        const { receiver_user_id } = req.body;

        // Can't follow yourself
        if (sender_user_id === receiver_user_id) {
            return sendResponse(res, 400, 2, "You Cannot Follow Yourself");
        }


        // Check if follow record already exists
        const [existing] = await db.query(
            `SELECT id, is_delete FROM tbl_user_follows WHERE sender_user_id = ? AND receiver_user_id = ?`,
            [sender_user_id, receiver_user_id]
        );

        if (existing.length > 0) {
            // Toggle follow/unfollow
            const newStatus = existing[0].is_delete === 1 ? 0 : 1;

            await db.query(
                `UPDATE tbl_user_follows SET is_delete = ?, updated_at = NOW() WHERE sender_user_id = ? AND receiver_user_id = ?`,
                [newStatus, sender_user_id, receiver_user_id]
            );

            const message = newStatus === 0 ? "Followed Successfully" : "Unfollowed Successfully";
            const is_following = newStatus === 0 ? 1 : 0;
            return sendResponse(res, 200, 1, message, { is_following });

        } else {
            // Insert new follow
            await db.query(
                `INSERT INTO tbl_user_follows (sender_user_id, receiver_user_id, is_delete, created_at, updated_at) VALUES (?, ?, 0, NOW(), NOW())`,
                [sender_user_id, receiver_user_id]
            );

            return sendResponse(res, 200, 1, "Followed Successfully", { is_following: 1 });
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// GET /followers  — people who follow the logged in user
const getFollowers = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { page } = req.body || 1;
        const limit = 10;
        const offset = ((page || 1) - 1) * limit;

        const [followers] = await db.query(`
           SELECT
                u.id AS user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.profile_pic,
                u.bio,
                f.created_at AS followed_at,
                COALESCE((
                    SELECT 1 FROM tbl_user_follows
                    WHERE sender_user_id = 80 AND receiver_user_id = u.id AND is_delete = 0
                ), 0) AS is_following_back
            FROM tbl_user_follows f
            JOIN tbl_user u ON u.id = f.sender_user_id AND u.status = "Active"
            WHERE f.receiver_user_id = 80 AND f.is_delete = 0
            ORDER BY f.created_at DESC
            LIMIT ? OFFSET ?`,
            [user_id, user_id, limit, offset]
        );

        if (followers.length === 0) {
            return sendResponse(res, 404, 3, "No Followers Found");
        }

        return sendResponse(res, 200, 1, "Followers Fetched Successfully", {
            currentPage: page || 1,
            followers
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


// GET /following  — people the logged in user follows
const getFollowing = async (req, res) => {
    try {
        const user_id = req.loginUser.id;
        const { page } = req.body || 1;
        const limit = 10;
        const offset = ((page || 1) - 1) * limit;

        const [following] = await db.query(`
            SELECT
                u.id AS user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS full_name,
                u.profile_pic,
                u.bio,
                f.created_at AS followed_at
            FROM tbl_user_follows f
            JOIN tbl_user u ON u.id = f.receiver_user_id AND u.status = "Active"
            WHERE f.sender_user_id = ? AND f.is_delete = 0
            ORDER BY f.created_at DESC
            LIMIT ? OFFSET ?`,
            [user_id, limit, offset]
        );

        if (following.length === 0) {
            return sendResponse(res, 404, 3, "No Following Found");
        }

        return sendResponse(res, 200, 1, "Following Fetched Successfully", {
            currentPage: page || 1,
            following
        });

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
};


module.exports = { getUserDetails , toggleFollow , getFollowing , getFollowers , getFollowing , userProfile}