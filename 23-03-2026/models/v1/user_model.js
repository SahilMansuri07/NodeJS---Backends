const md5 = require("md5")
const common = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")
const db = require("../../config/db")

const getUserProfile = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }
        const loggedInUserId = req.loginUser.data.user_id
        const queryUserId = req.query.user_id ? req.query.user_id : loggedInUserId

        let visitorUser = null
        if (queryUserId != loggedInUserId) {
            visitorUser = await common.getUser(queryUserId)
            if (!visitorUser) {
                return sendResponse(req, res, 200, 3, "User Not Found", {})
            }
        }

        const profileUserId = visitorUser ? visitorUser.id : loggedInUserId

        let userSqlQuery = ``

        if (visitorUser == null) {
            userSqlQuery = `
                SELECT u.id, u.full_name, u.username, u.profile_photo_path,
                (SELECT COUNT(*) FROM tbl_follow WHERE reciever_user_id = u.id) AS follower_count,
                (SELECT COUNT(*) FROM tbl_follow WHERE sender_user_id = u.id) AS following_count,
                COUNT(DISTINCT rate.id) AS rating_count
                FROM tbl_user AS u
                LEFT JOIN tbl_rating rate 
                    ON rate.user_id = ${profileUserId} AND rate.is_active = 1 AND rate.is_delete = 0
                WHERE u.id = ${profileUserId} AND u.is_active = 1 AND u.is_delete = 0
            `
        } else {
            userSqlQuery = `
                SELECT u.id, u.full_name, u.username, u.profile_photo_path,
                (SELECT COUNT(*) FROM tbl_follow WHERE reciever_user_id = u.id) AS follower_count,
                (SELECT COUNT(*) FROM tbl_follow WHERE sender_user_id = u.id) AS following_count,
                COUNT(DISTINCT rate.id) AS rating_count,
                (CASE WHEN follow.id IS NULL THEN 0 ELSE 1 END) AS is_followed
                FROM tbl_user AS u
                LEFT JOIN tbl_rating rate 
                    ON rate.user_id = ${profileUserId} AND rate.is_active = 1 AND rate.is_delete = 0
                LEFT JOIN tbl_follow AS follow 
                    ON follow.sender_user_id = ${loggedInUserId} AND follow.reciever_user_id = u.id
                WHERE u.id = ${profileUserId} AND u.is_active = 1 AND u.is_delete = 0
            `
        }

        const postSqlQuery = `
            SELECT post.id, post.post_type, post.created_at,
            (
                SELECT GROUP_CONCAT(
                    CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
                    SEPARATOR ','
                )
                FROM tbl_post_media m2
                WHERE m2.post_id = post.id AND m2.is_active = 1 AND m2.is_delete = 0
            ) AS media
            FROM tbl_post AS post
            WHERE post.post_user_id = ${profileUserId} AND post.is_active = 1 AND post.is_delete = 0
            ORDER BY post.created_at DESC
        `

        let [userResult] = await db.query(userSqlQuery)
        let [postResult] = await db.query(postSqlQuery)

        postResult = postResult.map(row => ({
            ...row,
            media: row.media ? JSON.parse(`[${row.media}]`) : []
        }))

        if (userResult && userResult.length > 0) {
            return sendResponse(req, res, 200, 1, "User Profile Fetch Successfull", {
                "userData": userResult[0],
                "postData": postResult
            })
        }
        return sendResponse(req, res, 200, 0, "Error Fetching User Profile", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Fetching Your Profile", {})
    }
}

