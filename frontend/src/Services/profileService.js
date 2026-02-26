import axiosInstance from "../config/Api";

/* =====================================================
   LOCAL STORAGE (ONLY USER BASIC PROFILE)
===================================================== */

const USER_KEY = "healthnexus_user";

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
  return updateUserProfile({
    age: data.age,
    gender: data.gender,
    activityLevel: data.activityLevel,
  });
};

// Update vitals (height, weight)
export const updateVitals = async (data) => {
  return updateUserProfile({
    heightCm: data.height || data.heightCm,
    weightKg: data.currentWeight || data.weight || data.weightKg,
    ...(data.goalWeight && { goalWeight: data.goalWeight }), // This will be handled by goals separately
  });
};

// Update fitness goals (primaryGoal, experienceLevel)
export const updateGoals = async (data) => {
  return updateUserProfile({
    primaryGoal: data.primaryGoal,
    experienceLevel: data.experienceLevel,
    ...(data.timeline && { timeline: data.timeline }), // User schema doesn't have timeline, will be in Progress
    ...(data.calorieTarget && { calorieTarget: data.calorieTarget }), // User schema doesn't have calorieTarget
  });
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
    duration: data.duration, // minutes
    caloriesBurned: data.caloriesBurned,
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
    calories: data.calories,
    macros: {
      protein: data.macros?.protein || 0,
      carbs: data.macros?.carbs || 0,
      fats: data.macros?.fats || 0,
    },
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
    weight: data.weight,
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
  const res = await axiosInstance.put("/api/progress/measurements", data);
  return res?.data?.data;
};

// Update progress goal (startWeight, targetWeight, targetDate)
export const updateProgressGoal = async (data) => {
  const goalData = {
    startWeight: data.startWeight,
    targetWeight: data.targetWeight,
    targetDate: data.targetDate,
  };

  const res = await axiosInstance.put("/api/progress/goal", goalData);
  return res?.data?.data;
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
  return res?.data?.data || null;
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
      analytics: analytics.status === "fulfilled" ? analytics.value : null,
    };
  } catch (error) {
    console.error("Error loading all user data:", error);
    return {
      workouts: [],
      nutrition: [],
      progress: null,
      analytics: null,
    };
  }
};