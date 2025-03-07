import express from 'express';
import { ObjectId } from 'mongodb';
import { authenticateToken } from '../middleware/auth.js';
import { VideoCollection } from '../models/video.js';

const router = express.Router();

// Get all videos (with pagination)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const db = req.app.locals.db;
    const query = userId ? { userId } : {};

    const [videos, total] = await Promise.all([
      db.collection(VideoCollection)
        .find(query)
        .sort({ uploadDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection(VideoCollection).countDocuments(query)
    ]);

    res.json({
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// Get video by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const video = await db.collection(VideoCollection).findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!video) {
      return res.status(404).json({
        error: {
          code: 'VIDEO_NOT_FOUND',
          message: 'Video not found'
        }
      });
    }

    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// Create new video
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const video = {
      ...req.body,
      userId: req.user.id,
      uploadDate: new Date()
    };

    const result = await db.collection(VideoCollection).insertOne(video);
    res.status(201).json({
      id: result.insertedId,
      success: true
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

export default router;