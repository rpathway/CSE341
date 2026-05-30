import { ObjectId } from 'mongodb';
import mongoDatabase from '../config/db.js';

const userModel = {};


userModel.findByGithubId = async function (githubId) {
  const db = mongoDatabase.getDB();

  return db.collection('users').findOne({ githubId: githubId });
};

userModel.findByEmail = async function (email) {
  const db = mongoDatabase.getDB();

  return db.collection('users').findOne({ email: email });
};

userModel.findById = async function (id) {
  const mongoId = new ObjectId(id);
  const db = mongoDatabase.getDB();

  return db.collection('users').findOne({ _id: mongoId });
};

userModel.create = async function (userData) {
  const db = mongoDatabase.getDB();
  const result = await db.collection('users').insertOne(userData);

  return db.collection('users').findOne({ _id: result.insertedId });
};


export default userModel;