const feedbackSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    feedback_description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number, // e.g., 1 to 5
      min: 1,
      max: 5,
    },
    feedback_date: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Feedback', feedbackSchema);
  