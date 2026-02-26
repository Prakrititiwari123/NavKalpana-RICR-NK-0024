import axiosInstance from "../config/Api";

/* =====================================================
   LOCAL STORAGE (ONLY USER BASIC PROFILE)
===================================================== */

const USER_KEY = "healthnexus_user";

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj ?? {}, key);

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
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

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/* =====================================================
   USER (AUTH + BASIC PROFILE + FITNESS META)
   Based on User Schema
===================================================== */

// Update user profile (fullName, age, gender, heightCm, weightKg)
export const updateUserProfile = async (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No profile data provided");
  }

  const response = await axiosInstance.patch("/user/update-profile", payload);

  const updatedUser = response?.data?.data || response?.data;
  if (!updatedUser) {
    throw new Error("Invalid server response");
  }

  setStoredUser(updatedUser);
  return updatedUser;
};

// Update health profile (age, gender, activityLevel)
export const updateHealthProfile = async (data) => {
  const payload = {};
  if (hasOwn(data, "age")) payload.age = toNumberOrNull(data.age);
  if (hasOwn(data, "gender")) payload.gender = data.gender;
  if (hasOwn(data, "activityLevel")) payload.activityLevel = data.activityLevel;
  return updateUserProfile(payload);
};

// Update vitals (height, weight)
export const updateVitals = async (data) => {
  const payload = {};
  if (hasOwn(data, "height") || hasOwn(data, "heightCm")) {
    payload.height = toNumberOrNull(data.height ?? data.heightCm);
  }
  if (hasOwn(data, "currentWeight") || hasOwn(data, "weight") || hasOwn(data, "weightKg")) {
    payload.weight = toNumberOrNull(data.currentWeight ?? data.weight ?? data.weightKg);
  }
  return updateUserProfile(payload);
};

const buildGoalsPayload = (data = {}) => {
  const payload = {};

  if (hasOwn(data, "primaryGoal") || hasOwn(data, "goalType")) {
    payload.primaryGoal = data.primaryGoal ?? data.goalType ?? null;
  }

  if (hasOwn(data, "experienceLevel")) {
    payload.experienceLevel = data.experienceLevel ?? null;
  }

  const progressGoal = {};

  if (hasOwn(data, "startWeight")) {
    progressGoal.startWeight = toNumberOrNull(data.startWeight);
  }
  if (hasOwn(data, "targetWeight")) {
    progressGoal.targetWeight = toNumberOrNull(data.targetWeight);
  }
  if (hasOwn(data, "targetDate")) {
    progressGoal.targetDate = data.targetDate || null;
  }
  if (hasOwn(data, "timeline")) {
    progressGoal.timeline = data.timeline || null;
  }
  if (hasOwn(data, "calorieTarget")) {
    progressGoal.calorieTarget = toNumberOrNull(data.calorieTarget);
  }

  if (Object.keys(progressGoal).length > 0) {
    payload.progressGoal = progressGoal;
  }

  if (data.measurements && typeof data.measurements === "object") {
    payload.measurements = normalizeMeasurements(data.measurements);
  }

  return payload;
};

// Save all goals data (updates User + Progress schemas in one call)
export const saveAllGoals = async (data) => {
  const payload = buildGoalsPayload(data);
  if (Object.keys(payload).length === 0) {
    throw new Error("No goals data provided");
  }

  const res = await axiosInstance.put("/api/user/goals", payload);
  return res?.data?.data || null;
};

// Partial goals update (same route, used by diet/macro updates)
export const updateGoals = async (data) => {
  return saveAllGoals(data);
};


// Update fitness meta (activityLevel, experienceLevel, primaryGoal)
export const updateFitnessProfile = async (data) => {
  return updateUserProfile({
    activityLevel: data.activityLevel,
    experienceLevel: data.experienceLevel,
    primaryGoal: data.primaryGoal,
  });
};

/* =====================================================
   WORKOUT LOGS - Based on WorkoutLog Schema
===================================================== */

export const getWorkouts = async () => {
  const res = await axiosInstance.get("/api/workouts");
  return res?.data?.data || [];
};

export const createWorkout = async (data) => {
  // Format data according to WorkoutLog schema
  const workoutData = {
    date: data.date || new Date(),
    workoutType: data.workoutType,
    duration: toNumberOrNull(data.duration), // minutes
    caloriesBurned: toNumberOrNull(data.caloriesBurned),
    intensity: toNumberOrNull(data.intensity) ?? 3,
    notes: data.notes || "",
    exercises: Array.isArray(data.exercises) ? data.exercises : [],
  };

  const res = await axiosInstance.post("/api/workouts", workoutData);
  return res?.data?.data;
};

export const updateWorkout = async (id, data) => {
  const res = await axiosInstance.put(`/api/workouts/${id}`, data);
  return res?.data?.data;
};

export const deleteWorkout = async (id) => {
  await axiosInstance.delete(`/api/workouts/${id}`);
  return true;
};

/* =====================================================
   NUTRITION LOGS - Based on NutritionLog Schema
===================================================== */

export const getNutritionLogs = async () => {
  const res = await axiosInstance.get("/api/nutrition");
  return res?.data?.data || [];
};

