const db = require("../../config/db")
const common = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")
const dotenv = require("dotenv")
 
dotenv.config()

const parseMedia = (rows) => rows.map(row => ({
    ...row,
    media: row.media ? JSON.parse(`[${row.media}]`) : []
}));
 
const getPosts = async (req, res) => {
    try {
        if (!req.loginUser) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data");
        }

        let user = await common.getUser(req.loginUser.data.user_id);

        const { type = "all", pageTrending = 1, limitTrending = 10, pagePost = 1, limitPost = 10 } = req.query;

        const baseSelect = `
        SELECT
            p.id AS post_id, p.post_user_id AS user_id, u.username, u.profile_photo_path, p.post_type, p.ranking_expired_on, p.cat_id, c.name,
            ( SELECT GROUP_CONCAT(
                CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
                SEPARATOR ','
            ) FROM tbl_post_media m2 WHERE m2.post_id = p.id AND m2.is_active = 1 AND m2.is_delete = 0 ) AS media,
            COUNT(DISTINCT r.id) AS ranking_total,
            COUNT(DISTINCT rate.id) AS rating_total,
            SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0) AS rating_avg
        FROM tbl_post p
        JOIN tbl_post_media m ON m.post_id = p.id AND m.is_active = 1 AND m.is_delete = 0
        JOIN tbl_user u ON u.id = p.post_user_id AND u.is_active = 1 AND u.is_delete = 0
        JOIN tbl_category c ON c.id = p.cat_id AND c.is_active = 1 AND c.is_delete = 0
        LEFT JOIN tbl_ranking r ON r.post_media_id = m.id AND r.is_active = 1 AND r.is_delete = 0
        LEFT JOIN tbl_rating rate ON rate.post_id = p.id AND rate.is_active = 1 AND rate.is_delete = 0
        WHERE p.is_active = 1 AND p.is_delete = 0`;

        // Trending posts
        const trendingQuery = `${baseSelect}
            GROUP BY p.id ORDER BY rating_avg DESC, rating_total DESC, ranking_total DESC
            LIMIT ${limitTrending} OFFSET ${(pageTrending - 1) * limitTrending}`;

        // Post type condition
        let postCondition = "";
        if (type === "all") {
            postCondition = "";
        } else if (type === "new") {
            postCondition = ` AND p.post_user_id NOT IN (SELECT f.other_user_id FROM tbl_follow f WHERE f.sender_id = ${user.id})`;
        } else if (type === "following") {
            postCondition = ` AND p.post_user_id IN (SELECT f.other_user_id FROM tbl_follow f WHERE f.sender_id = ${user.id})`;
        } else if (type === "expiring") {
            postCondition = ` AND p.ranking_expired_on >= NOW()`;
        } else {
            return sendResponse(req, res, 400, 0, "Invalid Post Type", {});
        }

        const postQuery = `${baseSelect} ${postCondition}
            GROUP BY p.id ORDER BY p.created_at DESC
            LIMIT ${limitPost} OFFSET ${(pagePost - 1) * limitPost}`;

        const trendingResult = await db.query(trendingQuery);
        const postResult = await db.query(postQuery);

        return sendResponse(req, res, 200, 1, "Posts Fetched Successfully", {
            trendingPost: parseMedia(trendingResult[0]),
            postData: parseMedia(postResult[0])
        });

    } catch (err) {
        console.log(err);
        return sendResponse(req, res, 500, 0, "Error During Fetching Posts", {});
    }
};


// const getCategoryPosts = async (req, res) => {
//     try {
//         if (!req.loginUser) {
//             return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data");
//         }

//         const { category_id = null, pageCategory = 1, limitCategory = 10 } = req.query;

//         let categoryCondition = "";
//         if (category_id) {
//             categoryCondition = ` AND c.id = ${category_id}`;
//         }

