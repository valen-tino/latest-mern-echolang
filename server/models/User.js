import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  preferences: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preferences',
  },
}, { timestamps: true });

export default mongoose.model('Users', userSchema);
