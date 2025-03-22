import mongoose from "mongoose";

const videoTranslationsSchema = new mongoose.Schema({
    video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    source_language: { type: String, required: true },
    target_language: { type: String, required: true },
    translation_text: { type: String },
    translation_audio: {
      type: String, // Path or URL to audio translation
    }
});
  
export default mongoose.model('VideoTranslations', videoTranslationsSchema);