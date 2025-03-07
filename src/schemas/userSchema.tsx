const mongoose = require('mongoose');
const { Schema } = mongoose;
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

import mongoose from 'mongoose';
import { Schema } from 'mongoose';
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
      enum: ['admin', 'user'], // Example roles
      enum: ['admin', 'user'],
      default: 'user',
    },
    preferences: {
      type: Schema.Types.ObjectId,
      ref: 'Preferences',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
const User = mongoose.model('Users', userSchema);

export { User };