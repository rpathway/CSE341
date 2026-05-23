// #swagger.basePath = '/budgets'
import express from 'express';
import budgetController from '../controllers/budgetController.js';


const router = express.Router();


router.get('/',
  // #swagger.tags = ['Budgets']
  // #swagger.summary = 'Get all budgets'
  budgetController.getAllBudgets
);
router.get('/:id',
  // #swagger.tags = ['Budgets']
  // #swagger.summary = 'Get a single budget by ID'
  budgetController.getBudgetById
);
router.post('/',
  // #swagger.tags = ['Budgets']
  // #swagger.summary = 'Create a new budget'
  /* #swagger.requestBody = {
        required: true,
        content: {
          application/json: {
            schema: {
              type: object,
              properties: {
                name:     { type: string, example: "Monthly Groceries" },
                category: { type: string, example: "food" },
                limit:    { type: number, example: 500 },
                period:   { type: string, example: "monthly" },
                notes:    { type: string, example: "Includes household items" }
              }
            }
          }
        }
      }
   */
  budgetController.createBudget
);
router.put('/:id',
  // #swagger.tags = ['Budgets']
  // #swagger.summary = 'Update an existing budget'
  budgetController.updateBudget
);
router.delete('/:id',
  // #swagger.tags = ['Budgets']
  // #swagger.summary = 'Delete a budget by ID'
  budgetController.deleteBudget
);


export default router;
