const videoTranslationsSchema = new Schema({
    video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Videos',
      required: true,
    },
    source_language: {
      type: String,
      required: true,
    },
    target_language: {
      type: String,
      required: true,
    },
    translation_text: {
      type: String,
    },
    translation_audio: {
      type: String, // Path or URL to audio translation
    },
  });
  
  module.exports = mongoose.model('VideoTranslations', videoTranslationsSchema);
  