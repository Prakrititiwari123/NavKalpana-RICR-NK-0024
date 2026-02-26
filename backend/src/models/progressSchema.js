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

    goal: {
      startWeight: Number,
      targetWeight: Number,
      targetDate: Date,
    },

    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);