//         const query = `
//         SELECT
//             p.id AS post_id, p.post_user_id AS user_id, u.username, u.profile_photo_path, p.post_type, p.ranking_expired_on, p.cat_id, c.name,
//             ( SELECT GROUP_CONCAT(
//                 CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
//                 SEPARATOR ','
//             ) FROM tbl_post_media m2 WHERE m2.post_id = p.id AND m2.is_active = 1 AND m2.is_delete = 0 ) AS media,
//             COUNT(DISTINCT r.id) AS ranking_total,
//             COUNT(DISTINCT rate.id) AS rating_total,
//             SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0) AS rating_avg
//         FROM tbl_post p
//         JOIN tbl_post_media m ON m.post_id = p.id AND m.is_active = 1 AND m.is_delete = 0
//         JOIN tbl_user u ON u.id = p.post_user_id AND u.is_active = 1 AND u.is_delete = 0
//         JOIN tbl_category c ON c.id = p.cat_id AND c.is_active = 1 AND c.is_delete = 0
//         LEFT JOIN tbl_ranking r ON r.post_media_id = m.id AND r.is_active = 1 AND r.is_delete = 0
//         LEFT JOIN tbl_rating rate ON rate.post_id = p.id AND rate.is_active = 1 AND rate.is_delete = 0
//         WHERE p.is_active = 1 AND p.is_delete = 0
//         ${categoryCondition}
//         GROUP BY p.id ORDER BY p.created_at DESC
//         LIMIT ${limitCategory} OFFSET ${(pageCategory - 1) * limitCategory}`;

//         const categoryListQuery = `SELECT id, name FROM tbl_category WHERE is_active=1 AND is_delete=0`;

//         const postResult = await db.query(query);
//         const categoryResult = await db.query(categoryListQuery);

//         return sendResponse(req, res, 200, 1, "Category Posts Fetched Successfully", {
//             categoryList: categoryResult[0],
//             categoryPostData: parseMedia(postResult[0])
//         });

//     } catch (err) {
//         console.log(err);
//         return sendResponse(req, res, 500, 0, "Error During Fetching Category Posts", {});
//     }
// };


const categoryList = async (req, res) => {
    try {
        const categoryResult = await db.query("SELECT id,name FROM tbl_category where is_active=1 and is_delete=0")
        if (categoryResult && categoryResult[0] && categoryResult[0].length > 0) {
            return sendResponse(req, res, 200, 1, "Category Data Fetch Successfully", {
                "categoryData": categoryResult[0]
            })
        } else {
            return sendResponse(req, res, 200, 3, "No Category Data Found", {})
        }
        
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Fetching Category Listing", {err})
    }
}

