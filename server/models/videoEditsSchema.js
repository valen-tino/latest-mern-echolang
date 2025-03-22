import mongoose from "mongoose";

const videoEditsSchema = new mongoose.Schema({
    video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    edit_type: { type: String, enum: ['subtitles', 'trim', 'crop', 'filter', 'audio'], required: true },
    edit_details: {
      type: String, // Detailed information about the edit
    },
    edited_at: { type: Date, default: Date.now },
});
  
export default mongoose.model('VideoEdits', videoEditsSchema);