// models/Analytics.js
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    period: {
      type: String,
      enum: ["7d", "30d", "90d"],
    },

    weightChange: Number,
    habitScore: Number,

    predictions: {
      nextWeight: Number,
      confidence: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);