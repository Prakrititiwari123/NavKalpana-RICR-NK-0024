import express from "express";
import { Protect } from "../middlewares/authMiddleware.js";
import Progress from "../models/progressSchema.js";

const router = express.Router();

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toDate = (value) => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const ensureProgressDoc = async (userId) => {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) {
    progress = await Progress.create({
      user: userId,
      weightLogs: [],
      progressPhotos: [],
      adherenceHistory: [],
    });
  }
  return progress;
};

// Get progress for user
router.get("/", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update full progress
router.put("/", Protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add weight log
router.post("/weight", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);
    const inputWeight = toNumber(req.body?.weight);

    if (inputWeight === null) {
      return res.status(400).json({
        success: false,
        message: "weight is required",
      });
    }

    const lastWeight = toNumber(progress.weightLogs[progress.weightLogs.length - 1]?.weight);
    const change = lastWeight === null ? 0 : inputWeight - lastWeight;

    const log = {
      date: toDate(req.body?.date),
      weight: inputWeight,
      note: req.body?.note || "",
      change,
    };

    progress.weightLogs.push(log);
    await progress.save();

    return res.status(201).json({
      success: true,
      data: progress.weightLogs[progress.weightLogs.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete weight log
router.delete("/weight/:id", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);
    const before = progress.weightLogs.length;
    progress.weightLogs = progress.weightLogs.filter(
      (log) => String(log._id) !== String(req.params.id)
    );

    if (progress.weightLogs.length === before) {
      return res.status(404).json({
        success: false,
        message: "Weight log not found",
      });
    }

    await progress.save();
    return res.status(200).json({
      success: true,
      message: "Weight log deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update measurements
router.put("/measurements", Protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { measurements: req.body } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: progress.measurements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update goal
router.put("/goal", Protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { goal: req.body } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: progress.goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add progress photo
router.post("/photos", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);
    const photoUrl = req.body?.photoUrl || req.body?.url;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: "photoUrl is required",
      });
    }

    const photo = {
      date: toDate(req.body?.date),
      photoUrl,
      note: req.body?.note || "",
    };

    progress.progressPhotos.push(photo);
    await progress.save();

    return res.status(201).json({
      success: true,
      data: progress.progressPhotos[progress.progressPhotos.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete progress photo
router.delete("/photos/:id", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);
    const before = progress.progressPhotos.length;
    progress.progressPhotos = progress.progressPhotos.filter(
      (photo) => String(photo._id) !== String(req.params.id)
    );

    if (progress.progressPhotos.length === before) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    await progress.save();
    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update adherence (current + history)
router.put("/adherence", Protect, async (req, res) => {
  try {
    const progress = await ensureProgressDoc(req.user._id);

    const workoutCompleted = Boolean(req.body?.workoutCompleted);
    const dietFollowed = Boolean(req.body?.dietFollowed);
    const waterIntake = Boolean(req.body?.waterIntake);
    const sleepQuality = toNumber(req.body?.sleepQuality) ?? 0;
    const mood = toNumber(req.body?.mood) ?? 0;
    const energy = toNumber(req.body?.energy) ?? 0;
    const adherenceScore =
      toNumber(req.body?.adherenceScore) ??
      Math.min(
        (workoutCompleted ? 40 : 0) +
          (dietFollowed ? 30 : 0) +
          (waterIntake ? 15 : 0) +
          sleepQuality * 3,
        100
      );

    const diet = toNumber(req.body?.dietAdherence ?? req.body?.diet) ?? (dietFollowed ? 100 : 0);
    const workout =
      toNumber(req.body?.workoutAdherence ?? req.body?.workout) ??
      (workoutCompleted ? 100 : 0);
    const sleep = toNumber(req.body?.sleepAdherence ?? req.body?.sleep) ?? sleepQuality * 20;

    progress.adherence = {
      dietAdherence: diet,
      workoutAdherence: workout,
      sleepAdherence: sleep,
    };

    progress.adherenceHistory.push({
      date: toDate(req.body?.date),
      workoutCompleted,
      dietFollowed,
      waterIntake,
      sleepQuality,
      mood,
      energy,
      adherenceScore,
      diet,
      workout,
      sleep,
      notes: req.body?.notes || "",
    });

    await progress.save();

    return res.status(200).json({
      success: true,
      data: progress.adherence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
