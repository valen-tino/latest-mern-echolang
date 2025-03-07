const historySchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    video_id: {
      type: Schema.Types.ObjectId,
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
  
  module.exports = mongoose.model('History', historySchema);
  