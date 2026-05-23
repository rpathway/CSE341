import { ObjectId } from 'mongodb';
import databaseConfig from '../config/db.js';



const budgetModel = {};
export const VALID_PERIODS = ['weekly', 'monthly', 'yearly'];


budgetModel.validateBudget = function(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.push('name is required and must be a non-empty string');

    } else if (data.name.trim().length > 100) {
      errors.push('name must be 100 characters or fewer');
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
      errors.push('category is required');
    }
  }

  if (!isUpdate || data.limit !== undefined) {
    if (data.limit === undefined || data.limit === null) {
      errors.push('limit is required');
    
    } else if (typeof data.limit !== 'number' || isNaN(data.limit) || data.limit <= 0) {
      errors.push('limit must be a positive number');
    }
  }

  if (!isUpdate || data.period !== undefined) {
    if (!data.period) {
      errors.push('period is required');
    
    } else if (!VALID_PERIODS.includes(data.period)) {
      errors.push(`period must be one of: ${VALID_PERIODS.join(', ')}`);
    }
  }

  if (data.notes !== undefined && typeof data.notes !== 'string') {
    errors.push('notes must be a string');
  }

  return errors;
};

budgetModel.buildBudgetDoc = function(data, isUpdate = false) {
  const doc = {};

  if (data.name !== undefined)     doc.name = data.name.trim();
  if (data.category !== undefined) doc.category = data.category.trim();
  if (data.limit !== undefined)    doc.limit = parseFloat(data.limit.toFixed(2));
  if (data.period !== undefined)   doc.period = data.period;
  if (data.notes !== undefined)    doc.notes = data.notes.trim();

  if (!isUpdate) {
    doc.notes = doc.notes || '';
    doc.createdAt = new Date();
  }

  doc.updatedAt = new Date();

  return doc;
};

budgetModel.getAll = async function() {
  const db = databaseConfig.getDB();

  return db.collection('budgets').find().sort({ category: 1 }).toArray();
};

budgetModel.getById = async function(id) {
  const db = databaseConfig.getDB();

  return db.collection('budgets').findOne({ _id: new ObjectId(id) });
};

budgetModel.create = async function(doc) {
  const db = databaseConfig.getDB();
  const result = await db.collection('budgets').insertOne(doc);

  return {
    _id: result.insertedId,
    ...doc
  };
};

budgetModel.update = async function(id, doc) {
  const db = databaseConfig.getDB();
  const result = await db.collection('budgets').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: doc },
    { returnDocument: 'after' }
  );

  return result;
};

budgetModel.remove = async function(id) {
  const db = databaseConfig.getDB();
  const result = await db.collection('budgets').deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount;
};


export default budgetModel;
