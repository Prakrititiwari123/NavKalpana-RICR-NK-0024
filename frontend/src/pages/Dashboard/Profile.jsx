import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {  AnimatePresence } from 'framer-motion';
import {
  User,
  Heart,
  Target,
  Settings,
  Save,
  Mail,
  Calendar,
  Activity,
  Ruler,
  Weight,
  TrendingUp,
  Shield,
  Dumbbell,
  Utensils,
  Camera,
  Plus,
  Trash2,
  LineChart,
  Award,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import HealthProfile from './Profile/HealthProfile';
import GoalSettings from './Profile/GoalSettings';
import toast from 'react-hot-toast';
import {
  getStoredUser,
  setStoredUser,
  updateHealthProfile,
  updateVitals,
  saveAllGoals,
  createWorkout,
  deleteWorkout,
  createNutritionLog,
  deleteNutritionLog,
  addWeightLog,
  deleteWeightLog,
  loadAllUserData,

  updateUserProfile,
  
} from '../../Services/profileService.js'

// Helper functions
const normalizeList = (payload, fallbackKeys = []) => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    for (const key of fallbackKeys) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
};

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toNumberOrZero = (value) => toNumber(value) ?? 0;

const toTimestamp = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);

  // Track unsaved changes per section
  const [unsavedChanges, setUnsavedChanges] = useState({
    health: false,
    goals: false,
    workouts: false,
    nutrition: false,
    progress: false,
    analytics: false,
  });

  // Form data for health profile (matches User schema)
  const [healthFormData, setHealthFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    activityLevel: '',
    bmi: null,
    bmiCategory: '',
  });

  // Form data for goal settings (matches User + Progress schemas)
  const [goalFormData, setGoalFormData] = useState({
    goalType: '',
    targetWeight: '',
    timeline: '',
    experienceLevel: '',
    calorieTarget: null,
    startWeight: '',
    targetDate: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
    },
    adherence: {
      dietAdherence: 0,
      workoutAdherence: 0,
      sleepAdherence: 0,
    },
  });

  // Workout logs data (matches WorkoutLog schema)
  const [workoutData, setWorkoutData] = useState({
    workouts: [],
    currentWorkout: {
      date: new Date().toISOString().split('T')[0],
      workoutType: 'Cardio',
      duration: '',
      caloriesBurned: '',
    },
  });

  // Nutrition logs data (matches NutritionLog schema)
  const [nutritionData, setNutritionData] = useState({
    meals: [],
    currentMeal: {
      date: new Date().toISOString().split('T')[0],
      mealType: 'Breakfast',
      calories: '',
      macros: {
        protein: '',
        carbs: '',
        fats: '',
      },
    },
  });

  // Progress tracking data (matches Progress schema)
  const [progressData, setProgressData] = useState({
    weightLogs: [],
    progressPhotos: [],
    currentWeightLog: {
      date: new Date().toISOString().split('T')[0],
      weight: '',
      note: '',
    },
  });

  // Analytics data (matches Analytics schema)
  const [analyticsData, setAnalyticsData] = useState({
    period: '7d',
    weightChange: 0,
    habitScore: 0,
    predictions: {
      nextWeight: null,
      confidence: 85,
    },
  });

  console.log(analyticsData);
  
  // Memoized values for performance
  const workoutLogs = useMemo(
    () => (Array.isArray(workoutData.workouts) ? workoutData.workouts : []),
    [workoutData.workouts]
  );

  const mealLogs = useMemo(
    () => (Array.isArray(nutritionData.meals) ? nutritionData.meals : []),
    [nutritionData.meals]
  );

  const weightLogs = useMemo(
    () => (Array.isArray(progressData.weightLogs) ? progressData.weightLogs : []),
    [progressData.weightLogs]
  );

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health Profile', icon: Heart },
    { id: 'goals', label: 'Goals & Targets', icon: Target },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  // In Profile.jsx - Fix the useEffect dependencies
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load from localStorage first
        const storedUser = getStoredUser();
        if (storedUser) {
          setUserData(storedUser);

          // Map user data to form
          setHealthFormData({
            fullName: storedUser?.fullName || '',
            age: storedUser?.age || '',
            gender: storedUser?.gender || '',
            height: storedUser?.height || '',
            heightUnit: 'cm',
            weight: storedUser?.weight || '',
            activityLevel: storedUser?.activityLevel || '',
            bmi: null,
            bmiCategory: '',
          });

          setGoalFormData(prev => ({
            ...prev,
            goalType: storedUser?.primaryGoal || '',
            experienceLevel: storedUser?.experienceLevel || '',
          }));
        }

        // Load from API
        const { workouts, nutrition, progress, analytics } = await loadAllUserData();

        // Set workouts
        if (workouts && workouts.length > 0) {
          setWorkoutData(prev => ({ ...prev, workouts }));
        }

        // Set nutrition
        if (nutrition && nutrition.length > 0) {
          setNutritionData(prev => ({ ...prev, meals: nutrition }));
        }

        // Set progress
        if (progress) {
          setProgressData(prev => ({
            ...prev,
            weightLogs: progress.weightLogs || [],
            progressPhotos: progress.progressPhotos || [],
          }));

          setGoalFormData(prev => ({
            ...prev,
            startWeight: progress.goal?.startWeight || '',
            targetWeight: progress.goal?.targetWeight || prev.targetWeight,
            targetDate: progress.goal?.targetDate
              ? new Date(progress.goal.targetDate).toISOString().split('T')[0]
              : '',
            timeline: progress.goal?.timeline || prev.timeline,
            calorieTarget: progress.goal?.calorieTarget ?? prev.calorieTarget,
            measurements: progress.measurements || prev.measurements,
          }));
        }

        // Set analytics
        if (analytics) {
          const latestAnalytics = Array.isArray(analytics) ? analytics[0] : analytics;
          if (latestAnalytics) {
            setAnalyticsData({
              period: latestAnalytics.period || '7d',
              weightChange: latestAnalytics.weightChange || 0,
              habitScore: latestAnalytics.habitScore || 0,
              predictions: latestAnalytics.predictions || { nextWeight: null, confidence: 85 },
            });
          }
        }

      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Keep empty array for initial mount only


  // Calculate BMI
  const calculateBMI = useCallback(() => {
    if (healthFormData.height && healthFormData.weight) {
      const heightInMeters = parseFloat(healthFormData.height) / 100;
      const weight = parseFloat(healthFormData.weight);
      if (heightInMeters > 0 && weight > 0) {
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        return bmi;
      }
    }
    return 'N/A';
  }, [healthFormData.height, healthFormData.weight]);

  // Calculate maintenance calories (for display only)
  const calculateMaintenanceCalories = useCallback(() => {
    if (!healthFormData.weight || !healthFormData.age || !healthFormData.gender || !healthFormData.activityLevel) {
      return null;
    }

    let bmr;
    const weight = parseFloat(healthFormData.weight);
    const age = parseInt(healthFormData.age);
    let height = parseFloat(healthFormData.height);

    if (healthFormData.gender?.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (healthFormData.gender?.toLowerCase() === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }

    const activityMultipliers = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9,
    };

    const multiplier = activityMultipliers[healthFormData.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  }, [healthFormData]);

  // Calculate weekly stats
  const calculateWeeklyStats = useCallback(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const isInLastWeek = (itemDate) => {
      const timestamp = toTimestamp(itemDate);
      return timestamp !== null && timestamp >= weekAgo && timestamp <= now;
    };

    const weeklyWorkouts = workoutLogs.filter(w => isInLastWeek(w.date));
    const weeklyMeals = mealLogs.filter(m => isInLastWeek(m.date));
    const weeklyWeights = weightLogs
      .filter(w => isInLastWeek(w.date))
      .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));

    const totalCaloriesBurned = Math.round(
      weeklyWorkouts.reduce((sum, workout) => sum + toNumberOrZero(workout.caloriesBurned), 0)
    );
    const totalCaloriesConsumed = Math.round(
      weeklyMeals.reduce((sum, meal) => sum + toNumberOrZero(meal.calories), 0)
    );

    const weightChange = weeklyWeights.length >= 2
      ? Number((toNumberOrZero(weeklyWeights[weeklyWeights.length - 1].weight) - toNumberOrZero(weeklyWeights[0].weight)).toFixed(1))
      : 0;

    return {
      totalCaloriesBurned,
      totalCaloriesConsumed,
      netCalories: totalCaloriesConsumed - totalCaloriesBurned,
      weightChange,
      workoutFrequency: weeklyWorkouts.length,
      mealFrequency: weeklyMeals.length,
    };
  }, [workoutLogs, mealLogs, weightLogs]);

  const calculateHabitScore = useCallback(() => {
    const stats = calculateWeeklyStats();
    let score = 0;

    score += Math.min(stats.workoutFrequency * 5, 40);
    score += Math.min(stats.mealFrequency * 2, 30);

    const calorieDeviation = Math.abs(stats.netCalories) / 500;
    score += Math.max(0, 30 - calorieDeviation * 5);

    return Math.min(Math.round(score), 100);
  }, [calculateWeeklyStats]);

  
  // Predict next week weight
  const predictNextWeekWeight = useCallback(() => {
    if (weightLogs.length < 2) return null;

    const sortedWeights = [...weightLogs]
      .filter(log => toTimestamp(log.date) !== null && toNumber(log.weight) !== null)
      .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));

    if (sortedWeights.length < 2) return null;

    const recentWeights = sortedWeights.slice(-7);

    if (recentWeights.length < 2) return null;

    const firstTimestamp = toTimestamp(recentWeights[0].date);
    const lastTimestamp = toTimestamp(recentWeights[recentWeights.length - 1].date);
    if (firstTimestamp === null || lastTimestamp === null) return null;

    const daySpan = Math.max((lastTimestamp - firstTimestamp) / (24 * 60 * 60 * 1000), 1);
    const totalChange = toNumberOrZero(recentWeights[recentWeights.length - 1].weight) - toNumberOrZero(recentWeights[0].weight);
    const avgDailyChange = totalChange / daySpan;
    const currentWeight = toNumberOrZero(recentWeights[recentWeights.length - 1].weight);

    return Number((currentWeight + avgDailyChange * 7).toFixed(1));
  }, [weightLogs]);

  // Get member since date
  const getMemberSince = useCallback(() => {
    if (userData?.createdAt) {
      return new Date(userData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'N/A';
  }, [userData]);

  // Handle health profile changes
  const handleHealthProfileChange = (data) => {
    setHealthFormData((prev) => ({ ...prev, ...data }));
    setUnsavedChanges(prev => ({ ...prev, health: true }));
  };

  // Handle goal settings changes
  const handleGoalSettingsChange = (data) => {
    setGoalFormData((prev) => ({ ...prev, ...data }));
    setUnsavedChanges(prev => ({ ...prev, goals: true }));
  };

  // Handle workout changes
  const handleWorkoutChange = (field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      currentWorkout: {
        ...prev.currentWorkout,
        [field]: value
      }
    }));
    setUnsavedChanges(prev => ({ ...prev, workouts: true }));
  };

  // Handle nutrition changes
  const handleNutritionChange = (field, value, isMacro = false) => {
    if (isMacro) {
      setNutritionData(prev => ({
        ...prev,
        currentMeal: {
          ...prev.currentMeal,
          macros: {
            ...prev.currentMeal.macros,
            [field]: value
          }
        }
      }));
    } else {
      setNutritionData(prev => ({
        ...prev,
        currentMeal: {
          ...prev.currentMeal,
          [field]: value
        }
      }));
    }
    setUnsavedChanges(prev => ({ ...prev, nutrition: true }));
  };

  // Handle progress changes
  const handleProgressChange = (field, value) => {
    setProgressData(prev => ({
      ...prev,
      currentWeightLog: {
        ...prev.currentWeightLog,
        [field]: value
      }
    }));
    setUnsavedChanges(prev => ({ ...prev, progress: true }));
  };

  // Save health profile (updates User schema)
  const handleSaveHealth = async () => {
    setSavingSection('health');
    try {
      // Update health profile (age, gender, activityLevel)
      await updateHealthProfile({
        age: healthFormData.age,
        gender: healthFormData.gender,
        activityLevel: healthFormData.activityLevel,
      });

      // Update vitals (height, weight)
      await updateVitals({
        height: healthFormData.height,
        weight: healthFormData.weight,
      });

      // Update fullName if changed
      if (healthFormData.fullName !== userData?.fullName) {
        await updateUserProfile({ fullName: healthFormData.fullName });
      }

      // Update localStorage
      const existingUser = getStoredUser() || {};
      const updatedUser = {
        ...existingUser,
        fullName: healthFormData.fullName,
        age: healthFormData.age,
        gender: healthFormData.gender,
        height: healthFormData.height,
        weight: healthFormData.weight,
        activityLevel: healthFormData.activityLevel,
      };

      setStoredUser(updatedUser);
      setUserData(updatedUser);
      setUnsavedChanges(prev => ({ ...prev, health: false }));
      toast.success('Health profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update health profile');
    } finally {
      setSavingSection(null);
    }
  };

 // Save goals (updates User + Progress schemas in one API call)
