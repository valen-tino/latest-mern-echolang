import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    interface_language: { type: String, default: 'en' },
    video_name: { type: String, required: true },
    video_path: { type: String, required: true },
    upload_date: { type: Date, default: Date.now },
    duration: { type: Number, required: true },
    format: {
        type: String,
        enum: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
        required: true,
    },
    resolution: {
        type: String,
        enum: ['480p', '720p', '1080p', '4K'],
        default: '1080p',
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'private'],
        default: 'draft',
    }
});

export default mongoose.model('Video', videoSchema);