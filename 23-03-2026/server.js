const dotenv = require("dotenv")
const express = require("express")
const authRoute = require("./routes/v1/auth_route")
const db = require("./config/db")
const postRoute = require("./routes/v1/post_route")
const userRoute = require('./routes/v1/user_route')
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./swagger.js")

const app = express()
dotenv.config()


const PORT = process.env.PORT

app.use(express.json())

// add this before your routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/user", userRoute)

const dbConnection = async (req, res) => {
    try {
        const result = await db.query("SELECT 1")
        console.log(result)
        if (result && result[0]) {
            app.listen(PORT, () => {
                console.log(`Server Is Running On ${PORT}`)
            })
        }
        console.log(err)
        res.status(500).send("Error While Connection To Db")
    } catch (err) {
    }
}

app.get("/test", (req, res) => {
    res.status(200).send("Test")
})
dbConnection()