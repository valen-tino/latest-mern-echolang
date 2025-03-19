import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from '../src/lib/db.js';  // Changed to default import
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

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

// Connect to MongoDB and start server
connectDB()  // Changed function name to match the import
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });