import { ObjectId } from 'mongodb';
import budgetModel from '../models/budgetModel.js';


const budgetController = {};



// GET /budgets
budgetController.getAllBudgets = async function(req, res) {
  try {
    const budgets = await budgetModel.getAll();

    res.status(200).json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to retrieve budgets'
    });
  }
};

// GET /budgets/:id
budgetController.getBudgetById = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid budget ID format'
      });
    }

    const budget = await budgetModel.getById(req.params.id);
    if (!budget) {
      return res.status(404).json({
        error: 'Budget not found'
      });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to retrieve budget'
    });
  }
};

// POST /budgets
budgetController.createBudget = async function(req, res) {
  try {
    const errors = budgetModel.validateBudget(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    const doc = budgetModel.buildBudgetDoc(req.body);
    const created = await budgetModel.create(doc);
    
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create budget'
    });
  }
};

// PUT /budgets/:id
budgetController.updateBudget = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid budget ID format'
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body cannot be empty'
      });
    }

    const errors = budgetModel.validateBudget(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    const existing = await budgetModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        error: 'Budget not found'
      });
    }

    const doc = budgetModel.buildBudgetDoc(req.body, true);
    const updated = await budgetModel.update(req.params.id, doc);
    
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to update budget'
    });
  }
};

// DELETE /budgets/:id
budgetController.deleteBudget = async function(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid budget ID format'
      });
    }

    const existing = await budgetModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        error: 'Budget not found'
      });
    }

    await budgetModel.remove(req.params.id);
    
    res.status(200).json({
      message: 'Budget deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to delete budget'
    });
  }
};


export default budgetController;
