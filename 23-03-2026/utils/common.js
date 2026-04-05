const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("../config/db")
const { userProfile_image_server_path } = require("../constants")

dotenv.config()

const common = {

    jwt_sign: (data, expiresIn = "365d") => {
        const token = jwt.sign(
            { data },
            process.env.JWT_WEB_TOKEN,
            { expiresIn }
        )

        return token
    },

    addDeviceData: async function (deviceDataObj) {
        try {
            if (deviceDataObj.user_id && deviceDataObj.token && deviceDataObj.device_type && deviceDataObj.device_name && deviceDataObj.device_model && deviceDataObj.os_version && deviceDataObj.ip) {
                let result = await db.query(
                    "INSERT INTO tbl_user_device(user_id, token, device_type, device_name, device_model, os_version, ip) values (?,?,?,?,?,?,?)",
                    [deviceDataObj.user_id, deviceDataObj.token, deviceDataObj.device_type, deviceDataObj.device_name, deviceDataObj.device_model, deviceDataObj.os_version, deviceDataObj.ip]
                )
                if (result[0].affectedRows > 0) {
                    return deviceDataObj.token
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (err) {
            console.log(err)
            return null
        }
    },

    getUser: async (user_id) => {
        try {
            const result = await db.query("SELECT * FROM tbl_user WHERE id=?", [user_id])
            if (result && result[0] && result[0].length > 0) {

                if (result[0][0].profile_photo_path != null) {
                    result[0][0].profile_photo_path = userProfile_image_server_path + result[0][0].profile_photo_path
                }

                return result[0][0]
            }
            return null

        } catch (err) {
            console.log(err)
            return null
        }
    },

    getUserDevice: async (user_id) => {
        try {
            const result = await db.query("SELECT * FROM tbl_user_device WHERE user_id=?", [user_id])

            if (result && result[0] && result[0].length > 0) {
                return result[0][0]
            }
            return null
        }
        catch (err) {
            console.log(err)
            return null
        }
    },
 getPost: async (post_id) => {
    try {
        const [[post]] = await db.query(`
            SELECT
                p.id                 AS post_id,
                p.post_user_id       AS user_id,
                p.post_type,
                p.ranking_expired_on,
                p.cat_id,
                p.description,
                u.username,
                u.profile_photo_path,
                c.name               AS category_name,
                (
                    SELECT GROUP_CONCAT(
                        CONCAT('{"m_id":', m2.id, ',"type":"', m2.media_type, '","url":"', m2.media_url, '"}')
                        SEPARATOR ','
                    )
                    FROM tbl_post_media m2
                    WHERE m2.post_id = p.id
                      AND m2.is_active = 1
                      AND m2.is_delete = 0
                ) AS media,
                COUNT(DISTINCT r.id)                                              AS ranking_total,
                COUNT(DISTINCT rate.id)                                           AS rating_total,
                ROUND(SUM(rate.rating) / NULLIF(COUNT(DISTINCT rate.id), 0), 2)  AS rating_avg
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
            WHERE p.is_active = 1 AND p.is_delete = 0 AND p.id = ?
            GROUP BY p.id
        `, [post_id])

        if (!post) return null

        if (post.profile_photo_path) {
            post.profile_photo_path = userProfile_image_server_path + post.profile_photo_path
        }

        // inline parse — same logic as parseMedia in post_model.js
        post.media = post.media ? JSON.parse(`[${post.media}]`) : []

        return post

    } catch (err) {
        console.error("getPost error:", err)
        return null
    }
}
}

module.exports = common