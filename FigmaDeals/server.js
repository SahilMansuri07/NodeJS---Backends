// Import required modules
const express = require('express');
const path = require("path");
const db = require('./config/database')
const credential = require('./config/credential');
// Initialize express app
const app = express();
app.use(express.urlencoded({ extended: false }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "templates"));
    

//to use json data
app.use(express.json());

// // used for parsing data in encodede version


//database connected
db.query("select 1", (error, result) => {
    if (error) {
        console.log("Error Connnecting to Database", error);
    } else {
        console.log("DataBase Connected Successfully");
    }
})
//redirect to login  Page
app.get('/signup', async (req, res) => {
    return res.render("signup")
})

app.get('/', async (req, res) => {
    return res.render("login")
})

//login User API 
app.post('/login', (req, res) => {

    const { email, password } = req.body;
    db.query(`SELECT id, email, password FROM tbl_user WHERE email = ? AND password = ?`, [email, password], (error, loginData) => {
        if (error) {
            console.log(error);
            return res.send("Login Error");
        }
        console.log(loginData)

        if (loginData.length > 0) {
            console.log("Login Success");
            return res.redirect(`/dashboard/${loginData[0].id}`);
        } else {
            // user not found
            return res.send("Invalid Email or Password");
        }

    });

});


//signup user 

app.post('/signup', async (req, res) => {

    const Useremail = req.body.email;

    await db.query(`SELECT * FROM tbl_user WHERE email = ?`, [Useremail], (error, loginData) => {

        if (error) {
            console.log(error);
            return res.send("Login Error");
        }

        if (loginData.length > 0) {
            return res.status(400).json("User Already Exists");
        }


        const userData = {
            username,
            first_name,
            last_name,
            country_code,
            mobile,
            email,
            password,
            bio,
            profile_pic,
            banner_pic,
            referral_code
        } = req.body;
        console.log(userData);
        console.log()

        db.query(
            `INSERT INTO tbl_user 
            (username, first_name, last_name, country_code, mobile, email, password, bio, profile_pic, banner_pic, referral_code) 
            VALUES (?)`,
            [userData],
            (error, signupData) => {

                if (error) {
                    console.log(error);
                    return res.send("Signup Error");
                }
                return res.redirect(`/dashboard/${signupData.insertId}`);
            }
        );
    });

});



app.get('/dashboard/:id', async (req, res) => {
    const id = req.params.id
    let result = { id: id }
    const user = (`
        SELECT * from tbl_user u where u.id = ?;
        `)
    db.query(user, id, (error, userData) => {
        //console.log(error, categoryData)
        if (!error && userData.length < 0) {
            res.json({ error, message: "userData data error" })
        }

        result.userData = userData
        // console.log('category data result',result)
        if (userData.length === 0) {
            return res.status(404).send("User not found");
        }
    })

    const category = (`
        SELECT  
        p.title ,  
        b.category_id ,  
        c.name, 
        c.image_url 
        FROM tbl_deals_post p 
        JOIN tbl_user u  
        ON u.id = p.user_id 
        JOIN tbl_business b  
        ON b.user_id = u.id 
        JOIN tbl_deals_category c 
        ON c.id = b.category_id WHERE c.is_active =1 GROUP BY c.name;
        `)
    await db.query(category, (error, categoryData) => {
        console.log(error, categoryData)
        if (!error && categoryData.length < 0) {
            res.json({ error, message: "category data error" })
        }

        result.categoryData = categoryData
        // console.log('category data result',result)
    })

    //post query 
    const postQuery = (`
        SELECT  
        u.first_name, 
        u.profile_pic, 
        p.id,
        p.title, 
            date_format(p.created_at , '%d %M %Y %h %i %p' ) as date,  
            b.address, 
            ROUND( 
        ( 
            6371 * ACOS( 
            COS(RADIANS(u.latitude)) 
            * COS(RADIANS(p.lat)) 
            * COS( 
                RADIANS(p.long)  
                - RADIANS(u.longitude) 
                ) 
            + SIN(RADIANS(u.latitude)) 
            * SIN(RADIANS(p.lat)) 
            ) 
        ), 
        1) as Nearest, 
        (SELECT GROUP_CONCAT(pi.media_url) FROM tbl_deals_post_image pi WHERE pi.post_id = p.id) as postImage, 
        (SELECT COUNT(*) FROM tbl_post_comments pc WHERE pc.post_id = p.id) as total_comments, 
        (SELECT AVG(pr.rating) FROM tbl_post_rating pr WHERE pr.post_id = p.id) as Rating  
        FROM tbl_deals_post p  
        JOIN tbl_user u 
        ON u.id = p.user_id 
        JOIN tbl_business b  
        ON b.user_id = u.id 
        JOIN tbl_deals_category c 
        ON c.id = b.category_id  WHERE p.is_active = 1 ORDER BY Nearest;
        `);

    db.query(postQuery, (error, postsData) => {
        console.log("this is data", postsData)
        if (!error && postsData.length < 0) {
            res.json({ error, message: "post data error" })
        }
        result.postsData = postsData
  
        if (result) {
            return res.render("dashboard", { result })
        } else {
            return res.render("dashboard", { result: [] })
        }

    })

})


