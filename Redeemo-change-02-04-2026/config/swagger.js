const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Redeemo API',
    version: '1.0.0',
    description: 'API documentation for Redeemo application',
  },
  servers: [
    {
      url: 'http://localhost:' + (process.env.PORT || 2000) + '/api/v1',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'api-key',
        description: 'API Key required for all routes',
      },
      UserAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'User JWT token',
      },
      AdminAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'Admin JWT token',
      },
      SuperadminAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'Superadmin JWT token',
      },
    },
  },
  security: [
    { ApiKeyAuth: [] },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/v1/admin/*.js',
    './routes/v1/superAdmin/*.js',
    './routes/v1/user/*.js',
    './routes/v1/cms/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
