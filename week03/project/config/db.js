import { MongoClient } from 'mongodb';


let db;
const mongoDatabase = {};

mongoDatabase.connectDB = async function () {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log(`Connected to MongoDB: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

mongoDatabase.getDB = function() {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
};


export default mongoDatabase;
