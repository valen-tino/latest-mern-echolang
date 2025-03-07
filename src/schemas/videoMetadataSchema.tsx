const videoMetadataSchema = new Schema({
    video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Videos',
      required: true,
      unique: true,
    },
    key_elements: {
      type: [String], // Array of important entities/items
      default: [],
    },
    content_analysis: {
      type: String, // Summary or analysis
    },
  });
  
  module.exports = mongoose.model('VideoMetadata', videoMetadataSchema);
  