//get post By user 
app.get('/post/:id', async (req, res) => {

    const postId = req.params.id
    const q = (`
            SELECT 
            p.id,
        u.first_name, 
        u.profile_pic, 
        p.title, 
        p.website_url, 
        c.name, 
        p.description, 
        DATE_FORMAT( 
            p.created_at, 
            '%d %M %Y %h %i %p' 
        ) AS DATE, 
        b.lat, 
        b.long, 
        GROUP_CONCAT(DISTINCT pt.name)AS tags, 
        ( 
        SELECT 
            GROUP_CONCAT(pi.media_url) 
        FROM 
            tbl_deals_post_image pi 
        WHERE 
            pi.post_id = p.id 
    ) AS postImage,  
    (
        SELECT
            COUNT(*) 
        FROM 
            tbl_post_comments pc 
        WHERE 
            pc.post_id = p.id 
    ) AS total_comments, 
    ( 
        SELECT 
            AVG(pr.rating) 
        FROM 
            tbl_post_rating pr 
        WHERE 
            pr.post_id = p.id 
    ) AS Rating 
    FROM 
        tbl_deals_post p 
    JOIN tbl_user u ON 
        u.id = p.user_id 
    JOIN tbl_business b ON 
        b.user_id = u.id 
    JOIN tbl_deals_category c ON 
        c.id = b.category_id 
    JOIN tbl_post_tag_bridge ptb ON 
    ptb.post_id = p.id 
    JOIN tbl_post_tag pt on 
    pt.id = ptb.tag_id 
    WHERE 
        p.is_active = 1 AND p.id = ?;
        `)

    db.query(q, postId, (error, postData) => {
        console.log(error, postData)
        if (!error) {
            return res.render("post", { postData })
        } else {
            return res.render("post", { postData: [] })
        }

    })
})



//get post By user 
app.get('/category/:id', async (req, res) => {

    const categoryID = req.params.id
    const q = (`
        SELECT 
        p.id,
        p.title, 
        p.website_url, 
        c.name, 
        p.description, 
        DATE_FORMAT(p.created_at,'%d %M %Y %h %i %p') AS DATE,
        GROUP_CONCAT(DISTINCT pt.name) AS tags,
        (
            SELECT GROUP_CONCAT(pi.media_url)
            FROM tbl_deals_post_image pi
            WHERE pi.post_id = p.id
        ) AS postImage,
        (
            SELECT COUNT(*)
            FROM tbl_post_comments pc
            WHERE pc.post_id = p.id
        ) AS total_comments,
        (
            SELECT AVG(pr.rating)
            FROM tbl_post_rating pr
            WHERE pr.post_id = p.id
        ) AS Rating
    FROM tbl_deals_post p
    JOIN tbl_business b 
        ON b.user_id = p.user_id
    JOIN tbl_deals_category c 
        ON c.id = b.category_id
    JOIN tbl_post_tag_bridge ptb 
        ON ptb.post_id = p.id
    JOIN tbl_post_tag pt 
        ON pt.id = ptb.tag_id
    WHERE p.is_active = 1 
    AND c.id = ?
    GROUP BY p.id;
        `)

    db.query(q, categoryID, (error, categoryData) => {
        console.log(error, categoryData)
        if (!error) {
            return res.render("category", { categoryData: categoryData })
        } else {
            return res.json("error getting data")
        }
    })
})


