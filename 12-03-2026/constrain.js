

// function otpFunction(req, res, user_id, purpose) {

//     // Generate OTP
//     const otp = Math.floor(1000 + Math.random() * 9000)
//     const expire_time = new Date(Date.now() + 5 * 60 * 1000)
    
//     // Insert OTP
//     const otpQuery = `
//         INSERT INTO tbl_user_otp 
//         (user_id, otp, otp_through ,expire_time)
//         VALUES (?, ?, ? ,?)
//         `
//     db.query(
//         otpQuery,
//         [user_id, otp, purpose, expire_time],
//         (otpError, otpResult) => {

//             if (otpError) {
//                 return res.json({
//                     code: 0,
//                     message: "User created but OTP failed",
//                     error: otpError
//                 })
//             }

//             return res.send({
//                 code: 1,
//                 message: "User registered successfully & OTP generated",
//                 user_id: user_id,
//             })

//         }
//     )
// }


// function SingleQuery({postId = null , categoryId = null , userId = null} , req , res){

//     let WhereClause = ` WHERE p.is_active = 1 `
//     const params = [userId]

//     if(postId){
//         WhereClause += ` AND p.id = ? `
//         params.push(postId)
//     }
//     if(categoryId){
//         WhereClause += ` AND c.id = ? `
//         params.push(postId)
//     }

//      const q = `
//         SELECT 
//             p.id,
//             u.first_name, 
//             u.profile_pic, 
//             p.title, 
//             p.website_url, 
//             c.name, 
//             p.description, 
//             DATE_FORMAT(p.created_at, '%d %M %Y %h %i %p') AS DATE, 
//             b.lat, 
//             b.long,
//             (
//                 SELECT COUNT(*) 
//                 FROM tbl_post_saved ps 
//                 WHERE ps.post_id = p.id AND ps.user_id = ? AND ps.is_active = 1
//             ) AS is_saved,
//             GROUP_CONCAT(DISTINCT pt.name) AS tags, 
//             (
//                 SELECT GROUP_CONCAT(pi.media_url) 
//                 FROM tbl_deals_post_image pi 
//                 WHERE pi.post_id = p.id 
//             ) AS postImage,  
//             (
//                 SELECT COUNT(*) 
//                 FROM tbl_post_comments pc 
//                 WHERE pc.post_id = p.id 
//             ) AS total_comments, 
//             (
//                 SELECT AVG(pr.rating) 
//                 FROM tbl_post_rating pr 
//                 WHERE pr.post_id = p.id 
//             ) AS Rating 
//         FROM tbl_deals_post p 
//         JOIN tbl_user u ON u.id = p.user_id 
//         JOIN tbl_business b ON b.user_id = u.id 
//         JOIN tbl_deals_category c ON c.id = b.category_id 
//         JOIN tbl_post_tag_bridge ptb ON ptb.post_id = p.id 
//         JOIN tbl_post_tag pt ON pt.id = ptb.tag_id 
//         ${WhereClause}
//         GROUP BY p.id;
//     `
//      return new Promise((resolve, reject) => {
//         db.query(q, params, (error, data) => {
//             if (error) return reject(error)
//             resolve(data)
//         })
//     })

// }



// module.exports ={ otpFunction , SingleQuery}

