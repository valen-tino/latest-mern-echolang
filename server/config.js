import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/echolang',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: '7d',
  uploadDir: './uploads',
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:5173',
  environment: process.env.NODE_ENV || 'development'
};