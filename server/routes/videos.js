import express from 'express';
import { ObjectId } from 'mongodb';
import { authenticateToken } from '../middleware/auth.js';
import { VideoCollection } from '../models/video.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp4|mov|avi|mkv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Unsupported file format. Please upload MP4, MOV, AVI, or MKV files.'));
  }
});

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

// Upload video endpoint
router.post('/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE_UPLOADED',
          message: 'No file was uploaded'
        }
      });
    }

    const db = req.app.locals.db;
    const video = {
      title: req.file.originalname,
      description: '',
      userId: req.user.id,
      sourceLanguage: 'en', // Default language
      status: 'completed',
      duration: 0, // This would be extracted from the actual video
      size: req.file.size,
      format: path.extname(req.file.originalname).substring(1),
      thumbnail: '', // This would be generated
      uploadDate: new Date(),
      filePath: req.file.path
    };

    const result = await db.collection(VideoCollection).insertOne(video);
    res.status(201).json({
      id: result.insertedId,
      success: true
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      error: {
        code: 'UPLOAD_FAILED',
        message: error.message || 'Failed to upload video'
      }
    });
  }
});

export default router;