//comments For single post 
app.get("/comments/:id", async (req, res) => {
    const postID = req.params.id
    console.log(postID)
    let result = { id: postID }
    const postQ = (`
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
            `)
    db.query(postQ, postID, (error, postData) => {
        console.log(error, postData);
        if (error) {
            res.json("Error Getting Data ", error)
        } else {
            result.postData = postData
        }
    })

    const commentquery = (`
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
        `)

    db.query(commentquery, postID, (error, commentData) => {
        console.log(error, commentData)

        if (error) {
            res.json("Error Getting Data ", error)
        } else {
            result.commentData = commentData;

            return res.render("comments", { result: result })
        }
    })
})


app.post('/addcomments/:id/:Uid', async (req, res) => {

    try {

        const postID = req.params.id
        const userID = req.params.Uid
        const description = req.body.description

        const q = `
        INSERT INTO tbl_post_comments (post_id, user_id, description)
        VALUES (?, ?, ?)
        `

        db.query(q, [postID, userID, description], (error, data) => {

            if (error) {
                console.log(error)
                return res.send("Comment Insert Error")
            }

            return res.redirect(`/comments/${postID}`)
        })

    } catch (error) {
        res.send(error)
    }

})


//profile data 
app.get('/profile/:id', async (req, res) => {
    const userID = req.params.id
    const profileData = { id: userID }
    const profileQuery = (`
        SELECT 
        u.id AS user_id, 
        u.is_premium, 
        CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
        u.profile_pic, 
        u.banner_pic AS cover_photo, 
        u.bio, 
        b.company_name, 
        c.name AS business_category, 
        ( 
        SELECT 
        COUNT(*) 
        FROM 
        tbl_user_follows 
        WHERE 
        sender_user_id = u.id AND is_delete = 0 
        ) AS following_count, 
        ( 
        SELECT 
        COUNT(*) 
        FROM 
        tbl_user_follows 
        WHERE 
        receiver_user_id = u.id AND is_delete = 0 
        ) AS followers_count, 
        ( 
        SELECT 
        COUNT(*) 
        FROM 
        tbl_deals_post 
        WHERE 
        user_id = u.id AND is_delete = 0 
        ) AS total_posts_count 
        FROM 
        tbl_user u 
        LEFT JOIN tbl_business b ON 
        u.id = b.user_id 
        LEFT JOIN tbl_deals_category c ON 
        b.category_id = c.id 
        WHERE 
        u.id = ?;
        `);

    db.query(profileQuery, userID, (error, udata) => {
        console.log(error, udata)
        if (!error) {
            profileData.udata = udata
        }
    })

    const postimage = (`
            SELECT
            p.id AS post_id,
            (
            SELECT
            media_url
            FROM
            tbl_deals_post_image
            WHERE
            post_id = p.id
            LIMIT 1
            ) AS postimage
            FROM
            tbl_deals_post p
            WHERE
            p.user_id = ? AND p.is_active = 1 AND p.is_delete = 0
            ORDER BY
            p.created_at
            DESC
            ;
            `)

    db.query(postimage, userID, (error, postimage) => {
        console.log(error, postimage)
        if (!error) {
            profileData.postimage = postimage
            return res.render('profile', { profileData: profileData })
        }
    })
})

app.get('/followers/:id', async (req, res) => {
    const userID = req.params.id
    const followersQ = (`
        
    SELECT
    u.id,
    u.username,
    u.profile_pic
FROM
    tbl_user_follows f
JOIN tbl_user u ON
    f.sender_user_id = u.id 
WHERE
    f.receiver_user_id = ?;
        `)

    db.query(followersQ, userID, (error, followersData) => {
        console.log(error, followersData)
        if (!error) {
            return res.render('followers', { followersData: followersData })
        }
    })
})

app.get('/following/:id', async (req, res) => {
    const userID = req.params.id
    const followingsQ = (`
         SELECT
    u.id,
    u.username,
    u.profile_pic
FROM
    tbl_user_follows f
JOIN tbl_user u ON
    f.receiver_user_id = u.id 
WHERE
    f.sender_user_id = ?;
        `)

    db.query(followingsQ, userID, (error, followingsData) => {
        console.log(error, followingsData)
        if (!error) {
            return res.render('followings', { followingsData: followingsData })
        }
    })
})

// Start Server
app.listen(credential.PORT, () => {
    console.log(`Server running on port http://localhost:${credential.PORT}/`);
});
