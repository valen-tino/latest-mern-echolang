import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  feedback_description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Feedback', feedbackSchema);
