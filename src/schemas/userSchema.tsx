import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'Preferences',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('Users', userSchema);
export { User };