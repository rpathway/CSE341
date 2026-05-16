import swaggerAutogen from 'swagger-autogen';

swaggerAutogen();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Contacts API'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
  basePath: 'Contacts'
};

const outputFile = './swagger.json';
const routes = ['./routes/endpoints.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);