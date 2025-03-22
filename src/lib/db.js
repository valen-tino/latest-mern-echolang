import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echolang';

let client = null;
let db = null;

async function connectDB() {
  try {
    if (db) return db;

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db();
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectDB;

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Disconnected from MongoDB');
  }
}