const categoryPostList = async (req, res) => {
    try {
        if (!req.query.id) {
            return sendResponse(req, res, 400, 0, "Pass Id In Query String", {})
        }
        const { id = null, page = 1, limit = 10 } = req.query;
 
        const query = `SELECT
        p.id AS post_id, p.post_user_id AS user_id, u.username, u.profile_photo_path, p.post_type, p.ranking_expired_on, p.cat_id, c.name,
        ( SELECT GROUP_CONCAT(
            CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
            SEPARATOR ','
        ) FROM tbl_post_media m2 WHERE m2.post_id = p.id AND m2.is_active = 1 AND m2.is_delete = 0 ) AS media,
                        COUNT(DISTINCT r.id) AS ranking_total,
                        COUNT(DISTINCT rate.id) AS rating_total,
                        SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0) AS rating_avg
                    FROM tbl_post p
                    JOIN tbl_post_media m ON m.post_id = p.id AND m.is_active = 1 AND m.is_delete = 0
                    JOIN tbl_user u ON u.id = p.post_user_id AND u.is_active = 1 AND u.is_delete = 0
                    JOIN tbl_category c ON c.id = p.cat_id AND c.is_active = 1 AND c.is_delete = 0
                    LEFT JOIN tbl_ranking r ON r.post_media_id = m.id AND r.is_active = 1 AND r.is_delete = 0
                    LEFT JOIN tbl_rating rate ON rate.post_id = p.id AND rate.is_active = 1 AND rate.is_delete = 0
                    WHERE p.is_active = 1 AND p.is_delete = 0 AND c.id IN (?) GROUP BY p.id ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ?`

        const categoryPostResult = await db.query(query, [id, (page - 1) * limit])
 
        if (categoryPostResult && categoryPostResult[0] && categoryPostResult[0].length > 0) {
            return sendResponse(req, res, 200, 1, "Category Post Data Fetch Successfully", {
                "categoryData": parseMedia(categoryPostResult[0])
            })
        } else {
            return sendResponse(req, res, 200, 3, "No Category Data Found", {})
        }
    }
    catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Category Post List", {err})
    }
}
const postDetails = async (req, res) => {
    try {
        
        const { id } = req.params
        const userId = req.loginUser?.data?.user_id

        if (!id) return sendResponse(req, res, 400, 0, "Pass Id In Parameters", {})
        if (!userId) return sendResponse(req, res, 400, 0, "User Data Not Found", {})

        console.log(id, userId)
        // ── Query 1: Main post data (no ranking window function) ──
        const mainQuery = `
            SELECT
                p.id AS post_id,
                p.post_user_id AS user_id,
                u.username,
                u.profile_photo_path,
                p.post_type,
                p.ranking_expired_on,
                p.cat_id,
                c.name,
                (
                    SELECT GROUP_CONCAT(
                        CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
                        SEPARATOR ','
                    )
                    FROM tbl_post_media m2
                    WHERE m2.post_id = p.id AND m2.is_active = 1 AND m2.is_delete = 0
                ) AS media,
                COUNT(DISTINCT r.id)   AS ranking_total,
                COUNT(DISTINCT rate.id) AS rating_total,
                SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0) AS rating_avg,
                COUNT(DISTINCT cmt.id) AS comment_total,
                IF(COUNT(DISTINCT save_post.id) > 0, 1, 0) AS is_saved
            FROM tbl_post p
            JOIN tbl_post_media m
                ON m.post_id = p.id AND m.is_active = 1 AND m.is_delete = 0
            JOIN tbl_user u
                ON u.id = p.post_user_id AND u.is_active = 1 AND u.is_delete = 0
            JOIN tbl_category c
                ON c.id = p.cat_id AND c.is_active = 1 AND c.is_delete = 0
            LEFT JOIN tbl_ranking r
                ON r.post_media_id = m.id AND r.is_active = 1 AND r.is_delete = 0
            LEFT JOIN tbl_rating rate
                ON rate.post_id = p.id AND rate.is_active = 1 AND rate.is_delete = 0
            LEFT JOIN tbl_comment cmt
                ON cmt.post_id = p.id AND cmt.is_active = 1 AND cmt.is_delete = 0
            LEFT JOIN tbl_saved_post save_post
                ON save_post.user_id = ? AND save_post.post_id = ?
                AND save_post.is_active = 1 AND save_post.is_delete = 0
            WHERE p.is_active = 1 AND p.is_delete = 0 AND p.id = ?
            GROUP BY p.id`

        // ── Query 2: Ranking (only if expired) ──
        const rankingQuery = `
            SELECT
                m.id AS m_id,
                ROW_NUMBER() OVER (
                    ORDER BY
                        SUM(CASE WHEN r.rank_order = 1 THEN 1 ELSE 0 END) DESC,
                        SUM(CASE WHEN r.rank_order = 2 THEN 1 ELSE 0 END) DESC,
                        SUM(CASE WHEN r.rank_order = 3 THEN 1 ELSE 0 END) DESC
                ) AS final_rank
            FROM tbl_post_media m
            LEFT JOIN tbl_ranking r
                ON r.post_media_id = m.id AND r.is_active = 1 AND r.is_delete = 0
            WHERE m.post_id = ? AND m.is_active = 1 AND m.is_delete = 0
            GROUP BY m.id`

        const [postResult] = await db.query(mainQuery, [userId, id, id])

        if (!postResult || postResult.length === 0) {
            return sendResponse(req, res, 200, 3, "No Post Data Found", {})
        }

        const post = postResult[0]
        let ranking = null

        // Only fetch ranking if post has expired ranking
        if (post.ranking_expired_on && new Date(post.ranking_expired_on) < new Date()) {
            const [rankResult] = await db.query(rankingQuery, [id])
            if (rankResult && rankResult.length > 0) {
                ranking = rankResult.map(row => ({
                    m_id: row.m_id,
                    rank: row.final_rank
                }))
            }
        }

        const parsedPost = parseMedia([post]).map(row => ({
            ...row,
            ranking
        }))

        return sendResponse(req, res, 200, 1, "Post Data Fetch Successfully", {
            postData: parsedPost
        })

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Fetching Post Details", {})
    }
}


 
const addRanking = async (req, res) => {
    try {
        if (!req.loginUser?.data?.user_id) {
            return sendResponse(req, res, 400, 3, "User Data Not Found", {})
        }
 
        const userId = req.loginUser?.data?.user_id
        const { post_id: postId, ranking } = req.body
 
        if (!postId || !Array.isArray(ranking) || ranking.length === 0) {
            return sendResponse(req, res, 400, 0, "Invalid request data", {})
        }
 
        const post = await common.getPost(postId)
        if (!post) {
            return sendResponse(req, res, 200, 3, "Post not found", {})
        }
 
        if (post.post_type != "C") {
            return sendResponse(req, res, 400, 0, "Post Type Is Not Compare", {})
        }
 
        // Expiry check
        if (new Date(post.ranking_expired_on) < new Date()) {
            return sendResponse(req, res, 400, 0, "Ranking expired for this post", {})
        }
 
        const postMediaIds = post.media.map(m => m.m_id)
 
        // Enforce full ranking
        if (ranking.length !== postMediaIds.length) {
            return sendResponse(req, res, 400, 0, "You must rank all media of this post", {})
        }
 
        // Check If Already Ranked
        const [existing] = await db.query(
            `SELECT id FROM tbl_ranking WHERE user_id = ? AND post_media_id IN (?) LIMIT 1`,
            [userId, postMediaIds]
        )
 
        if (existing.length > 0) {
            return sendResponse(req, res, 200, 0, "You Already Ranked This Post", {})
        }
 
        let invalidIds = []
        let seenMedia = new Set()
        let seenRanks = new Set()
        
        // Validate ranking items
        for (let item of ranking) {
            const m_id = Number(item.m_id)
            const rank = Number(item.rank)
 
            if (!m_id || !rank) {
                return sendResponse(req, res, 400, 0, "m_id and rank are required", {})
            }
 
            if (!Number.isInteger(rank) || rank <= 0) {
                return sendResponse(req, res, 400, 0, "Rank must be a positive integer", {})
            }
 
            // invalid media
            if (!postMediaIds.includes(m_id)) {
                invalidIds.push(m_id)
            }
 
            // duplicate media
            if (seenMedia.has(m_id)) {
                return sendResponse(req, res, 400, 0, "Duplicate media_id found", {})
            }
            seenMedia.add(m_id)
 
            // duplicate rank
            if (seenRanks.has(rank)) {
                return sendResponse(req, res, 400, 0, "Duplicate rank found", {})
            }
            seenRanks.add(rank)
        }
 
        if (invalidIds.length > 0) {
            return sendResponse(req, res, 400, 0, "Invalid media IDs", { invalidIds })
        }
 
        // Rank must be sequential (1 → N)
        const sortedRanks = [...seenRanks].sort((a, b) => a - b)
        for (let i = 0; i < sortedRanks.length; i++) {
            if (sortedRanks[i] !== i + 1) {
                return sendResponse(req, res, 400, 0, "Ranks must be sequential starting from 1", {})
            }
        }
 
        // Add Ranking
        const values = ranking.map(r => [
            userId,
            Number(r.m_id),
            Number(r.rank)
        ])
        const [insertRank] = await db.query(
            `INSERT INTO tbl_ranking (user_id, post_media_id, rank_order) VALUES ?`,
            [values]
        )
        
        if (insertRank.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Ranking Added Successfull", {})
        }
        return sendResponse(req, res, 200, 0, "Error During Inserting Rank", {})
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Post Ranking", {})
    }
}
 
