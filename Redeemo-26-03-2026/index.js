const express = require("express")
const app = express()
const db = require("./config/database.js")

const dotenv = require('dotenv') 
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const notificationRoutes = require("./routes/v1/user/notification.routes.js")

const superAdminAuthRoute = require("./routes/v1/superAdmin/auth.routes.js")


const manageUserRoute = require("./routes/v1/superAdmin/manageUser.routes.js")
const managetypeRoutes = require("./routes/v1/superAdmin/merchTypes.routes.js")
const manageMerchRoutes = require("./routes/v1/admin/merchent.routes.js")
const manageInterestRoute = require("./routes/v1/superAdmin/manageInterestRoute.js")
const voucherRoutes = require("./routes/v1/admin/voucher.routes.js")
const merchRoutes = require("./routes/v1/user/merchants.routes.js")
const cmsRoutes = require("./routes/v1/cms/cms.routes.js")
const { adminAuthRoute, userAuthRoute } = require("./routes/v1/auth.routes.js")

dotenv.config()

const PORT = process.env.PORT

app.use(express.json())

//user Routes
app.use("/api/v1/admin/auth", adminAuthRoute)
app.use("/api/v1/user/auth", userAuthRoute)




app.use("/api/v1/user/notification", notificationRoutes)
app.use("/api/v1/user/home", merchRoutes)

//super Admin Routes
app.use("/api/v1/superAdmin/auth" , superAdminAuthRoute)
app.use("/api/v1/superAdmin/user" , manageUserRoute)
app.use("/api/v1/superAdmin/types" , managetypeRoutes)
app.use("/api/v1/superAdmin/interest" , manageInterestRoute)

//admin Routes
app.use("/api/v1/admin/auth" , adminAuthRoute)
app.use("/api/v1/admin/merch" , manageMerchRoutes)
app.use("/api/v1/admin/voucher" , voucherRoutes)

//cms Routes
app.use("/api/v1/cms", cmsRoutes)

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



