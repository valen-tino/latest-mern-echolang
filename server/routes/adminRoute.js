import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { VideoCollection } from '../models/video.js';
import Feedback from '../models/Feedback.js';
import History from '../models/historySchema.js';
import Preferences from '../models/preferencesSchema.js';
import VideoEdits from '../models/videoEditsSchema.js';
import VideoMetadata from '../models/videoMetadataSchema.js';
import VideoRecommendations from '../models/videoRecommendationsSchema.js';
import VideoTranslations from '../models/videoTranslationsSchema.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get admin dashboard statistics
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
    try {
        const [usersCount, videosCount, feedbackCount, historyCount, preferencesCount, videoEditsCount, videoMetadataCount, videoRecommendationsCount, videoTranslationsCount] = await Promise.all([
            User.countDocuments(),
            VideoCollection.countDocuments(),
            Feedback.countDocuments(),
            History.countDocuments(),
            Preferences.countDocuments(),
            VideoEdits.countDocuments(),
            VideoMetadata.countDocuments(),
            VideoRecommendations.countDocuments(),
            VideoTranslations.countDocuments()
        ]);

        // Calculate storage used (simplified example)
        const videos = await VideoCollection.find().select('duration');
        const storageUsed = videos.reduce((total, video) => total + (video.duration * 5), 0); // Rough estimate: 5MB per second
        
        const stats = {
            totalUsers: usersCount,
            activeTranslations: await VideoCollection.countDocuments({ status: 'published' }),
            storageUsed: `${(storageUsed / 1024).toFixed(1)}GB`,
            totalFeedback: feedbackCount,
            totalHistory: historyCount,
            totalPreferences: preferencesCount,
            totalVideoEdits: videoEditsCount,
            totalVideoMetadata: videoMetadataCount,
            totalVideoRecommendations: videoRecommendationsCount,
            totalVideoTranslations: videoTranslationsCount
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Failed to fetch admin statistics' });
    }
});

// Get all users
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Get all videos with pagination
router.get('/videos', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [videos, total] = await Promise.all([
            VideoCollection.find()
                .sort({ upload_date: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user_id', 'name email'),
            VideoCollection.countDocuments()
        ]);

        res.json({
            videos,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
});

// Update video status
router.put('/videos/:id/status', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['published', 'draft', 'private'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const video = await VideoCollection.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json({ message: 'Video status updated successfully', video });
    } catch (error) {
        console.error('Error updating video status:', error);
        res.status(500).json({ message: 'Failed to update video status' });
    }
});

// Delete video
router.delete('/videos/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const video = await VideoCollection.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Failed to delete video' });
    }
});

// HISTORY ROUTES
// Get all history entries with pagination
router.get('/history', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            History.find()
                .sort({ action_date: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user_id', 'name email')
                .populate('video_id'),
            History.countDocuments()
        ]);

        res.json({
            history,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

// Get history by ID
router.get('/history/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const history = await History.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('video_id');

        if (!history) {
            return res.status(404).json({ message: 'History entry not found' });
        }

        res.json(history);
    } catch (error) {
        console.error('Error fetching history entry:', error);
        res.status(500).json({ message: 'Failed to fetch history entry' });
    }
});

// Delete history entry
router.delete('/history/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const history = await History.findByIdAndDelete(req.params.id);

        if (!history) {
            return res.status(404).json({ message: 'History entry not found' });
        }

        res.json({ message: 'History entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ message: 'Failed to delete history entry' });
    }
});

// PREFERENCES ROUTES
// Get all preferences with pagination
router.get('/preferences', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [preferences, total] = await Promise.all([
            Preferences.find()
                .skip(skip)
                .limit(limit)
                .populate('user_id', 'name email'),
            Preferences.countDocuments()
        ]);

        res.json({
            preferences,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({ message: 'Failed to fetch preferences' });
    }
});

// Get preferences by ID
router.get('/preferences/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const preferences = await Preferences.findById(req.params.id)
            .populate('user_id', 'name email');

        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }

        res.json(preferences);
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({ message: 'Failed to fetch preferences' });
    }
});

// Update preferences
router.put('/preferences/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { interface_language, translation_language } = req.body;
        const preferences = await Preferences.findByIdAndUpdate(
            req.params.id,
            { interface_language, translation_language },
            { new: true }
        );

        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }

        res.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ message: 'Failed to update preferences' });
    }
});

// VIDEO EDITS ROUTES
// Get all video edits with pagination
router.get('/video-edits', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [videoEdits, total] = await Promise.all([
            VideoEdits.find()
                .sort({ edited_at: -1 })
                .skip(skip)
                .limit(limit)
                .populate('video_id'),
            VideoEdits.countDocuments()
        ]);

        res.json({
            videoEdits,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching video edits:', error);
        res.status(500).json({ message: 'Failed to fetch video edits' });
    }
});

// Get video edit by ID
router.get('/video-edits/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoEdit = await VideoEdits.findById(req.params.id)
            .populate('video_id');

        if (!videoEdit) {
            return res.status(404).json({ message: 'Video edit not found' });
        }

        res.json(videoEdit);
    } catch (error) {
        console.error('Error fetching video edit:', error);
        res.status(500).json({ message: 'Failed to fetch video edit' });
    }
});

