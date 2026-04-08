const express = require("express")
const app = express()
const db = require("./config/database.js")
const swaggerUi = require("swagger-ui-express")
const { swaggerSpec } = require("./config/swagger")

const dotenv = require('dotenv') 
const userAuthRoutes = require("./routes/v1/auth.routes.js")
const userRoutes = require("./routes/v1/user.routes.js")


dotenv.config()

const PORT = process.env.PORT

// Parse JSON request bodies.
app.use(express.json());

// Parse encrypted/plain text request bodies used by decryption middleware.
app.use(express.text({ type: ["text/plain", "application/octet-stream"] }));

// Parse form-urlencoded request bodies.
app.use(express.urlencoded({ extended: true }));

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


//user authentication routes
app.use("/api/v1/auth/user", userAuthRoutes)
app.use("/api/v1/user", userRoutes)


const startServer = async () => {
    try {
        // Verify DB connectivity before accepting requests.
        const result = await db.query("SELECT 1");
        
        if (result && result[0]) {
            console.log("Database connected successfully");
            
            app.listen(PORT, () => {
                console.log(`Server Is Running On ${PORT}`);
            });
        } else {
            console.error("Database connection failed: No result");
        }
    } catch (err) {
        // Stop process on startup DB failure.
        console.error("Error while connecting to DB:", err.message);
        process.exit(1); 
    }
};

startServer();



