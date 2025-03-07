import { config } from 'dotenv';

// Load environment variables
config();

export const serverConfig = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  }
};