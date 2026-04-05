const express = require('express');
const db = require('../config/config.js');
const { sendResponse } = require('./middleware.js');
const jwt = require('jsonwebtoken');

const commonApiFunctions = {

    // OTP Generation and Storage
   otpFunction: async function (req, res, user_id, purpose) {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const expire_time = new Date(Date.now() + 5 * 60 * 1000);

        const [existingOtp] = await db.query(
            `SELECT * 
             FROM tbl_user_otp 
             WHERE user_id = ?
             AND otp_through = ?
             AND created_at >= NOW() - INTERVAL 5 MINUTE
             ORDER BY id DESC
             LIMIT 1`,
            [user_id, purpose]
        );

        if (existingOtp.length > 0) {
            return sendResponse(res, 200, 0, "OTP Already Sent. Please Wait 5 Minutes");
        }
        
        const [otpResult] = await db.query(
            `INSERT INTO tbl_user_otp 
             (user_id, otp, otp_through, expire_time)
             VALUES (?, ?, ?, ?)`,
             [user_id, otp, purpose, expire_time]
        );

        if (otpResult.affectedRows > 0) {
            const userData = await common.getUserById(user_id);
            return sendResponse(res, 200, 1, "OTP Sent To The Mobile Number", { userData, otp });
        }
        
        return sendResponse(res, 200, 0, "OTP Could Not Be Generated");
        
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, 0, "Internal Server Error");
    }
},

    // Dynamic Single/Multiple Query logic
    SingleQuery: async function ({ postId = null, categoryId = null, userId = null }) {
        try {
            let WhereClause = ` WHERE p.is_active = 1 `;
            const params = [userId];
            
            if (postId) {
                WhereClause += ` AND p.id = ? `;
                params.push(postId);
            }
            
            if (categoryId) {
                WhereClause += ` AND c.id = ? `;
                params.push(categoryId);
            }

            const [data] = await db.query(
                `SELECT 
                p.id, u.first_name, u.profile_pic, p.title, p.website_url, 
                c.name, p.description, 
                DATE_FORMAT(p.created_at, '%d %M %Y %h %i %p') AS DATE, 
                b.lat, b.long,
                (SELECT COUNT(*) FROM tbl_post_saved ps WHERE ps.post_id = p.id AND ps.user_id = ? AND ps.is_active = 1) AS is_saved,
                GROUP_CONCAT(DISTINCT pt.name) AS tags, 
                (SELECT GROUP_CONCAT(pi.media_url) FROM tbl_deals_post_image pi WHERE pi.post_id = p.id) AS postImage,  
                (SELECT COUNT(*) FROM tbl_post_comments pc WHERE pc.post_id = p.id) AS total_comments, 
                (SELECT AVG(pr.rating) FROM tbl_post_rating pr WHERE pr.post_id = p.id) AS Rating 
                 FROM tbl_deals_post p 
                 JOIN tbl_user u ON u.id = p.user_id 
                 JOIN tbl_business b ON b.user_id = u.id 
                 JOIN tbl_deals_category c ON c.id = b.category_id 
                 JOIN tbl_post_tag_bridge ptb ON ptb.post_id = p.id 
                 JOIN tbl_post_tag pt ON pt.id = ptb.tag_id 
                 ${WhereClause}
                 GROUP BY p.id`,
                 params
                );

            return data;
            
        } catch (error) {
            throw error;
        }
    } , 

    sendNotification : async function (res , senderId , reciverId , type , notifyId , title , message  ) {
        try{

            const query = `INSERT INTO tbl_notification (sender_user_id , receiver_user_id , notification_type , notify_id , title , message , is_read , notify_time)
        VALUES (? , ? , ? , ? , ? , ? , 0 , Now())
        `
        const [notification] = await db.query(query , [senderId , reciverId , type , notifyId , title , message])
        
        if(notification.affectedRows > 0){
            return sendResponse(res , 200 , 1 , `${type} Added And Notification Sended SuccessFully`)
        }
        return sendResponse(res , 500 , 0 , "Failed to Send Notification")
    }catch(error){
        console.log(error)
        return sendResponse(res , 500 , 0 , "Internal Server Error")
    }
    }
};

const common = {

    getUserById : async function(userId) {
      
        try {
        const [userData] = await db.query(
            `SELECT * 
             FROM tbl_user 
             WHERE id = ? AND status = "Active" `,
            [userId]
        );

        return userData.length > 0 ? userData[0] : null;

    } catch (error) {
        console.log("Error in getUserById:", error);
        throw error;
    }
    },
    
    generateToken: async function (user, req ,res) {
        try {
            
            const payload = {
                id: user.id || user[0].id,
                email: user.email || user[0].email,
                mobile: user.mobile || user[0].mobile
            };
            
            const user_id = user.id || user[0].id;
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "365d" });
            
            const { device_token, device_type, device_name, device_model, os_version, uuid, ip } = req.body;
            
            const [checkDevice] = await db.query(
                `SELECT id , user_id , uuid FROM tbl_user_device WHERE user_id=? AND uuid=?`,
                [user_id, uuid]
            );
            
            let result;
            if (checkDevice.length > 0) {
                let existinguser = checkDevice[0]
                if(existinguser.uuid === uuid){
                    return sendResponse(res, 500, 0, "User Already Loggedin");
    
                }
                const [updateResult] = await db.query(
                    `UPDATE tbl_user_device
                     SET user_token=?, device_token=?, device_type=?, device_name=?, device_model=?, os_version=?, ip=?
                     WHERE user_id=? AND uuid=?`,
                    [token, device_token, device_type, device_name, device_model, os_version, uuid, ip, user_id, uuid]
                );
                result = updateResult;
            } else {
                const [insertResult] = await db.query(
                    `INSERT INTO tbl_user_device
                     (user_id, user_token, device_token, device_type, device_name, device_model, os_version, uuid, ip)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [user_id, token, device_token, device_type, device_name, device_model, os_version, uuid, ip]
                );
                result = insertResult;
            }

            if (result.affectedRows > 0) {
                return token;
            }
            throw new Error("Token Operation Failed");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

module.exports = { commonApiFunctions, common };