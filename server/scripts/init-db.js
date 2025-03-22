import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { UserCollection, UserRoles } from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echolang';

async function initializeDatabase() {
  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Create collections with schemas and indexes
    await createUsersCollection(db);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

async function createUsersCollection(db) {
  const collections = await db.listCollections().toArray();
  const userCollectionExists = collections.some(col => col.name === UserCollection);

  if (!userCollectionExists) {
    await db.createCollection(UserCollection, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            },
            password: {
              bsonType: 'string',
              minLength: 6
            },
            role: {
              enum: Object.values(UserRoles)
            },
            name: {
              bsonType: 'string'
            },
            createdAt: {
              bsonType: 'date'
            },
            updatedAt: {
              bsonType: 'date'
            }
          }
        }
      }
    });

    // Create indexes
    await db.collection(UserCollection).createIndex(
      { email: 1 },
      { unique: true }
    );

    console.log(`Created ${UserCollection} collection with schema validation and indexes`);
  } else {
    console.log(`${UserCollection} collection already exists`);
  }
}

initializeDatabase();