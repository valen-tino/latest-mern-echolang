import mongoose from 'mongoose';

const videoMetadataSchema = new mongoose.Schema({
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: true,
    unique: true,
  },
  key_elements: {
    type: [String],
    default: [],
  },
  content_analysis: {
    type: String,
  },
});

export default mongoose.model('VideoMetadata', videoMetadataSchema);
