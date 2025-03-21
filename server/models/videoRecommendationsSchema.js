import mongoose from "mongoose";

const videoRecommendationsSchema = new Schema({
    video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    recommendation_video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    recommendation_date: { type: Date, default: Date.now }
});

videoRecommendationsSchema.index(
    { video_id: 1, recommendation_video_id: 1 },
    { unique: true }
);

export default mongoose.model('VideoRecommendations', videoRecommendationsSchema);