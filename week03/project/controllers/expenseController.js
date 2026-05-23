import { ObjectId } from 'mongodb';
import expenseModel from '../models/expenseModel.js';


const expenseController = {};



// GET /expenses
expenseController.getAllExpenses = async function(req, res) {
  try {
    const { category, status, paymentMethod } = req.query;
    const expenses = await expenseModel.getAll({
      category,
      status,
      paymentMethod
    });

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to retrieve expenses'
    });
  }
};

// GET /expenses/:id
expenseController.getExpenseById = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid expense ID format'
      });
    }

    const expense = await expenseModel.getById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to retrieve expense'
    });
  }
};

// POST /expenses
expenseController.createExpense = async function(req, res) {

  try {
    const errors = expenseModel.validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    const doc = expenseModel.buildExpenseDoc(req.body);
    const created = await expenseModel.create(doc);
    
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create expense'
    });
  }
};

// PUT /expenses/:id
expenseController.updateExpense = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid expense ID format'
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body cannot be empty'
      });
    }

    const errors = expenseModel.validateExpense(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    const existing = await expenseModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    const doc = expenseModel.buildExpenseDoc(req.body, true);
    const updated = await expenseModel.update(req.params.id, doc);
    
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to update expense'
    });
  }
};

// DELETE /expenses/:id
expenseController.deleteExpense = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid expense ID format'
      });
    }

    const existing = await expenseModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    await expenseModel.remove(req.params.id);
    res.status(200).json({
      message: 'Expense deleted successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to delete expense'
    });
  }
};


export default expenseController;