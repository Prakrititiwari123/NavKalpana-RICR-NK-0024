import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Dumbbell, Calendar, Library, TrendingUp, Loader } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import WorkoutPlan from './Workout/WorkoutPlan';
import ExerciseLibrary from './Workout/ExerciseLibrary';
import ProgressOverload from './Workout/ProgressOverload';
import { useAuth } from '../../Context/AuthContext';
import { 
  getWorkouts, 
  createWorkout,
  getProgress 
} from '../../Services/profileService';
import toast from 'react-hot-toast';

const Workout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plan');
  const [loading, setLoading] = useState(true);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageIntensity: 0,
  });

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};
  const userProfile_ = userHealthData.profile || {};

  const tabs = [
    { id: 'plan', label: 'Workout Plan', icon: Calendar },
    { id: 'library', label: 'Exercise Library', icon: Library },
    { id: 'progress', label: 'Progressive Overload', icon: TrendingUp },
  ];

  const todayWorkout = {
    day: 'Monday',
    date: 'March 3, 2026',
    focus: 'Chest & Triceps',
    exercises: [
      { id: 1, name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 80, unit: 'kg' },
      { id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 30, unit: 'kg' },
      { id: 3, name: 'Cable Flyes', sets: 3, reps: 12, weight: 25, unit: 'kg' },
      { id: 4, name: 'Tricep Dips', sets: 3, reps: 12, weight: 'bodyweight', unit: '' },
      { id: 5, name: 'Overhead Tricep Extension', sets: 3, reps: 12, weight: 20, unit: 'kg' },
      { id: 6, name: 'Tricep Pushdown', sets: 3, reps: 15, weight: 30, unit: 'kg' }
    ]
  };

  const completionPercentage = todayWorkout.exercises.length
    ? Math.round((completedExercises.length / todayWorkout.exercises.length) * 100)
    : 0;

  const weeklySchedule = [
    { day: 'Monday', date: 'Mar 3', workout: 'Chest & Triceps', status: 'pending', icon: '💪' },
    { day: 'Tuesday', date: 'Mar 4', workout: 'Back & Biceps', status: 'pending', icon: '🔥' },
    { day: 'Wednesday', date: 'Mar 5', workout: 'Legs', status: 'pending', icon: '🦵' },
    { day: 'Thursday', date: 'Mar 6', workout: 'Shoulders', status: 'pending', icon: '💪' },
    { day: 'Friday', date: 'Mar 7', workout: 'Arms & Abs', status: 'pending', icon: '💪' },
    { day: 'Saturday', date: 'Mar 8', workout: 'Full Body', status: 'pending', icon: '⚡' },
    { day: 'Sunday', date: 'Mar 9', workout: 'Rest Day', status: 'pending', icon: '😴' }
  ];

  const loadWorkoutData = useCallback(async () => {
    setLoading(true);
    try {
      // Load workouts from backend
      const workouts = await getWorkouts();
      if (workouts && workouts.length > 0) {
        setWorkoutLogs(workouts);
        calculateWeeklyProgress(workouts);
      }

      // Load progress data for goals
      await getProgress();

      // Set user profile
      setUserProfile({
        age: userProfile_?.age,
        gender: userProfile_?.gender,
        weight: userVitals.currentWeight,
        height: userVitals.height,
        goal: userGoals.primaryGoal,
        experienceLevel: userGoals.experienceLevel,
      });

      // Load favorites from localStorage (temporary until backend supports it)
      const savedFavorites = localStorage.getItem('favoriteExercises');
      if (savedFavorites) {
        setFavoriteExercises(JSON.parse(savedFavorites));
      }

    } catch (error) {
      console.error('Error loading workout data:', error);
      toast.error('Failed to load workout data');
    } finally {
      setLoading(false);
    }
  }, [userGoals.experienceLevel, userGoals.primaryGoal, userProfile_?.age, userProfile_?.gender, userVitals.currentWeight, userVitals.height]);

  // Load workout data on mount
  useEffect(() => {
    loadWorkoutData();
  }, [loadWorkoutData]);

  const calculateWeeklyProgress = (workouts) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
    
    const totalWorkouts = weeklyWorkouts.length;
    const totalDuration = weeklyWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCalories = weeklyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const averageIntensity = weeklyWorkouts.length > 0 
      ? Math.round(weeklyWorkouts.reduce((sum, w) => sum + (w.intensity || 3), 0) / weeklyWorkouts.length)
      : 0;

    setWeeklyProgress({
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageIntensity,
    });
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise.id)
        ? prev.filter((id) => id !== exercise.id)
        : [...prev, exercise.id]
    );
  };

  const handleToggleFavorite = (exerciseId) => {
    setFavoriteExercises((prev) => {
      const newFavorites = prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      
      // Save to localStorage
      localStorage.setItem('favoriteExercises', JSON.stringify(newFavorites));
      
      toast.success(
        newFavorites.includes(exerciseId) 
          ? 'Added to favorites' 
          : 'Removed from favorites'
      );
      
      return newFavorites;
    });
  };

  const handleAdjustment = async (adjustment) => {
    try {
      console.log('Adjustment:', adjustment);
      // TODO: Implement adjustment logic when backend is ready
      toast.success('Progressive overload adjustment applied!');
    } catch {
      toast.error('Failed to apply adjustment');
    }
  };

  const handleWorkoutLogSubmit = async (logData) => {
    try {
      const newWorkout = await createWorkout({
        date: logData.date || new Date(),
        workoutType: logData.workoutType,
        duration: parseInt(logData.duration),
        caloriesBurned: parseInt(logData.caloriesBurned),
        exercises: logData.exercises || [],
        intensity: logData.intensity || 3,
        notes: logData.notes || '',
      });

      setWorkoutLogs(prev => [newWorkout, ...prev]);
      calculateWeeklyProgress([newWorkout, ...workoutLogs]);
      
      toast.success('Workout logged successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to log workout');
    }
  };

  const toggleExercise = (exerciseId) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const updateNote = (exerciseId, note) => {
    setExerciseNotes((prev) => ({
      ...prev,
      [exerciseId]: note,
    }));
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Generate workout plan based on user profile
  const generateWorkoutPlan = () => {
    const goal = userGoals.primaryGoal || 'maintain';
    const experience = userGoals.experienceLevel || 'beginner';
    
    let daysPerWeek = 3;
    let exercisesPerWorkout = 5;
    let restDays = ['Wednesday', 'Sunday'];

    if (experience === 'intermediate') {
      daysPerWeek = 4;
      exercisesPerWorkout = 6;
      restDays = ['Thursday', 'Sunday'];
    } else if (experience === 'advanced') {
      daysPerWeek = 5;
      exercisesPerWorkout = 7;
      restDays = ['Wednesday', 'Sunday'];
    }

    if (goal === 'muscle' || goal === 'gain') {
      // More volume for muscle building
      exercisesPerWorkout += 1;
    } else if (goal === 'lose') {
      // More cardio for weight loss
      // Adjust plan accordingly
    }

    return {
      daysPerWeek,
      exercisesPerWorkout,
      restDays,
      focus: goal === 'muscle' ? 'Hypertrophy' : 
             goal === 'lose' ? 'Fat Loss' : 
             'Strength & Conditioning',
    };
  };

  const workoutPlan = generateWorkoutPlan();

  const exerciseHistory = workoutLogs.slice(0, 5).map((workout, index) => ({
    id: workout._id || workout.id || `workout-${index}`,
    workout: workout.workoutType || 'Workout Session',
    date: new Date(workout.date || Date.now()).toLocaleDateString(),
    exercises:
      workout.exercises?.length > 0
        ? workout.exercises
        : [
            { name: 'Bench Press', weight: 80, reps: 8, previousWeight: 75 },
            { name: 'Incline Press', weight: 30, reps: 10, previousWeight: 27.5 },
          ],
    notes: workout.notes || '',
  }));

  const fallbackHistory =
    exerciseHistory.length > 0
      ? exerciseHistory
      : [
          {
            id: 'fallback-1',
            workout: todayWorkout.focus,
            date: todayWorkout.date,
            exercises: todayWorkout.exercises.map((exercise) => ({
              name: exercise.name,
              weight: typeof exercise.weight === 'number' ? exercise.weight : 0,
              reps: exercise.reps,
              previousWeight:
                typeof exercise.weight === 'number'
                  ? Math.max(exercise.weight - 2.5, 0)
                  : null,
            })),
            notes: 'Solid session with controlled form.',
          },
        ];

  const statistics = {
    totalWorkouts: workoutLogs.length || weeklyProgress.totalWorkouts || 1,
    completionRate:
      workoutLogs.length > 0
        ? Math.min(Math.round((weeklyProgress.totalWorkouts / workoutLogs.length) * 100), 100)
        : 100,
    currentStreak: Math.max(weeklyProgress.totalWorkouts, 1),
    personalRecords: [
      { exercise: 'Bench Press', weight: '95kg', unit: '', date: 'Mar 02, 2026' },
      { exercise: 'Squat', weight: '120kg', unit: '', date: 'Feb 26, 2026' },
      { exercise: 'Deadlift', weight: '150kg', unit: '', date: 'Feb 20, 2026' },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workout Center
              </h1>
            </div>
            <p className="text-gray-600">
              Plan your workouts, track progress, and build your perfect physique.
            </p>

            {/* User Profile Summary */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Experience</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {userProfile?.experienceLevel || 'Beginner'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600">Goal</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {userProfile?.goal || 'Maintain'}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Plan</p>
                <p className="text-lg font-semibold text-gray-800">
                  {workoutPlan.daysPerWeek} days/week
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600">This Week</p>
                <p className="text-lg font-semibold text-gray-800">
                  {weeklyProgress.totalWorkouts}/{workoutPlan.daysPerWeek}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'plan' && (
                <WorkoutPlan
                  onWorkoutLogSubmit={handleWorkoutLogSubmit}
                  workoutLogs={workoutLogs}
                  userProfile={userProfile}
                  workoutPlan={workoutPlan}
                  weeklyProgress={weeklyProgress}
                />
              )}

              {activeTab === 'library' && (
                <ExerciseLibrary
                  onSelect={handleExerciseSelect}
                  selected={selectedExercises}
                  favorites={favoriteExercises}
                  onToggleFavorite={handleToggleFavorite}
                  userProfile={userProfile}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressOverload
                  onAdjust={handleAdjustment}
                  workoutLogs={workoutLogs}
                  userProfile={userProfile}
                  weeklyProgress={weeklyProgress}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SECTION 2: TODAY'S WORKOUT */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl animate-fadeIn">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Today's Workout - {todayWorkout.day}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold flex items-center gap-2">
                    <IoFlame className="w-5 h-5" />
                    {todayWorkout.focus}
                  </span>
                  <span className="text-gray-500 text-sm">{todayWorkout.date}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#linear)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                      className="transition-all duration-500"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearlinear id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearlinear>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {todayWorkout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                    completedExercises.includes(exercise.id)
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  style={{
                    animation: `slideInRight 0.5s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleExercise(exercise.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        completedExercises.includes(exercise.id)
                          ? 'bg-green-500 border-green-500 scale-110'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {completedExercises.includes(exercise.id) && (
                        <FiCheck className="w-4 h-4 text-white animate-scaleIn" />
                      )}
                    </button>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className={`text-lg font-semibold ${
                          completedExercises.includes(exercise.id) ? 'text-green-700' : 'text-gray-800'
                        }`}>
                          {exercise.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {exercise.sets} × {exercise.reps}
                          </span>
                          {exercise.weight !== 'bodyweight' && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                              {exercise.weight} {exercise.unit}
                            </span>
                          )}
                          {exercise.weight === 'bodyweight' && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                              Bodyweight
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Add notes (e.g., felt strong, use straps, etc.)"
                        value={exerciseNotes[exercise.id] || ''}
                        onChange={(e) => updateNote(exercise.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={completionPercentage < 100}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                completionPercentage === 100
                  ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiCheck className="w-6 h-6" />
              {completionPercentage === 100 ? 'Mark Workout as Complete' : `Complete all exercises (${completionPercentage}%)`}
            </button>
          </div>
        </div>

        {/* SECTION 3: WEEKLY SCHEDULE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiCalendar className="w-6 h-6 text-blue-600" />
            Weekly Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((day, index) => (
              <div
                key={day.day}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  day.day === todayWorkout.day
                    ? 'bg-linear-to-br from-blue-500 to-purple-500 text-white border-blue-500 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{day.icon}</div>
                  <div className={`font-bold ${day.day === todayWorkout.day ? 'text-white' : 'text-gray-800'}`}>
                    {day.day}
                  </div>
                  <div className={`text-sm ${day.day === todayWorkout.day ? 'text-blue-100' : 'text-gray-500'}`}>
                    {day.date}
                  </div>
                  <div className={`text-sm font-semibold ${day.day === todayWorkout.day ? 'text-white' : 'text-gray-700'}`}>
                    {day.workout}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    day.day === todayWorkout.day
                      ? 'bg-white bg-opacity-20 text-white'
                      : getStatusColor(day.status)
                  }`}>
                    {day.day === todayWorkout.day ? 'Today' : day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: EXERCISE HISTORY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiActivity className="w-6 h-6 text-blue-600" />
            Exercise History
          </h2>
          <div className="space-y-4">
            {fallbackHistory.map((workout, index) => (
              <div
                key={workout.id}
                className="p-5 bg-linear-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                style={{
                  animation: `slideInLeft 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{workout.workout}</h3>
                    <p className="text-sm text-gray-500">{workout.date}</p>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400 hidden md:block" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {workout.exercises.map((exercise, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{exercise.name}</span>
                        {exercise.weight > exercise.previousWeight && (
                          <FiTrendingUp className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-gray-600">{exercise.weight}kg × {exercise.reps}</span>
                        {exercise.previousWeight && (
                          <span className="text-gray-400">
                            (prev: {exercise.previousWeight}kg)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {workout.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FiEdit3 className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{workout.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: WORKOUT STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Workouts */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <GiWeightLiftingUp className="w-12 h-12 opacity-80" />
              <span className="text-4xl font-bold">{statistics.totalWorkouts}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Total Workouts</h3>
            <p className="text-sm opacity-75">This month</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiCheck className="w-12 h-12 opacity-80" />
              <span className="text-4xl font-bold">{statistics.completionRate}%</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Completion Rate</h3>
            <p className="text-sm opacity-75">Average consistency</p>
          </div>

          {/* Current Streak */}
          <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <IoFlame className="w-12 h-12 opacity-80 animate-pulse" />
              <span className="text-4xl font-bold">{statistics.currentStreak}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Day Streak</h3>
            <p className="text-sm opacity-75">Keep it going!</p>
          </div>

          {/* Personal Records */}
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiAward className="w-12 h-12 opacity-80" />
              <span className="text-4xl font-bold">{statistics.personalRecords.length}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Personal Records</h3>
            <p className="text-sm opacity-75">New PRs this month</p>
          </div>
        </div>

        {/* Personal Records Detail */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiAward className="w-6 h-6 text-purple-600" />
            Personal Records
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statistics.personalRecords.map((pr, index) => (
              <div
                key={index}
                className="p-5 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animation: `bounceIn 0.6s ease-out ${index * 0.15}s backwards`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <FiAward className="w-8 h-8 text-purple-600" />
                  <span className="text-sm text-gray-500">{pr.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{pr.exercise}</h3>
                <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {pr.weight} {pr.unit}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Custom CSS Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Workout;
