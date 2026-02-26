import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Target,
  TrendingUp,
  Award,
  X,
} from 'lucide-react';
import WorkoutDetail from './WorkoutDetail';
import { useAuth } from '../../../context/AuthContext';
import { createWorkout } from '../../../services/profileService';
import toast from 'react-hot-toast';

const WorkoutPlan = ({ 
  plan: externalPlan, 
  weekOffset = 0, 
  onUpdate,
  workoutLogs = [],
  userProfile,
  workoutPlan: generatedPlan,
  weeklyProgress 
}) => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [expandedDays, setExpandedDays] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [completingWorkout, setCompletingWorkout] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};

  // Generate dynamic workout plan based on user profile
  const generateWorkoutPlan = () => {
    const goal = userGoals.primaryGoal || 'maintain';
    const experience = userGoals.experienceLevel || 'beginner';
    const weight = userVitals.currentWeight || 70;

    // Determine workout split based on goal and experience
    let workoutSplit = 'push-pull-legs';
    let daysPerWeek = 4;
    let focus = 'Hypertrophy';

    if (experience === 'beginner') {
      daysPerWeek = 3;
      workoutSplit = 'full-body';
      focus = 'Foundation';
    } else if (experience === 'intermediate') {
      daysPerWeek = 4;
      workoutSplit = 'upper-lower';
      focus = 'Strength & Hypertrophy';
    } else if (experience === 'advanced') {
      daysPerWeek = 5;
      workoutSplit = 'bro-split';
      focus = 'Specialization';
    }

    if (goal === 'lose') {
      focus = 'Fat Loss & Conditioning';
    } else if (goal === 'muscle') {
      focus = 'Muscle Building';
    }

    return {
      level: experience.charAt(0).toUpperCase() + experience.slice(1),
      goal: userGoals.primaryGoal || 'Maintain',
      focus,
      daysPerWeek,
      split: workoutSplit,
      weeks: generateWeeks(daysPerWeek, focus),
    };
  };

  // Generate weeks based on split
  const generateWeeks = (daysPerWeek, focus) => {
    const weeks = [];
    const startDate = new Date();
    
    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (w * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const days = [];
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      for (let d = 0; d < daysPerWeek; d++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + d);
        
        // Check if workout already logged for this day
        const isCompleted = workoutLogs.some(log => 
          new Date(log.date).toDateString() === dayDate.toDateString()
        );

        days.push({
          id: `w${w}d${d}`,
          day: dayNames[d],
          date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: dayDate,
          focus: getDayFocus(d, focus),
          duration: getDayDuration(d, focus),
          completed: isCompleted,
          exercises: generateExercisesForDay(d, focus, userGoals.experienceLevel),
        });
      }

      weeks.push({
        weekNumber: w + 1,
        startDate: weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        endDate: weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        days,
      });
    }

    return weeks;
  };

  const getDayFocus = (dayIndex, focus) => {
    const focuses = [
      'Chest & Triceps',
      'Back & Biceps',
      'Legs & Core',
      'Shoulders & Arms',
      'Full Body',
      'Cardio & Conditioning',
      'Active Recovery',
    ];
    return focuses[dayIndex] || 'Rest Day';
  };

  const getDayDuration = (dayIndex, focus) => {
    if (dayIndex === 5) return '45 min';
    if (dayIndex === 6) return '30 min';
    return '60 min';
  };

  const generateExercisesForDay = (dayIndex, focus, level) => {
    // This would ideally come from an exercise database
    const baseExercises = [
      {
        id: 1,
        name: 'Barbell Bench Press',
        sets: 4,
        reps: '8-10',
        rest: '90s',
        equipment: 'Barbell',
        muscleGroup: 'Chest',
        difficulty: 'Intermediate',
        notes: 'Keep back flat, squeeze chest at top',
        videoUrl: '#',
        weight: 60,
      },
      {
        id: 2,
        name: 'Pull-ups',
        sets: 4,
        reps: '8-10',
        rest: '90s',
        equipment: 'Pull-up Bar',
        muscleGroup: 'Back',
        difficulty: 'Intermediate',
        notes: 'Full range of motion',
        videoUrl: '#',
        weight: 0,
      },
      // ... more exercises
    ];

    // Filter based on day focus
    if (dayIndex === 0) return baseExercises.slice(0, 5);
    if (dayIndex === 1) return baseExercises.slice(5, 10);
    return baseExercises.slice(0, 4);
  };

  const workoutPlan = externalPlan || generateWorkoutPlan();
  const currentPlan = workoutPlan.weeks[selectedWeek + weekOffset] || workoutPlan.weeks[0];

  // Calculate completion status for each day
  useEffect(() => {
    const completedDays = currentPlan.days.filter(day => 
      workoutLogs.some(log => 
        new Date(log.date).toDateString() === day.fullDate?.toDateString()
      )
    );
    
    // Update day completion status
    currentPlan.days.forEach(day => {
      const isCompleted = workoutLogs.some(log => 
        new Date(log.date).toDateString() === day.fullDate?.toDateString()
      );
      day.completed = isCompleted;
    });
  }, [workoutLogs, currentPlan]);

  const toggleDay = (dayId) => {
    setExpandedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const handleExerciseClick = (exercise, dayData) => {
    setSelectedExercise({ ...exercise, dayData });
    setShowDetailModal(true);
  };

  const handleCompleteWorkout = async (dayData) => {
    setCompletingWorkout(true);
    try {
      // Calculate totals
      const totalDuration = parseInt(dayData.duration) || 60;
      const totalCalories = Math.round(totalDuration * 8); // Rough estimate: 8 cal/min

      const workoutData = {
        date: dayData.fullDate || new Date(),
        workoutType: dayData.focus,
        duration: totalDuration,
        caloriesBurned: totalCalories,
        exercises: dayData.exercises.map(e => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
        })),
        intensity: dayData.focus.includes('Legs') ? 4 : 3,
      };

      const newWorkout = await createWorkout(workoutData);
      
      if (onUpdate) {
        onUpdate(newWorkout);
      }

      toast.success('Workout completed! Great job! 💪');
      setShowCompletionForm(false);
      setCurrentDay(null);
    } catch (error) {
      toast.error('Failed to log workout');
    } finally {
      setCompletingWorkout(false);
    }
  };

  const handleComplete = (exerciseData) => {
    if (onUpdate) {
      onUpdate(exerciseData);
    }
    setShowDetailModal(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Workout Plan - Week ${currentPlan.weekNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; }
            .day { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .exercise { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 4px; }
            .completed { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Workout Plan - Week ${currentPlan.weekNumber}</h1>
          <p>${currentPlan.startDate} - ${currentPlan.endDate}</p>
          <p>Goal: ${workoutPlan.goal} | Level: ${workoutPlan.level}</p>
          
          ${currentPlan.days.map(day => `
            <div class="day">
              <h2>${day.day} - ${day.focus}</h2>
              <p>Duration: ${day.duration} | ${day.completed ? '✓ Completed' : 'Pending'}</p>
              ${day.exercises.map(ex => `
                <div class="exercise">
                  <strong>${ex.name}</strong><br>
                  ${ex.sets} × ${ex.reps} | Rest: ${ex.rest}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    // Create PDF-style content
    const content = JSON.stringify({
      week: currentPlan.weekNumber,
      startDate: currentPlan.startDate,
      endDate: currentPlan.endDate,
      days: currentPlan.days.map(day => ({
        day: day.day,
        focus: day.focus,
        completed: day.completed,
        exercises: day.exercises,
      })),
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-plan-week-${currentPlan.weekNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Workout plan downloaded!');
  };

  const completedDays = currentPlan.days.filter(d => d.completed).length;
  const progressPercentage = (completedDays / currentPlan.days.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Weekly Workout Plan</h2>
          <p className="text-gray-600 text-sm mt-1">
            {currentPlan.startDate} - {currentPlan.endDate} • Week {currentPlan.weekNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={selectedWeek === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() =>
              setSelectedWeek(Math.min(workoutPlan.weeks.length - 1, selectedWeek + 1))
            }
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={selectedWeek === workoutPlan.weeks.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Plan Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Goal</p>
          <p className="text-lg font-bold text-gray-800 capitalize">{workoutPlan.goal}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Level</p>
          <p className="text-lg font-bold text-gray-800">{workoutPlan.level}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Focus</p>
          <p className="text-lg font-bold text-gray-800">{workoutPlan.focus}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Split</p>
          <p className="text-lg font-bold text-gray-800 capitalize">
            {workoutPlan.split?.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
          <span className="text-sm font-bold text-blue-600">{completedDays}/{currentPlan.days.length} days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-3">
        {currentPlan.days.map((dayPlan) => {
          const isExpanded = expandedDays.includes(dayPlan.id);
          const isRestDay = dayPlan.focus === 'Rest Day' || dayPlan.focus === 'Active Recovery';
          const isCompleted = dayPlan.completed;

          return (
            <motion.div
              key={dayPlan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                isCompleted
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Day Header */}
              <button
                onClick={() => !isRestDay && toggleDay(dayPlan.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {isCompleted ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">
                      {dayPlan.day} - {dayPlan.focus}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>{dayPlan.date}</span>
                      {!isRestDay && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayPlan.duration}
                          </div>
                          <span>•</span>
                          <span>{dayPlan.exercises?.length || 0} exercises</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!isRestDay && (
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDay(dayPlan);
                          setShowCompletionForm(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                )}
              </button>

              {/* Exercises List */}
              {isExpanded && !isRestDay && dayPlan.exercises && (
                <div className="px-4 pb-4 space-y-2">
                  {dayPlan.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleExerciseClick(exercise, dayPlan)}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>
                              {exercise.sets} × {exercise.reps}
                            </span>
                            <span>•</span>
                            <span>Rest: {exercise.rest}</span>
                            {exercise.weight > 0 && (
                              <>
                                <span>•</span>
                                <span>Weight: {exercise.weight} kg</span>
                              </>
                            )}
                            <span>•</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                              exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-blue-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Workout Completion Modal */}
      {showCompletionForm && currentDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Complete Workout</h3>
              <button
                onClick={() => setShowCompletionForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Mark {currentDay.day}'s workout as complete? This will log your workout.
            </p>

            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Workout:</span> {currentDay.focus}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <span className="font-semibold">Duration:</span> {currentDay.duration}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <span className="font-semibold">Exercises:</span> {currentDay.exercises?.length || 0}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleCompleteWorkout(currentDay)}
                disabled={completingWorkout}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {completingWorkout ? 'Saving...' : 'Yes, Complete'}
              </button>
              <button
                onClick={() => setShowCompletionForm(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Workout Detail Modal */}
      {showDetailModal && selectedExercise && (
        <WorkoutDetail
          exercise={selectedExercise}
          dayData={selectedExercise.dayData}
          onComplete={handleComplete}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default WorkoutPlan;