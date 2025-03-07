import { MongoClient } from 'mongodb';

let client;

export async function connectDB(uri) {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!client) {
    throw new Error('Database not initialized');
  }
  return client.db();
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}