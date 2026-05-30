// #swagger.basePath = '/expenses'
import express from 'express';
import expenseController from '../controllers/expenseController.js';
import authController from '../controllers/authenticate.js';

const router = express.Router();


router.get('/',
  // #swagger.tags = ['Expenses']
  // #swagger.summary = 'Get all expenses'
  // #swagger.description = 'Returns all expenses. Filter by category, status, or paymentMethod.'
  authController.isAuthenticated,
  expenseController.getAllExpenses
);
router.get('/:id',
  // #swagger.tags = ['Expenses']
  // #swagger.summary = 'Get a single expense by ID'
  authController.isAuthenticated,
  expenseController.getExpenseById
);
router.post('/',
  // #swagger.tags = ['Expenses']
  // #swagger.summary = 'Create a new expense'
  /*  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["amount", "description", "category", "date", "paymentMethod"],
              properties: {
                amount:        { type: "number",  example: 42.50 },
                description:   { type: "string",  example: "Grocery run" },
                category:      { type: "string",  example: "food" },
                date:          { type: "string",  example: "2024-05-01" },
                paymentMethod: { type: "string",  example: "credit_card" },
                merchant:      { type: "string",  example: "Walmart" },
                currency:      { type: "string",  example: "CAD" },
                status:        { type: "string",  example: "cleared" },
                receiptUrl:    { type: "string",  example: "https://example.com/receipt.pdf" }
              }
            }
          }
        }
      }
  */
  authController.isAuthenticated,
  expenseController.createExpense
);
router.put('/:id',
  // #swagger.tags = ['Expenses']
  // #swagger.summary = 'Update an existing expense'
  authController.isAuthenticated,
  expenseController.updateExpense
);
router.delete('/:id',
  // #swagger.tags = ['Expenses']
  // #swagger.summary = 'Delete an expense by ID'
  authController.isAuthenticated,
  expenseController.deleteExpense
);


export default router;