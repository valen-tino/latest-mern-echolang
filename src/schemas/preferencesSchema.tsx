const preferencesSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    interface_language: {
      type: String,
      default: 'en',
    },
    translation_language: {
      type: String,
      default: 'en',
    },
  });
  
  module.exports = mongoose.model('Preferences', preferencesSchema);
  