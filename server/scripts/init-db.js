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
    await createFeedbackCollection(db);
    await createHistoryCollection(db);
    await createPreferencesCollection(db);
    await createVideoEditsCollection(db);
    await createVideoMetadataCollection(db);
    await createVideoRecommendationsCollection(db);
    await createVideoTranslationsCollection(db);
    
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

async function createFeedbackCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const feedbackCollectionExists = collections.some(col => col.name === 'feedbacks');

    if (!feedbackCollectionExists) {
      await db.createCollection('feedbacks', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'feedback_description', 'rating'],
            properties: {
              user_id: {
                bsonType: 'objectId'
              },
              feedback_description: {
                bsonType: 'string'
              },
              admin_response: {
                bsonType: 'string'
              },
              rating: {
                bsonType: 'number',
                minimum: 1,
                maximum: 5
              },
              feedback_date: {
                bsonType: 'date'
              },
              status: {
                enum: ['submitted', 'reviewed']
              }
            }
          }
        }
      });

      // Create indexes
      await db.collection('feedbacks').createIndex(
        { user_id: 1 },
        { background: true }
      );

      console.log('Created feedbacks collection with schema validation and indexes');
    } else {
      console.log('Feedbacks collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) { // NamespaceExists error
      console.log('Feedbacks collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createHistoryCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const historyCollectionExists = collections.some(col => col.name === 'histories');

    if (!historyCollectionExists) {
      await db.createCollection('histories', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'video_id', 'action'],
            properties: {
              user_id: {
                bsonType: 'objectId'
              },
              video_id: {
                bsonType: 'objectId'
              },
              action: {
                enum: ['view', 'share', 'like', 'comment']
              },
              action_date: {
                bsonType: 'date'
              }
            }
          }
        }
      });

      await db.collection('histories').createIndex(
        { user_id: 1 },
        { unique: true }
      );

      console.log('Created histories collection with schema validation and indexes');
    } else {
      console.log('Histories collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Histories collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createPreferencesCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const preferencesCollectionExists = collections.some(col => col.name === 'preferences');

    if (!preferencesCollectionExists) {
      await db.createCollection('preferences', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user_id'],
            properties: {
              user_id: {
                bsonType: 'objectId'
              },
              interface_language: {
                bsonType: 'string'
              },
              translation_language: {
                bsonType: 'string'
              }
            }
          }
        }
      });

      await db.collection('preferences').createIndex(
        { user_id: 1 },
        { unique: true }
      );

      console.log('Created preferences collection with schema validation and indexes');
    } else {
      console.log('Preferences collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Preferences collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createVideoEditsCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const videoEditsCollectionExists = collections.some(col => col.name === 'videoedits');

    if (!videoEditsCollectionExists) {
      await db.createCollection('videoedits', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['video_id', 'edit_type'],
            properties: {
              video_id: {
                bsonType: 'objectId'
              },
              edit_type: {
                enum: ['subtitles', 'trim', 'crop', 'filter', 'audio']
              },
              edit_details: {
                bsonType: 'string'
              },
              edited_at: {
                bsonType: 'date'
              }
            }
          }
        }
      });

      console.log('Created video edits collection with schema validation');
    } else {
      console.log('Video edits collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Video edits collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createVideoMetadataCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const videoMetadataCollectionExists = collections.some(col => col.name === 'videometadata');

    if (!videoMetadataCollectionExists) {
      await db.createCollection('videometadata', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['video_id'],
            properties: {
              video_id: {
                bsonType: 'objectId'
              },
              key_elements: {
                bsonType: 'array',
                items: {
                  bsonType: 'string'
                }
              },
              content_analysis: {
                bsonType: 'string'
              }
            }
          }
        }
      });

      await db.collection('videometadata').createIndex(
        { video_id: 1 },
        { unique: true }
      );

      console.log('Created video metadata collection with schema validation and indexes');
    } else {
      console.log('Video metadata collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Video metadata collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createVideoRecommendationsCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const videoRecommendationsCollectionExists = collections.some(col => col.name === 'videorecommendations');

    if (!videoRecommendationsCollectionExists) {
      await db.createCollection('videorecommendations', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['video_id', 'recommendation_video_id'],
            properties: {
              video_id: {
                bsonType: 'objectId'
              },
              recommendation_video_id: {
                bsonType: 'objectId'
              },
              recommendation_date: {
                bsonType: 'date'
              }
            }
          }
        }
      });

      await db.collection('videorecommendations').createIndex(
        { video_id: 1, recommendation_video_id: 1 },
        { unique: true }
      );

      console.log('Created video recommendations collection with schema validation and indexes');
    } else {
      console.log('Video recommendations collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Video recommendations collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

async function createVideoTranslationsCollection(db) {
  try {
    const collections = await db.listCollections().toArray();
    const videoTranslationsCollectionExists = collections.some(col => col.name === 'videotranslations');

    if (!videoTranslationsCollectionExists) {
      await db.createCollection('videotranslations', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['video_id', 'source_language', 'target_language'],
            properties: {
              video_id: {
                bsonType: 'objectId'
              },
              source_language: {
                bsonType: 'string'
              },
              target_language: {
                bsonType: 'string'
              },
              translation_text: {
                bsonType: 'string'
              },
              translation_audio: {
                bsonType: 'string'
              }
            }
          }
        }
      });

      console.log('Created video translations collection with schema validation');
    } else {
      console.log('Video translations collection already exists, skipping creation');
    }
  } catch (error) {
    if (error.code === 48) {
      console.log('Video translations collection already exists with different options, continuing...');
    } else {
      throw error;
    }
  }
}

initializeDatabase();