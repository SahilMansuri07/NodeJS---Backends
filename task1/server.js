// Import required modules
const express = require('express');
const db = require('./config/database');
const credential = require('./config/credential');


// Initialize express app
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');


//to use json data
app.use(express.json());

// used for parsing data in encodede version
app.use(express.urlencoded({ extended: true }));


// Test Database Connection
db.query('SELECT 1', function (error, result) {
    if (error) {
        console.log("Database Connection Failed:", error);
    } else {
        console.log("Database Connected Successfully");
    }
});

// Routes

// home Route 
app.get('/test', (req, res) => {
    res.send("test Server is running");
});

// Get All Trainees
app.get('/getUser', async (req, res) => {

    await db.query("SELECT * FROM tbl_trainees WHERE training_status IN ('Completed','Dropped','Active')", (error, result) => {

        // console.log(error, result);

        if (!error && result.length > 0) {
            return res.render(__dirname + "/listing.html", { result: result })
        }
        console.log(error);
        return res.render(__dirname + "/listing.html", { result: [] })
    });
});


// Get SIngle Trainie data
app.get('/edit/:id', async (req, res) => {
    const userID = req.params.id;
    console.log(userID)
    await db.query('SELECT * FROM tbl_trainees WHERE id = ? ', [userID], (error, result) => {

        console.log("This is edited result", result)

        if (!error && result.length > 0) {
            return res.render(__dirname + "/edit.html", { result: result[0] })
        }
        console.log(error);
        return res.render(__dirname + "/edit.html", { result: [] })
    })
})



app.post('/updateUser/:id', (req, res) => {

    const userID = req.params.id;
    console.log(userID)

    const {
        name,
        email,
        phone,
        gender,
        education,
        address,
        mentor_name,
    } = req.body;

    const sql = `
        UPDATE tbl_trainees 
        SET name = ?, 
            email = ?, 
            phone = ?, 
            gender = ?, 
            education = ?, 
            address = ?,  
            mentor_name = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, phone, gender, education, address, mentor_name, userID],
        (error, result) => {

            if (!error && result.affectedRows  > 0) {
                console.log("Trainee Updated Successfully");
                return res.redirect('/getUser');
            }else{

                console.log(error);
                res.send("Update Failed");
            }
            
        }
    );
});

//redirect to add USer Page
app.get('/add', async (req, res) => {
    return res.render(__dirname + "/addTrainees.html")
})


//add trainees into the database
app.post('/addTrainees', (req, res) => {

    const {
        name,
        email,
        phone,
        gender,
        education,
        address,
        mentor_name,
    } = req.body;

    const sql = `
        INSERT INTO tbl_trainees 
        (name, email, phone, gender, education, address, mentor_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [name, email, phone, gender, education, address, mentor_name],
        (error, result) => {

            if (error) {
                console.log(error);
                return res.send("Insert Failed");
            }

            console.log("Trainee Added Successfully");
            res.redirect('/getUser');
        }
    );
});


//delete Trainees By there ID
app.get('/deleteUser/:id', async (req, res) => {
    const userID = req.params.id;
    console.log(userID)
    await db.query('UPDATE tbl_trainees SET training_status = "Delete" WHERE id = ? ', [userID], (error, result) => {

        console.log("This is deleted result", result)

        if (!error && result.length > 0) {
            return res.redirect("/getUser")
        }
        console.log(error);
        return res.redirect("/getUser")
    })
})

// Start Server

app.listen(credential.PORT, () => {
    console.log(`Server running on port ${credential.PORT}`);
});