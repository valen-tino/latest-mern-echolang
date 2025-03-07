const videoRecommendationsSchema = new Schema({
    video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Videos',
      required: true, // Source video
    },
    recommendation_video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Videos',
      required: true, // Recommended video
    },
    recommendation_date: {
      type: Date,
      default: Date.now,
    },
  });
  
  videoRecommendationsSchema.index(
    { video_id: 1, recommendation_video_id: 1 },
    { unique: true }
  );
  
  module.exports = mongoose.model('VideoRecommendations', videoRecommendationsSchema);
  