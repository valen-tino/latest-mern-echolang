import mongoose from 'mongoose';

const videoEditsSchema = new mongoose.Schema({
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: true,
  },
  edit_type: {
    type: String,
    enum: ['subtitles', 'trim', 'crop', 'filter', 'audio'],
    required: true,
  },
  edit_details: {
    type: String,
  },
  edited_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('VideoEdits', videoEditsSchema);
