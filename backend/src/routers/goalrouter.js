// PUT /api/user/goals
import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import Progress from "../models/progressSchema.js";

const router = express.Router();

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj ?? {}, key);

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeMeasurements = (measurements = {}) => {
  const fields = ["chest", "waist", "hips", "arms", "thighs"];
  const normalized = {};

  for (const field of fields) {
    if (hasOwn(measurements, field)) {
      normalized[field] = toNumberOrNull(measurements[field]);
    }
  }

  return normalized;
};

router.put("/goals", Protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = req.body ?? {};
    const incomingProgressGoal =
      payload.progressGoal && typeof payload.progressGoal === "object"
        ? payload.progressGoal
        : {};

    // Accept both frontend naming styles: primaryGoal/goalType, progressGoal/flat fields.
    const primaryGoal =
      payload.primaryGoal ?? payload.goalType ?? payload.goals?.primaryGoal;
    const experienceLevel =
      payload.experienceLevel ?? payload.goals?.experienceLevel;

    const userSet = {};
    if (primaryGoal !== undefined) userSet.primaryGoal = primaryGoal;
    if (experienceLevel !== undefined) userSet.experienceLevel = experienceLevel;

    let updatedUser = await User.findById(userId).select("-password");
    if (Object.keys(userSet).length > 0) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: userSet },
        { new: true, runValidators: true }
      ).select("-password");
    }

    const progressSet = { user: userId };

    const goalFieldReaders = {
      startWeight: (input) => toNumberOrNull(input),
      targetWeight: (input) => toNumberOrNull(input),
      targetDate: (input) => toDateOrNull(input),
      timeline: (input) =>
        input === undefined ? undefined : input === "" ? null : String(input),
      calorieTarget: (input) => toNumberOrNull(input),
    };

    for (const [field, transform] of Object.entries(goalFieldReaders)) {
      const hasNested = hasOwn(incomingProgressGoal, field);
      const hasFlat = hasOwn(payload, field);

      if (!hasNested && !hasFlat) continue;

      const rawValue = hasNested ? incomingProgressGoal[field] : payload[field];
      const value = transform(rawValue);
      if (value !== undefined) {
        progressSet[`goal.${field}`] = value;
      }
    }

    if (payload.measurements && typeof payload.measurements === "object") {
      const normalizedMeasurements = normalizeMeasurements(payload.measurements);
      for (const [key, value] of Object.entries(normalizedMeasurements)) {
        progressSet[`measurements.${key}`] = value;
      }
    }

    const updatedProgress = await Progress.findOneAndUpdate(
      { user: userId },
      { $set: progressSet },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Goals updated successfully",
      data: {
        user: updatedUser,
        progress: updatedProgress,
      },
    });
  } catch (error) {
    console.error("GOALS UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update goals",
      error: error.message,
    });
  }
});

export default router;
