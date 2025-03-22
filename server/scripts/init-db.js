import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { VideoCollection } from '../models/video.js';
import bcryptjs from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/echolang';

async function initializeDatabase() {
  try {
    // Connect using mongoose with modern options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');

    // Get the underlying MongoDB connection
    const db = mongoose.connection.db;

    // Create collections with schemas and indexes
    await createUsersCollection(db);
    await createVideosCollection(db);
    
    // Create admin user if it doesn't exist
    await createAdminUser();

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

async function createUsersCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const userCollectionExists = collections.some(col => col.name === 'users');

    if (!userCollectionExists) {
      await db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'role'],
            properties: {
              name: {
                bsonType: 'string'
              },
              email: {
                bsonType: 'string',
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
              },
              password: {
                bsonType: 'string'
              },
              role: {
                enum: ['admin', 'user']
              },
              createdAt: {
                bsonType: 'date'
              }
            }
          }
        }
      });

      // Create indexes
      await db.collection('users').createIndex(
        { email: 1 },
        { unique: true }
      );

      console.log('Created users collection with schema validation and indexes');
    } else {
      console.log('Users collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) { // NamespaceExists error
      console.log('Users collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createVideosCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const videoCollectionExists = collections.some(col => col.name === 'videos');

    if (!videoCollectionExists) {
      await db.createCollection('videos', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'video_name', 'video_path', 'duration', 'format'],
            properties: {
              user_id: {
                bsonType: 'objectId'
              },
              interface_language: {
                bsonType: 'string'
              },
              video_name: {
                bsonType: 'string'
              },
              video_path: {
                bsonType: 'string'
              },
              upload_date: {
                bsonType: 'date'
              },
              duration: {
                bsonType: 'number'
              },
              format: {
                enum: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv']
              },
              resolution: {
                enum: ['480p', '720p', '1080p', '4K']
              },
              status: {
                enum: ['published', 'draft', 'private']
              }
            }
          }
        }
      });

      // Create indexes
      await db.collection('videos').createIndex(
        { user_id: 1 },
        { unique: true }
      );

      console.log('Created videos collection with schema validation and indexes');
    } else {
      console.log('Videos collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) { // NamespaceExists error
      console.log('Videos collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createAdminUser() {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcryptjs.hash('admin123', 10);
      
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@echolang.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

initializeDatabase();