import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from '../src/lib/db.js';  // Changed to default import
import authRoutes from './routes/authRoute.js';
// import videoRoutes from './routes/videos.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Connect to MongoDB and start server
connectDB()  // Changed function name to match the import
  .then((db) => {
    // Store the database connection in app.locals
    app.locals.db = db;
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/videos', videoRoutes);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
=======
// API Routes
app.use('/auth', authRoutes);
// app.use('/api/videos', videoRoutes);
>>>>>>> 2b375760e6147c58d9b376ebc158fea32a2637a4

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    }
  });
});