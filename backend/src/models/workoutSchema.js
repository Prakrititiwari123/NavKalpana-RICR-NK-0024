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
      required: true,
      trim: true,
    },

    duration: Number, // minutes
    caloriesBurned: Number,
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 3,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    exercises: [
      {
        name: { type: String, trim: true },
        sets: Number,
        reps: Number,
        weight: Number,
        unit: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("WorkoutLog", workoutSchema);
