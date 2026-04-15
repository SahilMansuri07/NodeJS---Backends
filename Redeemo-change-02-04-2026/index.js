const express = require("express")
const app = express()
const db = require("./config/database.js")

const dotenv = require('dotenv') 
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const { adminAuthRoute, userAuthRoute } = require("./routes/v1/auth.routes.js")
const { interestRoute, manageUserRoute, managetypeRoutes, manageMerchRoutes, voucherRoutes } = require("./routes/v1/admin.routes.js")
const { merchRoutes , notificationRoutes , cmsRoutes } = require("./routes/v1/user.routes.js")
const { encryption, decryption  } = require("./utils/middelware.js")

dotenv.config()

const PORT = process.env.PORT

app.use(express.text({ type: ["text/plain", "application/octet-stream"] }));
app.use(express.urlencoded({ extended: true }));

//user Routes
app.use("/api/v1/admin/auth", adminAuthRoute)
app.use("/api/v1/user/auth", userAuthRoute)

app.post("/encryption" ,  (req , res) => {
    console.log(req.body)
    let encryption_1 = encryption( req.body)
    return res.status(200).send(encryption_1)
})


app.post("/decryption" ,  (req , res ) => {

    console.log(req.body)
    let decryption_1 = decryption(req , res )
    return res.status(200).send(decryption_1)

})
// admin routes
app.use("/api/v1/user/merch", merchRoutes);
app.use("/api/v1/user/notification", notificationRoutes);
app.use("/api/v1/user/cms", cmsRoutes);

// admin routes
app.use("/api/v1/admin/user" , manageUserRoute)
app.use("/api/v1/admin/types" , managetypeRoutes)
app.use("/api/v1/admin/interest" , interestRoute)

//admin Routes
app.use("/api/v1/admin/auth" , adminAuthRoute)
app.use("/api/v1/admin/merch" , manageMerchRoutes)
app.use("/api/v1/admin/voucher" , voucherRoutes)


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{
    swaggerOptions: {
        persistAuthorization: true,
        authAction: {
            apiKeyAuth:{
                name:"apiKeyAuth",
                schema:{
                    type:"apiKey",
                    in:"header",
                    name:"api-key"
                },
                value:process.env.API_KEY
            }
        }
    }
}));

const startServer = async () => {
    try {
        const result = await db.query("SELECT 1");
        
        if (result && result[0]) {
            console.log("Database connected successfully");
            
            app.listen(PORT, () => {
                console.log(`Server Is Running On ${PORT}`);
            });
        } else {
            // Handle case where query runs but returns no data
            console.error("Database connection failed: No result");
        }
    } catch (err) {
        // This catches the actual connection error
        console.error("Error while connecting to DB:", err.message);
        process.exit(1); // Stop the server if DB fails
    }
};

startServer();



