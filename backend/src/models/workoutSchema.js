// models/WorkoutLog.js
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    workoutType: {
      type: String,
      enum: ["Cardio", "Strength", "Yoga", "HIIT"],
      required: true,
    },

    duration: Number, // minutes
    caloriesBurned: Number,
  },
  { timestamps: true }
);

export default mongoose.model("WorkoutLog", workoutSchema);