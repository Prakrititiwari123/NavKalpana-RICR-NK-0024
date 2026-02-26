// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
 
  primaryGoal: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_building', 'maintenance', 'fitness'],
    default: 'fitness',
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  
  // Health Metrics
  age: {
    type: Number,
    min: 0,
    max: 150,
  },

  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('Goals', userSchema);