const handleSaveGoals = async () => {
  setSavingSection('goals');
  try {
    // Single API call for all goals data
    await saveAllGoals({
      goalType: goalFormData.goalType,
      experienceLevel: goalFormData.experienceLevel,
      startWeight: goalFormData.startWeight || healthFormData.weight,
      targetWeight: goalFormData.targetWeight,
      targetDate: goalFormData.targetDate,
      timeline: goalFormData.timeline,
      calorieTarget: goalFormData.calorieTarget,
      measurements: goalFormData.measurements,
    });

    // Update localStorage
    const existingUser = getStoredUser() || {};
    const updatedUser = {
      ...existingUser,
      primaryGoal: goalFormData.goalType,
      experienceLevel: goalFormData.experienceLevel,
      // You might also want to store progress data in a separate localStorage key
    };

    setStoredUser(updatedUser);
    setUserData(updatedUser);
    setUnsavedChanges(prev => ({ ...prev, goals: false }));
    toast.success('Goals updated successfully!');
  } catch (error) {
    toast.error(error.message || 'Failed to update goals');
  } finally {
    setSavingSection(null);
  }
};
  // Save workout (creates WorkoutLog)
  const handleSaveWorkout = async () => {
    setSavingSection('workouts');
    try {
      const { currentWorkout } = workoutData;

      if (!currentWorkout.duration || !currentWorkout.caloriesBurned) {
        toast.error('Please fill all fields');
        return;
      }

      const newWorkout = await createWorkout({
        date: new Date(currentWorkout.date),
        workoutType: currentWorkout.workoutType,
        duration: parseInt(currentWorkout.duration),
        caloriesBurned: parseInt(currentWorkout.caloriesBurned),
      });

      setWorkoutData(prev => ({
        ...prev,
        workouts: [newWorkout, ...(Array.isArray(prev.workouts) ? prev.workouts : [])],
        currentWorkout: {
          date: new Date().toISOString().split('T')[0],
          workoutType: 'Cardio',
          duration: '',
          caloriesBurned: '',
        },
      }));

      setUnsavedChanges(prev => ({ ...prev, workouts: false }));
      toast.success('Workout logged successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save workout');
    } finally {
      setSavingSection(null);
    }
  };

  // Save nutrition (creates NutritionLog)
  const handleSaveNutrition = async () => {
    setSavingSection('nutrition');
    try {
      const { currentMeal } = nutritionData;

      if (!currentMeal.calories) {
        toast.error('Please fill calories');
        return;
      }

      const newMeal = await createNutritionLog({
        date: new Date(currentMeal.date),
        mealType: currentMeal.mealType,
        calories: parseInt(currentMeal.calories),
        macros: {
          protein: currentMeal.macros.protein ? parseInt(currentMeal.macros.protein) : 0,
          carbs: currentMeal.macros.carbs ? parseInt(currentMeal.macros.carbs) : 0,
          fats: currentMeal.macros.fats ? parseInt(currentMeal.macros.fats) : 0,
        },
      });

      setNutritionData(prev => ({
        ...prev,
        meals: [newMeal, ...(Array.isArray(prev.meals) ? prev.meals : [])],
        currentMeal: {
          date: new Date().toISOString().split('T')[0],
          mealType: 'Breakfast',
          calories: '',
          macros: { protein: '', carbs: '', fats: '' },
        },
      }));

      setUnsavedChanges(prev => ({ ...prev, nutrition: false }));
      toast.success('Meal logged successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save meal');
    } finally {
      setSavingSection(null);
    }
  };

  // Save weight log (adds to Progress.weightLogs)
  const handleSaveWeight = async () => {
    setSavingSection('progress');
    try {
      const { currentWeightLog } = progressData;

      if (!currentWeightLog.weight) {
        toast.error('Please enter weight');
        return;
      }

      const newWeightLog = await addWeightLog({
        date: new Date(currentWeightLog.date),
        weight: parseFloat(currentWeightLog.weight),
        note: currentWeightLog.note,
      });

      setProgressData(prev => ({
        ...prev,
        weightLogs: [newWeightLog, ...(Array.isArray(prev.weightLogs) ? prev.weightLogs : [])],
        currentWeightLog: {
          date: new Date().toISOString().split('T')[0],
          weight: '',
          note: '',
        },
      }));

      setUnsavedChanges(prev => ({ ...prev, progress: false }));
      toast.success('Weight logged successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save weight');
    } finally {
      setSavingSection(null);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      setWorkoutData(prev => ({
        ...prev,
        workouts: (Array.isArray(prev.workouts) ? prev.workouts : []).filter(w => w._id !== id)
      }));
      toast.success('Workout deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete workout');
    }
  };

  // Delete meal
  const handleDeleteMeal = async (id) => {
    try {
      await deleteNutritionLog(id);
      setNutritionData(prev => ({
        ...prev,
        meals: (Array.isArray(prev.meals) ? prev.meals : []).filter(m => m._id !== id)
      }));
      toast.success('Meal deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete meal');
    }
  };

  // Delete weight log
  const handleDeleteWeightLog = async (id) => {
    try {
      await deleteWeightLog(id);
      setProgressData(prev => ({
        ...prev,
        weightLogs: (Array.isArray(prev.weightLogs) ? prev.weightLogs : []).filter(w => w._id !== id)
      }));
      toast.success('Weight log deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete weight log');
    }
  };

  // Memoized values for analytics
  const weeklyStats = useMemo(() => calculateWeeklyStats(), [calculateWeeklyStats]);
  const habitScore = useMemo(() => calculateHabitScore(), [calculateHabitScore]);
  const predictedWeight = useMemo(() => predictNextWeekWeight(), [predictNextWeekWeight]);

  const goalProgress = useMemo(() => {
    const currentWeight = toNumber(healthFormData.weight);
    const targetWeight = toNumber(goalFormData.targetWeight);
    const startWeight = toNumber(goalFormData.startWeight) || currentWeight;

    if (currentWeight === null || targetWeight === null || targetWeight <= 0) return null;

    const totalChange = targetWeight - startWeight;
    if (totalChange === 0) return 0;

    const currentChange = currentWeight - startWeight;
    return Number(((currentChange / totalChange) * 100).toFixed(1));
  }, [healthFormData.weight, goalFormData.targetWeight, goalFormData.startWeight]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Management</h1>
          <p className="text-gray-600">Manage your health profile, workouts, nutrition, and progress</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasUnsaved = unsavedChanges[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap relative ${isActive
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {hasUnsaved && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-32 h-32 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        {userData?.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-white" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 text-center">
                        {healthFormData.fullName || userData?.fullName || 'User Name'}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Member since {getMemberSince()}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Workouts</p>
                        <p className="text-lg font-bold text-blue-600">{workoutLogs.length}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Meals</p>
                        <p className="text-lg font-bold text-green-600">{mealLogs.length}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Weight Logs</p>
                        <p className="text-lg font-bold text-purple-600">{weightLogs.length}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Habit Score</p>
                        <p className="text-lg font-bold text-orange-600">{habitScore}</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-800">
                            {userData?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="text-sm font-medium text-gray-800">
                            {healthFormData.age || 'N/A'} years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Gender</p>
                          <p className="text-sm font-medium text-gray-800 capitalize">
                            {healthFormData.gender || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Health Statistics */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Health Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Ruler className="w-5 h-5 text-blue-600" />
                          <p className="text-xs text-gray-600">Height</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                          {healthFormData.height || 'N/A'}
                          <span className="text-sm text-gray-600 ml-1">cm</span>
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Weight className="w-5 h-5 text-purple-600" />
                          <p className="text-xs text-gray-600">Weight</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                          {healthFormData.weight || 'N/A'}
                          <span className="text-sm text-gray-600 ml-1">kg</span>
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-green-600" />
                          <p className="text-xs text-gray-600">Goal</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                          {goalFormData.targetWeight || 'N/A'}
                          <span className="text-sm text-gray-600 ml-1">kg</span>
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-orange-600" />
                          <p className="text-xs text-gray-600">BMI</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{calculateBMI()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Workouts</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {workoutLogs.slice(0, 3).map((workout) => (
                          <div key={workout._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{workout.workoutType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(workout.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">{workout.duration} min</p>
                              <p className="text-xs text-gray-500">{workout.caloriesBurned} cal</p>
                            </div>
                          </div>
                        ))}
                        {workoutLogs.length === 0 && (
                          <p className="text-gray-500 text-sm">No workouts logged yet</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Meals</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {mealLogs.slice(0, 3).map((meal) => (
                          <div key={meal._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{meal.mealType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(meal.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{meal.calories} cal</p>
                            </div>
                          </div>
                        ))}
                        {mealLogs.length === 0 && (
                          <p className="text-gray-500 text-sm">No meals logged yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Weight Progress */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Weight Progress</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {weightLogs.slice(0, 5).map((log) => (
                        <div key={log._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">
                              {new Date(log.date).toLocaleDateString()}
                            </p>
                            {log.note && <p className="text-xs text-gray-500">{log.note}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">{log.weight} kg</p>
                            {log.change && (
                              <p className={`text-xs flex items-center gap-1 justify-end ${log.change > 0 ? 'text-red-500' : 'text-green-500'
                                }`}>
                                {log.change > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {Math.abs(log.change)} kg
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {weightLogs.length === 0 && (
                        <p className="text-gray-500 text-sm">No weight logs yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Profile Tab - UPDATED with Full Name field */}
          {activeTab === 'health' && (
            <div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Health Profile</h2>
                  <button
                    onClick={handleSaveHealth}
                    disabled={savingSection === 'health' || !unsavedChanges.health}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${unsavedChanges.health && savingSection !== 'health'
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {savingSection === 'health' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                {/* Full Name Field - ADDED HERE */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={healthFormData.fullName}
                    onChange={(e) => handleHealthProfileChange({ fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <HealthProfile
                  onChange={handleHealthProfileChange}
                  values={healthFormData}
                  errors={{}}
                />
              </div>
            </div>
          )}

          {/* Goals & Targets Tab */}
          {activeTab === 'goals' && (
            <div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Goals & Targets</h2>
                  <button
                    onClick={handleSaveGoals}
                    disabled={savingSection === 'goals' || !unsavedChanges.goals}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${unsavedChanges.goals && savingSection !== 'goals'
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {savingSection === 'goals' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                <GoalSettings
                  onChange={handleGoalSettingsChange}
                  values={{ ...goalFormData, currentWeight: healthFormData.weight }}
                  errors={{}}
                  maintenanceCalories={calculateMaintenanceCalories()}
                />
              </div>
            </div>
          )}

          {/* Workouts Tab */}
          {activeTab === 'workouts' && (
            <div
              key="workouts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Workout Logs</h2>
                  <button
                    onClick={handleSaveWorkout}
                    disabled={savingSection === 'workouts' || !workoutData.currentWorkout.duration || !workoutData.currentWorkout.caloriesBurned}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Log Workout
                  </button>
                </div>

                {/* Add Workout Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={workoutData.currentWorkout.date}
                      onChange={(e) => handleWorkoutChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Type</label>
                    <select
                      value={workoutData.currentWorkout.workoutType}
                      onChange={(e) => handleWorkoutChange('workoutType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Cardio">Cardio</option>
                      <option value="Strength">Strength</option>
                      <option value="Yoga">Yoga</option>
                      <option value="HIIT">HIIT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={workoutData.currentWorkout.duration}
                      onChange={(e) => handleWorkoutChange('duration', e.target.value)}
                      placeholder="45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Calories</label>
                    <input
                      type="number"
                      value={workoutData.currentWorkout.caloriesBurned}
                      onChange={(e) => handleWorkoutChange('caloriesBurned', e.target.value)}
                      placeholder="300"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Workout History */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workoutLogs.map((workout) => (
                    <div key={workout._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${workout.workoutType === 'Cardio' ? 'bg-red-100' :
                          workout.workoutType === 'Strength' ? 'bg-blue-100' :
                            workout.workoutType === 'Yoga' ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                          <Dumbbell className={`w-5 h-5 ${workout.workoutType === 'Cardio' ? 'text-red-600' :
                            workout.workoutType === 'Strength' ? 'text-blue-600' :
                              workout.workoutType === 'Yoga' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{workout.workoutType}</p>
                          <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{workout.duration} min</p>
                          <p className="text-sm text-gray-500">{workout.caloriesBurned} cal</p>
                        </div>
                        <button
                          onClick={() => handleDeleteWorkout(workout._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {workoutLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No workouts logged yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div
              key="nutrition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Nutrition Logs</h2>
                  <button
                    onClick={handleSaveNutrition}
                    disabled={savingSection === 'nutrition' || !nutritionData.currentMeal.calories}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Log Meal
                  </button>
                </div>

                {/* Add Meal Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={nutritionData.currentMeal.date}
                      onChange={(e) => handleNutritionChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Meal Type</label>
                    <select
                      value={nutritionData.currentMeal.mealType}
                      onChange={(e) => handleNutritionChange('mealType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Calories</label>
                    <input
                      type="number"
                      value={nutritionData.currentMeal.calories}
                      onChange={(e) => handleNutritionChange('calories', e.target.value)}
                      placeholder="500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={nutritionData.currentMeal.macros.protein}
                      onChange={(e) => handleNutritionChange('protein', e.target.value, true)}
                      placeholder="25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={nutritionData.currentMeal.macros.carbs}
                      onChange={(e) => handleNutritionChange('carbs', e.target.value, true)}
                      placeholder="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Fats (g)</label>
                    <input
                      type="number"
                      value={nutritionData.currentMeal.macros.fats}
                      onChange={(e) => handleNutritionChange('fats', e.target.value, true)}
                      placeholder="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Meal History */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {mealLogs.map((meal) => (
                    <div key={meal._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{meal.mealType}</p>
                        <p className="text-sm text-gray-500">{new Date(meal.date).toLocaleDateString()}</p>
                        {(meal.macros?.protein || meal.macros?.carbs || meal.macros?.fats) && (
                          <p className="text-xs text-gray-500 mt-1">
                            P:{meal.macros.protein || 0}g C:{meal.macros.carbs || 0}g F:{meal.macros.fats || 0}g
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-green-600">{meal.calories} cal</p>
                        <button
                          onClick={() => handleDeleteMeal(meal._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {mealLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No meals logged yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Progress Tracking</h2>
                  <button
                    onClick={handleSaveWeight}
                    disabled={savingSection === 'progress' || !progressData.currentWeightLog.weight}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Log Weight
                  </button>
                </div>

                {/* Add Weight Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={progressData.currentWeightLog.date}
                      onChange={(e) => handleProgressChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={progressData.currentWeightLog.weight}
                      onChange={(e) => handleProgressChange('weight', e.target.value)}
                      placeholder="70.5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Note (optional)</label>
                    <input
                      type="text"
                      value={progressData.currentWeightLog.note}
                      onChange={(e) => handleProgressChange('note', e.target.value)}
                      placeholder="Morning weight"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Measurements Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Measurements (cm)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Chest</label>
                      <input
                        type="number"
                        value={goalFormData.measurements.chest}
                        onChange={(e) => setGoalFormData(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, chest: e.target.value }
                        }))}
                        placeholder="95"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Waist</label>
                      <input
                        type="number"
                        value={goalFormData.measurements.waist}
                        onChange={(e) => setGoalFormData(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, waist: e.target.value }
                        }))}
                        placeholder="80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Hips</label>
                      <input
                        type="number"
                        value={goalFormData.measurements.hips}
                        onChange={(e) => setGoalFormData(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, hips: e.target.value }
                        }))}
                        placeholder="95"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Arms</label>
                      <input
                        type="number"
                        value={goalFormData.measurements.arms}
                        onChange={(e) => setGoalFormData(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, arms: e.target.value }
                        }))}
                        placeholder="32"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Thighs</label>
                      <input
                        type="number"
                        value={goalFormData.measurements.thighs}
                        onChange={(e) => setGoalFormData(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, thighs: e.target.value }
                        }))}
                        placeholder="55"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Weight History */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Weight History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {weightLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                        {log.note && <p className="text-sm text-gray-500">{log.note}</p>}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{log.weight} kg</p>
                          {log.change && (
                            <p className={`text-xs flex items-center gap-1 ${log.change > 0 ? 'text-red-500' : 'text-green-500'
                              }`}>
                              {log.change > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {Math.abs(log.change)} kg
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteWeightLog(log._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {weightLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No weight logs yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Insights</h2>

                {/* Habit Score */}
                <div className="bg-linear-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Habit Score</h3>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#f97316"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - habitScore / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{habitScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-2">
                        {habitScore >= 80 ? 'Excellent consistency!' :
                          habitScore >= 60 ? 'Good progress, keep it up!' :
                            habitScore >= 40 ? 'You\'re on your way!' :
                              'Time to focus on your habits'}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-8">
                          <span className="text-sm">Workouts: {weeklyStats.workoutFrequency}/7</span>
                          <span className="text-sm font-medium">{Math.min(weeklyStats.workoutFrequency * 5, 40)}/40</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-sm">Meals: {weeklyStats.mealFrequency}/21</span>
                          <span className="text-sm font-medium">{Math.min(weeklyStats.mealFrequency * 2, 30)}/30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Calorie Balance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Burned</span>
                        <span className="font-bold text-blue-600">{weeklyStats.totalCaloriesBurned} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consumed</span>
                        <span className="font-bold text-orange-600">{weeklyStats.totalCaloriesConsumed} kcal</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Net</span>
                          <span className={`font-bold ${weeklyStats.netCalories > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {weeklyStats.netCalories > 0 ? '+' : ''}{weeklyStats.netCalories} kcal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Weight Trends</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current</span>
                        <span className="font-bold text-gray-800">{healthFormData.weight || 'N/A'} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Change</span>
                        <span className={`font-bold flex items-center gap-1 ${weeklyStats.weightChange > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {weeklyStats.weightChange > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {Math.abs(weeklyStats.weightChange)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Goal Progress</span>
                        <span className="font-bold text-purple-600">
                          {goalProgress !== null ? `${goalProgress}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-purple-600" />
                    AI Predictions
                  </h3>
                  {predictedWeight !== null ? (
                    <div>
                      <p className="text-3xl font-bold text-gray-800 mb-2">{predictedWeight} kg</p>
                      <p className="text-sm text-gray-600">Predicted weight next week</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">85% confidence</span>
                        <span className="text-xs text-gray-500">Based on your last 7 days</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Log more weight entries to see predictions</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

                {/* Medical Disclaimer */}
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Medical Disclaimer</h4>
                      <p className="text-xs text-gray-700">
                        The information provided here is for general guidance only. Always consult with a
                        qualified healthcare professional before starting any new fitness or nutrition program.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Data Management</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download or manage your personal health data
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Download Data
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Export Profile
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Privacy Settings</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Control your privacy and data sharing preferences
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Share progress with trainers</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Allow data analytics</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">
                      Irreversible actions - proceed with caution
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
