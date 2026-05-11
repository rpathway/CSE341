import 'dotenv/config';
import { MongoClient } from 'mongodb';


let database;
const dbFunc = {}
const URI = process.env.MONGO_DB_URL;

dbFunc.init = (callback) => {
  if (database) {
    console.log(`Database is already initialized.`);
    return callback(null, database);
  }
  MongoClient.connect(URI).then((client) => {
    database = client;
    callback(null, database);
  }).catch((err) => {
    callback(err);
  })
}

dbFunc.getDatabase = () => {
  if (!database) {
    throw new Error(`Database not initialized.`);
  }
  return database;
}


export default dbFunc;
