// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    weightLogs: [
      {
        date: { type: Date, default: Date.now },
        weight: Number,
        change: Number,
        note: String,
      },
    ],

    progressPhotos: [
      {
        date: { type: Date, default: Date.now },
        photoUrl: String,
        note: String,
      },
    ],

    goal: {
      startWeight: Number,
      targetWeight: Number,
      targetDate: Date,
      timeline: String,
      calorieTarget: Number,
    },

    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
    },

    adherence: {
      dietAdherence: Number,
      workoutAdherence: Number,
      sleepAdherence: Number,
    },

    adherenceHistory: [
      {
        date: { type: Date, default: Date.now },
        workoutCompleted: Boolean,
        dietFollowed: Boolean,
        waterIntake: Boolean,
        sleepQuality: Number,
        mood: Number,
        energy: Number,
        adherenceScore: Number,
        diet: Number,
        workout: Number,
        sleep: Number,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