export const createNutritionLog = async (data) => {
  // Format data according to NutritionLog schema
  const nutritionData = {
    date: data.date || new Date(),
    mealType: data.mealType, // Breakfast, Lunch, Dinner, Snack
    calories: toNumberOrNull(data.calories),
    macros: {
      protein: toNumberOrNull(data.macros?.protein) ?? 0,
      carbs: toNumberOrNull(data.macros?.carbs) ?? 0,
      fats: toNumberOrNull(data.macros?.fats) ?? 0,
    },
    foodItems: Array.isArray(data.foodItems) ? data.foodItems : [],
    notes: data.notes || "",
  };

  const res = await axiosInstance.post("/api/nutrition", nutritionData);
  return res?.data?.data;
};

export const updateNutritionLog = async (id, data) => {
  const res = await axiosInstance.put(`/api/nutrition/${id}`, data);
  return res?.data?.data;
};

export const deleteNutritionLog = async (id) => {
  await axiosInstance.delete(`/api/nutrition/${id}`);
  return true;
};

/* =====================================================
   PROGRESS - Based on Progress Schema
===================================================== */

export const getProgress = async () => {
  const res = await axiosInstance.get("/api/progress");
  return res?.data?.data || null;
};

// Add weight log to progress.weightLogs array
export const addWeightLog = async (data) => {
  const weightLogData = {
    date: data.date || new Date(),
    weight: toNumberOrNull(data.weight),
    note: data.note || "",
  };

  const res = await axiosInstance.post("/api/progress/weight", weightLogData);
  return res?.data?.data;
};

// Delete weight log from progress.weightLogs array
export const deleteWeightLog = async (id) => {
  await axiosInstance.delete(`/api/progress/weight/${id}`);
  return true;
};

// Update measurements (chest, waist, hips, arms, thighs)
export const updateMeasurements = async (data) => {
  const res = await axiosInstance.put(
    "/api/progress/measurements",
    normalizeMeasurements(data)
  );
  return res?.data?.data;
};

// Update progress goal (startWeight, targetWeight, targetDate, timeline, calorieTarget)
export const updateProgressGoal = async (data) => {
  const goalData = {
    startWeight: toNumberOrNull(data.startWeight),
    targetWeight: toNumberOrNull(data.targetWeight),
    targetDate: data.targetDate || null,
    timeline: data.timeline || null,
    calorieTarget: toNumberOrNull(data.calorieTarget),
  };

  const res = await axiosInstance.put("/api/progress/goal", goalData);
  return res?.data?.data;
};

// Update adherence metrics
export const updateAdherence = async (data) => {
  const adherenceData = {
    date: data.date || new Date(),
    workoutCompleted: Boolean(data.workoutCompleted),
    dietFollowed: Boolean(data.dietFollowed),
    waterIntake: Boolean(data.waterIntake),
    sleepQuality: toNumberOrNull(data.sleepQuality) ?? 0,
    mood: toNumberOrNull(data.mood) ?? 0,
    energy: toNumberOrNull(data.energy) ?? 0,
    adherenceScore: toNumberOrNull(data.adherenceScore) ?? null,
    dietAdherence: toNumberOrNull(data.dietAdherence ?? data.diet) ?? 0,
    workoutAdherence: toNumberOrNull(data.workoutAdherence ?? data.workout) ?? 0,
    sleepAdherence: toNumberOrNull(data.sleepAdherence ?? data.sleep) ?? 0,
    notes: data.notes || "",
  };

  const res = await axiosInstance.put("/api/progress/adherence", adherenceData);
  return res?.data?.data;
};

// Add progress photo
export const addProgressPhoto = async (data) => {
  const payload = {
    date: data.date || new Date(),
    photoUrl: data.photoUrl || data.url,
    note: data.note || "",
  };
  const res = await axiosInstance.post("/api/progress/photos", payload);
  return res?.data?.data;
};

// Delete progress photo
export const deleteProgressPhoto = async (id) => {
  await axiosInstance.delete(`/api/progress/photos/${id}`);
  return true;
};

// Update full progress
export const updateProgress = async (data) => {
  const res = await axiosInstance.put("/api/progress", data);
  return res?.data?.data;
};

/* =====================================================
   ANALYTICS - Based on Analytics Schema
===================================================== */

export const getAnalytics = async () => {
  const res = await axiosInstance.get("/api/analytics");
  return res?.data?.data || [];
};

export const createAnalytics = async (data) => {
  const analyticsData = {
    period: data.period || "7d",
    weightChange: data.weightChange,
    habitScore: data.habitScore,
    predictions: {
      nextWeight: data.predictions?.nextWeight,
      confidence: data.predictions?.confidence || 85,
    },
  };

  const res = await axiosInstance.post("/api/analytics", analyticsData);
  return res?.data?.data;
};

export const updateAnalytics = async (id, data) => {
  const res = await axiosInstance.put(`/api/analytics/${id}`, data);
  return res?.data?.data;
};

export const deleteAnalytics = async (id) => {
  await axiosInstance.delete(`/api/analytics/${id}`);
  return true;
};

/* =====================================================
   DASHBOARD – LOAD EVERYTHING
===================================================== */

export const loadAllUserData = async () => {
  try {
    const [workouts, nutrition, progress, analytics] = await Promise.allSettled([
      getWorkouts(),
      getNutritionLogs(),
      getProgress(),
      getAnalytics(),
    ]);

    return {
      workouts: workouts.status === "fulfilled" ? workouts.value : [],
      nutrition: nutrition.status === "fulfilled" ? nutrition.value : [],
      progress: progress.status === "fulfilled" ? progress.value : null,
      analytics: analytics.status === "fulfilled" ? analytics.value : [],
    };
  } catch (error) {
    console.error("Error loading all user data:", error);
    return {
      workouts: [],
      nutrition: [],
      progress: null,
      analytics: [],
    };
  }
};
