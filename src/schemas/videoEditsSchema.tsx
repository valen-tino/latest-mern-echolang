const videoEditsSchema = new Schema({
    video_id: {
      type: Schema.Types.ObjectId,
      ref: 'Videos',
      required: true,
    },
    edit_type: {
      type: String,
      enum: ['subtitles', 'trim', 'crop', 'filter', 'audio'],
      required: true,
    },
    edit_details: {
      type: String, // Detailed information about the edit
    },
    edited_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('VideoEdits', videoEditsSchema);
  