const toggleFollow = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let senderUser = await common.getUser(req.loginUser.data.user_id)
        let receiverUser = await common.getUser(req.body.other_user_id)

        if (receiverUser == null) {
            return sendResponse(req, res, 200, 3, "User Not Found", {})
        }

        // ✅ correct column names: sender_user_id, reciever_user_id
        const [followExist] = await db.query(
            `SELECT id FROM tbl_follow WHERE sender_user_id = ? AND reciever_user_id = ?`,
            [senderUser.id, receiverUser.id]
        )

        if (followExist && followExist.length > 0) {
            const [deleteFollow] = await db.query(
                `DELETE FROM tbl_follow WHERE sender_user_id = ? AND reciever_user_id = ?`,
                [senderUser.id, receiverUser.id]
            )
            if (deleteFollow.affectedRows > 0) {
                return sendResponse(req, res, 200, 1, "User Unfollowed Succesfully", {})
            }
            return sendResponse(req, res, 500, 0, "Error While Unfollowing", {})
        }

        // ✅ correct column names
        const [addNewFollow] = await db.query(
            `INSERT INTO tbl_follow(sender_user_id, reciever_user_id) VALUES (?, ?)`,
            [senderUser.id, receiverUser.id]
        )
        if (addNewFollow.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "User Followed Succesfully", {})
        }
        return sendResponse(req, res, 200, 0, "Error While Following", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Following User", {})
    }
}

const updateProfile = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let user = await common.getUser(req.loginUser.data.user_id)
        const user_id = user.id

        let user_update_obj = {}

        if (req.body.full_name)   user_update_obj.full_name         = req.body.full_name
        if (req.body.email)       user_update_obj.email             = req.body.email
        if (req.body.username)    user_update_obj.username          = req.body.username
        if (req.body.dob)         user_update_obj.dob               = req.body.dob
        if (req.body.profile_photo) user_update_obj.profile_photo_path = req.body.profile_photo

        if (req.body.country_code && req.body.phone) {
            user_update_obj.country_code = req.body.country_code
            user_update_obj.phone        = req.body.phone
        }

        if (Object.keys(user_update_obj).length === 0) {
            return sendResponse(req, res, 400, 0, "No Fields To Update", {})
        }

        const [updateResult] = await db.query(
            `UPDATE tbl_user SET ? WHERE id = ?`,
            [user_update_obj, user_id]
        )
        const userData = await common.getUser(user_id)

        if (updateResult.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "User Profile Updated Successfully", { "userData": userData })
        }
        return sendResponse(req, res, 500, 0, "Error During Updating User Profile", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Updating User Profile", {})
    }
}

const userSavePostList = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        if (!req.loginUser.data || !req.loginUser.data.user_id) {
            return sendResponse(req, res, 200, 0, "No Logged In User Data Found", {})
        }

        let userId = req.loginUser.data.user_id
        let page = (req.body?.page > 0) ? req.body.page : 1
        let size = (req.body?.size > 0) ? req.body.size : 5
        let offset = (page - 1) * size

        let sqlQuery = `
            SELECT
                save_post.id, p.id AS post_id, p.post_user_id AS user_id,
                u.username, u.profile_photo_path,
                p.post_type, p.ranking_expired_on, p.cat_id, c.name,
                (
                    SELECT GROUP_CONCAT(
                        CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
                        SEPARATOR ','
                    )
                    FROM tbl_post_media m2
                    WHERE m2.post_id = p.id AND m2.is_active = 1 AND m2.is_delete = 0
                ) AS media,
                COUNT(DISTINCT r.id)                                             AS ranking_total,
                COUNT(DISTINCT rate.id)                                          AS rating_total,
                SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0)           AS rating_avg,
                COUNT(DISTINCT comments.id)                                      AS comment_total
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
            LEFT JOIN tbl_comment comments
                ON comments.post_id = p.id AND comments.is_active = 1 AND comments.is_delete = 0
            JOIN tbl_saved_post save_post
                ON save_post.user_id = ${userId} AND save_post.post_id = p.id
                AND save_post.is_active = 1 AND save_post.is_delete = 0
            WHERE p.is_active = 1 AND p.is_delete = 0
            GROUP BY save_post.id, p.id
            LIMIT ${size} OFFSET ${offset}
        `

        const [savedPosts] = await db.query(sqlQuery)

        if (savedPosts && savedPosts.length > 0) {
            return sendResponse(req, res, 200, 1, "Saved Post Data Fetch Successfull", {
                "savedPostData": savedPosts.map(row => ({
                    ...row,
                    media: row.media ? JSON.parse(`[${row.media}]`) : []
                }))
            })
        }
        return sendResponse(req, res, 200, 3, "No Saved Post Data Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error During Fetching Save Post List", {})
    }
}

