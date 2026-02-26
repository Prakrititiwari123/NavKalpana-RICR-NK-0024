// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // AUTH
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

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
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // BASIC PROFILE
    age: {
      type: Number,
      min: 10,
      max: 100,
    },

    gender: {
      type: String,
    },

    height: Number,
    weight: Number,

    // FITNESS META
    activityLevel: {
      type: String,
    },

    experienceLevel: {
      type: String,
    },

    primaryGoal: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);