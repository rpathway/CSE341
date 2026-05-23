import { ObjectId } from 'mongodb';
import databaseConfig from '../config/db.js';


const expenseModel = {};
export const VALID_PAYMENT_METHODS = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'];
export const VALID_STATUSES = ['pending', 'cleared', 'cancelled'];
export const VALID_CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP', 'JPY'];
export const VALID_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'shopping',
  'utilities',
  'other'
];


// Validates and sanitizes expense input
expenseModel.validateExpense = function (data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.amount !== undefined) {
    if (data.amount === undefined || data.amount === null) {
      errors.push('amount is required');

    } else if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
      errors.push('amount must be a positive number');
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
      errors.push('description is required and must be a non-empty string');

    } else if (data.description.trim().length > 200) {
      errors.push('description must be 200 characters or fewer');
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (!data.category) {
      errors.push('category is required');

    } else if (!VALID_CATEGORIES.includes(data.category)) {
      errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
  }

  if (!isUpdate || data.date !== undefined) {
    if (!data.date) {
      errors.push('date is required');

    } else if (isNaN(Date.parse(data.date))) {
      errors.push('date must be a valid date string (e.g. 2024-05-01)');
    }
  }

  if (!isUpdate || data.paymentMethod !== undefined) {
    if (!data.paymentMethod) {
      errors.push('paymentMethod is required');

    } else if (!VALID_PAYMENT_METHODS.includes(data.paymentMethod)) {
      errors.push(`paymentMethod must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`);
    }
  }

  if (data.currency !== undefined && !VALID_CURRENCIES.includes(data.currency)) {
    errors.push(`currency must be one of: ${VALID_CURRENCIES.join(', ')}`);
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.merchant !== undefined && typeof data.merchant !== 'string') {
    errors.push('merchant must be a string');
  }

  if (data.receiptUrl !== undefined && data.receiptUrl !== '') {
    try {
      new URL(data.receiptUrl);

    } catch {
      errors.push('receiptUrl must be a valid URL');
    }
  }

  return errors;
};

// Builds expense document from raw input
expenseModel.buildExpenseDoc = function(data, isUpdate = false) {
  const doc = {};

  if (data.amount !== undefined)        doc.amount = parseFloat(data.amount.toFixed(2));
  if (data.description !== undefined)   doc.description = data.description.trim();
  if (data.category !== undefined)      doc.category = data.category;
  if (data.date !== undefined)          doc.date = new Date(data.date);
  if (data.paymentMethod !== undefined) doc.paymentMethod = data.paymentMethod;
  if (data.merchant !== undefined)      doc.merchant = data.merchant.trim();
  if (data.currency !== undefined)      doc.currency = data.currency;
  if (data.receiptUrl !== undefined)    doc.receiptUrl = data.receiptUrl;
  if (data.status !== undefined)        doc.status = data.status;

  if (!isUpdate) {
    doc.currency = doc.currency || 'CAD';
    doc.status = doc.status || 'pending';
    doc.merchant = doc.merchant || '';
    doc.receiptUrl = doc.receiptUrl || '';
    doc.createdAt = new Date();
  }

  doc.updatedAt = new Date();

  return doc;
};

expenseModel.getAll = async function(filters = {}) {
  const db = databaseConfig.getDB();
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod;
  }

  return db.collection('expenses').find(query).sort({ date: -1 }).toArray();
};

expenseModel.getById = async function(id) {
  const db = databaseConfig.getDB();

  return db.collection('expenses').findOne({ _id: new ObjectId(id) });
};

expenseModel.create = async function(doc) {
  const db = databaseConfig.getDB();
  const result = await db.collection('expenses').insertOne(doc);

  return { _id: result.insertedId, ...doc };
};

expenseModel.update = async function(id, doc) {
  const db = databaseConfig.getDB();
  const result = await db.collection('expenses').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: doc },
    { returnDocument: 'after' }
  );

  return result;
};

expenseModel.remove = async function(id) {
  const db = databaseConfig.getDB();
  const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount;
};


export default expenseModel;