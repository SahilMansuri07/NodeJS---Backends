const swaggerJsdoc = require("swagger-jsdoc")
const fs = require("fs")
const path = require("path")

const options = {
    definition: JSON.parse(fs.readFileSync(path.join(__dirname, "swagger-api-docs.json"), "utf8")),
    apis: []  // No longer need separate files
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec