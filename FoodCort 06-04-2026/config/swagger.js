const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "FoodCort API",
        version: "1.0.0",
        description: "API documentation for FoodCort backend",
    },
    servers: [
        {
            url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
            description: "Default server",
        },
    ],
    components: {
        securitySchemes: {
            apiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "api-key",
            },
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ApiSuccessResponse: {
                type: "object",
                properties: {
                    code: { type: "string", example: "0" },
                    message: { type: "string", example: "Success" },
                    data: { type: "object" },
                },
            },
            ApiErrorResponse: {
                type: "object",
                properties: {
                    code: { type: "string", example: "-1" },
                    message: { type: "string", example: "Validation error" },
                    data: { type: "object", example: {} },
                },
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: ["./routes/v1/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