const addRating = async (req, res) => {
    try {
        if (!req.loginUser?.data?.user_id) {
            return sendResponse(req, res, 400, 0, "User Data Not Found", {})
        }
 
        const userId = req.loginUser?.data?.user_id
        const { post_id: postId, rating } = req.body
 
        const post = await common.getPost(postId)
 
        if (post.post_type == "C") {
            return sendResponse(req, res, 400, 0, "Post Type Is Compare Which Does Not Contain Rating", {})
        }
 
        const [existing] = await db.query(
            `SELECT id FROM tbl_rating WHERE user_id = ? AND post_id IN (?) LIMIT 1`,
            [userId, postId]
        )
 
        if (existing.length > 0) {
            return sendResponse(req, res, 200, 0, "You Already Ranked This Post", {})
        }
 
        const [insertRating] = await db.query("INSERT INTO tbl_rating(user_id,post_id,rating) values(?,?,?)", [userId, postId, rating])
        if (insertRating.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Rating Added Successfully", {})
        }
        return sendResponse(req, res, 200, 0, "Error During Inserting Rating", {})
 
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Post Ranking", {})
    }
}
 
const createPost = async (req, res) => {
    try {
        if (!req.loginUser?.data?.user_id) {
            return sendResponse(req, res, 400, 0, "User Data Not Found", {})
        }
 
        const userId = req.loginUser?.data?.user_id
        const { description, cat_id, post_type, ranking_expired_on, media } = req.body
 
        const [addPost] = await db.query(
            `INSERT INTO tbl_post (post_user_id, description, cat_id, post_type, ranking_expired_on) VALUES (?,?,?,?,?)`,
            [userId, description, cat_id, post_type, ranking_expired_on]
        )
        if (addPost && addPost.affectedRows > 0) {
            const mediaObj = media.map(m => [
                addPost.insertId,
                m.media_type,
                m.media_url
            ])
 
            const [addPostMedia] = await db.query(`INSERT INTO tbl_post_media (post_id,media_type,media_url) VALUES ?`, [mediaObj])
            const post = await common.getPost(addPost.insertId)
            if (addPostMedia.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, "Post Created Successfully", {
                    "postData": post
                })
            }
            return sendResponse(req, res, 200, 0, "Error While Creating Post", {})
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Creating Post", {})
    }
}
 
const deletePost = async (req, res) => {
    try {
        if (!req.loginUser?.data?.user_id) {
            return sendResponse(req, res, 400, 0, "User Data Not Found", {})
        }
 
        const userId = req.loginUser?.data?.user_id
        const postId = req.body.post_id
        
        const [existingPost] = await db.query("SELECT id FROM tbl_post where post_user_id=? and id=? and is_active=1 and is_delete=0", [userId, postId])
        if (existingPost && existingPost[0] && existingPost.length > 0) {
            const [deletePost] = await db.query("UPDATE tbl_post SET is_active=0,is_delete=1 WHERE id=?", [postId])
 
            await db.query(
                `UPDATE tbl_post_media SET is_active=0, is_delete=1 WHERE post_id=?`,
                [postId]
            )
            if (deletePost.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, "Post Deleted Successfully", {})
            }
            return sendResponse(req, res, 200, 0, "Error While Deleting Post", {})
        }
        return sendResponse(req, res, 200, 0, "Post Not Found Or Not Belongs To You")
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Deleting Post", {})
    }
}
 
module.exports = { getPosts,
     //getCategoryPosts,
      categoryList, categoryPostList, postDetails, addRanking, addRating, createPost, deletePost }