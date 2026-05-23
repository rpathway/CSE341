import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Expense Tracker API',
    description: 'REST API for tracking personal expenses and budgeting.',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  tags: [
    { name: 'Expenses', prefix: '/expenses'},
    { name: 'Budgets', prefix: '/budgets'}
  ]
};


const outputFile = './swagger.json';
const routes = ['./routes/expenseRoute.js', './routes/budgetRoute.js'];

swaggerAutogen(outputFile, routes, doc);
