export const VideoCollection = 'videos';

export const VideoStatus = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const VideoSchema = {
  title: String,
  description: String,
  userId: String,
  sourceLanguage: String,
  status: {
    type: String,
    enum: Object.values(VideoStatus),
    default: VideoStatus.PROCESSING
  },
  duration: Number,
  size: Number,
  format: String,
  thumbnail: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  translations: [
    {
      language: String,
      status: String,
      progress: Number,
      url: String
    }
  ]
};