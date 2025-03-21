import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    interface_language: { type: String, default: 'en' },
    translation_language: { type: String, default: 'en' }
});

export default mongoose.model('Preferences', preferencesSchema);