// Delete video edit
router.delete('/video-edits/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoEdit = await VideoEdits.findByIdAndDelete(req.params.id);

        if (!videoEdit) {
            return res.status(404).json({ message: 'Video edit not found' });
        }

        res.json({ message: 'Video edit deleted successfully' });
    } catch (error) {
        console.error('Error deleting video edit:', error);
        res.status(500).json({ message: 'Failed to delete video edit' });
    }
});

// VIDEO METADATA ROUTES
// Get all video metadata with pagination
router.get('/video-metadata', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [videoMetadata, total] = await Promise.all([
            VideoMetadata.find()
                .skip(skip)
                .limit(limit)
                .populate('video_id'),
            VideoMetadata.countDocuments()
        ]);

        res.json({
            videoMetadata,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        res.status(500).json({ message: 'Failed to fetch video metadata' });
    }
});

// Get video metadata by ID
router.get('/video-metadata/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoMetadata = await VideoMetadata.findById(req.params.id)
            .populate('video_id');

        if (!videoMetadata) {
            return res.status(404).json({ message: 'Video metadata not found' });
        }

        res.json(videoMetadata);
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        res.status(500).json({ message: 'Failed to fetch video metadata' });
    }
});

// Update video metadata
router.put('/video-metadata/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { key_elements, content_analysis } = req.body;
        const videoMetadata = await VideoMetadata.findByIdAndUpdate(
            req.params.id,
            { key_elements, content_analysis },
            { new: true }
        );

        if (!videoMetadata) {
            return res.status(404).json({ message: 'Video metadata not found' });
        }

        res.json({ message: 'Video metadata updated successfully', videoMetadata });
    } catch (error) {
        console.error('Error updating video metadata:', error);
        res.status(500).json({ message: 'Failed to update video metadata' });
    }
});

// Delete video metadata
router.delete('/video-metadata/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoMetadata = await VideoMetadata.findByIdAndDelete(req.params.id);

        if (!videoMetadata) {
            return res.status(404).json({ message: 'Video metadata not found' });
        }

        res.json({ message: 'Video metadata deleted successfully' });
    } catch (error) {
        console.error('Error deleting video metadata:', error);
        res.status(500).json({ message: 'Failed to delete video metadata' });
    }
});

// VIDEO RECOMMENDATIONS ROUTES
// Get all video recommendations with pagination
router.get('/video-recommendations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [videoRecommendations, total] = await Promise.all([
            VideoRecommendations.find()
                .sort({ recommendation_date: -1 })
                .skip(skip)
                .limit(limit)
                .populate('video_id')
                .populate('recommendation_video_id'),
            VideoRecommendations.countDocuments()
        ]);

        res.json({
            videoRecommendations,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching video recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch video recommendations' });
    }
});

// Get video recommendation by ID
router.get('/video-recommendations/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoRecommendation = await VideoRecommendations.findById(req.params.id)
            .populate('video_id')
            .populate('recommendation_video_id');

        if (!videoRecommendation) {
            return res.status(404).json({ message: 'Video recommendation not found' });
        }

        res.json(videoRecommendation);
    } catch (error) {
        console.error('Error fetching video recommendation:', error);
        res.status(500).json({ message: 'Failed to fetch video recommendation' });
    }
});

// Create video recommendation
router.post('/video-recommendations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { video_id, recommendation_video_id } = req.body;
        
        // Check if both videos exist
        const [video, recommendedVideo] = await Promise.all([
            VideoCollection.findById(video_id),
            VideoCollection.findById(recommendation_video_id)
        ]);
        
        if (!video || !recommendedVideo) {
            return res.status(404).json({ message: 'One or both videos not found' });
        }
        
        const videoRecommendation = new VideoRecommendations({
            video_id,
            recommendation_video_id
        });
        
        await videoRecommendation.save();
        res.status(201).json({ message: 'Video recommendation created successfully', videoRecommendation });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'This recommendation already exists' });
        }
        console.error('Error creating video recommendation:', error);
        res.status(500).json({ message: 'Failed to create video recommendation' });
    }
});

// Delete video recommendation
router.delete('/video-recommendations/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const videoRecommendation = await VideoRecommendations.findByIdAndDelete(req.params.id);

        if (!videoRecommendation) {
            return res.status(404).json({ message: 'Video recommendation not found' });
        }

        res.json({ message: 'Video recommendation deleted successfully' });
    } catch (error) {
        console.error('Error deleting video recommendation:', error);
        res.status(500).json({ message: 'Failed to delete video recommendation' });
    }
});

// VIDEO TRANSLATIONS ROUTES
// Get all video translations with pagination
router.get('/video-translations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [videoTranslations, total] = await Promise.all([
            VideoTranslations.find()
                .skip(skip)
                .limit(limit)
                .populate('video_id'),
            VideoTranslations.countDocuments()
        ]);

        res.json({
            videoTranslations,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching video translations:', error);
        res.status(500).json({ message: 'Failed to fetch video translations' });
    }
});