const followerList = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let user = await common.getUser(req.loginUser.data.user_id)
        let visitorUser = await common.getUser(req.body.user_id)

        if (visitorUser == null) {
            return sendResponse(req, res, 200, 3, "User Not Found", {})
        }

        let sqlQuery = ``

        if (user.id == visitorUser.id) {
            // Own profile — just list followers
            sqlQuery = `
                SELECT follower.id, u.id, u.profile_photo_path, u.username
                FROM tbl_follow AS follower
                JOIN tbl_user AS u
                    ON u.id = follower.sender_user_id AND u.is_active = 1 AND u.is_delete = 0
                WHERE follower.reciever_user_id = ${visitorUser.id}
            `
        } else {
            // Visitor profile — show is_following flag
            sqlQuery = `
                SELECT follower.id, u.id, u.profile_photo_path, u.username,
                (CASE WHEN following.id IS NULL THEN 0 ELSE 1 END) AS is_following
                FROM tbl_follow AS follower
                JOIN tbl_user AS u
                    ON u.id = follower.sender_user_id AND u.is_active = 1 AND u.is_delete = 0
                LEFT JOIN tbl_follow AS following
                    ON following.sender_user_id = ${user.id} AND following.reciever_user_id = follower.sender_user_id
                WHERE follower.reciever_user_id = ${visitorUser.id}
            `
        }

        const [followerListResult] = await db.query(sqlQuery)

        if (followerListResult && followerListResult.length > 0) {
            return sendResponse(req, res, 200, 1, "Followers List Fetched Successfully", {
                "followersData": followerListResult
            })
        }
        return sendResponse(req, res, 400, 3, "No Followers Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Fetching Followers List", {})
    }
}

const followingList = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let user = await common.getUser(req.loginUser.data.user_id)
        let visitorUser = await common.getUser(req.body.user_id)

        if (visitorUser == null) {
            return sendResponse(req, res, 200, 3, "User Not Found", {})
        }

        let sqlQuery = ``

        if (user.id == visitorUser.id) {
            // Own profile — just list followings
            sqlQuery = `
                SELECT following.id, u.id, u.profile_photo_path, u.username
                FROM tbl_follow AS following
                JOIN tbl_user AS u
                    ON u.id = following.reciever_user_id AND u.is_active = 1 AND u.is_delete = 0
                WHERE following.sender_user_id = ${visitorUser.id}
            `
        } else {
            // Visitor profile — show is_follower flag
            sqlQuery = `
                SELECT following.id, u.id, u.profile_photo_path, u.username,
                (CASE WHEN follower.id IS NULL THEN 0 ELSE 1 END) AS is_follower
                FROM tbl_follow AS following
                JOIN tbl_user AS u
                    ON u.id = following.reciever_user_id AND u.is_active = 1 AND u.is_delete = 0
                LEFT JOIN tbl_follow AS follower
                    ON follower.sender_user_id = following.reciever_user_id AND follower.reciever_user_id = ${user.id}
                WHERE following.sender_user_id = ${visitorUser.id}
            `
        }

        const [followingListResult] = await db.query(sqlQuery)

        if (followingListResult && followingListResult.length > 0) {
            return sendResponse(req, res, 200, 1, "Following List Fetched Successfully", {
                "followingsData": followingListResult
            })
        }
        return sendResponse(req, res, 400, 3, "No Followings Found", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Fetching Following List", {})
    }
}

const contactUs = async (req, res) => {
    try {
        if (Object.keys(req.loginUser) == 0) {
            return sendResponse(req, res, 400, 0, "Error At Fetching Login User Data")
        }

        let userId = req.loginUser.data.user_id
        const { full_name, email, subject, description } = req.body

        const [addContactUs] = await db.query(
            `INSERT INTO tbl_contact_us(user_id, full_name, email, subject, description) VALUES (?, ?, ?, ?, ?)`,
            [userId, full_name, email, subject, description]
        )

        if (addContactUs && addContactUs.affectedRows > 0) {
            return sendResponse(req, res, 200, 1, "Contact Us Data Submitted Successfully", {})
        }
        return sendResponse(req, res, 200, 0, "Error During Adding Contact Us Data", {})

    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, "Error At Contact Us", {})
    }
}

module.exports = { getUserProfile, toggleFollow, updateProfile, userSavePostList, followerList, followingList, contactUs }