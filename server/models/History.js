import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: true,
  },
  action: {
    type: String,
    enum: ['view', 'share', 'like', 'comment'],
    required: true,
  },
  action_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('History', historySchema);
