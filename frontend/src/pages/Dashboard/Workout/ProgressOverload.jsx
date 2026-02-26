import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Check,
  X,
  Info,
  Activity,
  Zap,
  Award,
  Calendar,
  Dumbbell,
  BarChart,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import toast from 'react-hot-toast';

const ProgressOverload = ({ workoutData = [], onAdjust, suggestions = [] }) => {
  const { user } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [timeRange, setTimeRange] = useState('4weeks'); // '4weeks', '8weeks', 'all'

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userGoals = userHealthData.goals || {};
  const experienceLevel = userGoals.experienceLevel || 'beginner';

  // Process real workout data
  const processedWorkoutData = useMemo(() => {
    if (workoutData.length === 0) return [];

    // Group workouts by exercise name
    const exerciseMap = new Map();

    workoutData.forEach(workout => {
      if (!workout.exercises) return;

      workout.exercises.forEach(exercise => {
        if (!exercise.name) return;

        if (!exerciseMap.has(exercise.name)) {
          exerciseMap.set(exercise.name, {
            exerciseName: exercise.name,
            history: [],
            muscleGroups: new Set(),
          });
        }

        const exerciseEntry = exerciseMap.get(exercise.name);

        // Track muscle groups
        if (exercise.muscleGroup) {
          exerciseEntry.muscleGroups.add(exercise.muscleGroup);
        }

        // Calculate volume (weight × reps × sets)
        const volume = (exercise.weight || 0) * (exercise.reps || 0) * (exercise.sets || 0);

        exerciseEntry.history.push({
          date: workout.date,
          volume,
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
          weight: exercise.weight || 0,
          workoutId: workout._id,
        });
      });
    });

    // Sort history by date and convert to array
    const result = [];
    exerciseMap.forEach((value, key) => {
      value.history.sort((a, b) => new Date(a.date) - new Date(b.date));
      result.push({
        exerciseName: key,
        muscleGroups: Array.from(value.muscleGroups),
        history: value.history,
      });
    });

    return result;
  }, [workoutData]);

  // Use real data if available, otherwise use mock data
  const exerciseData = processedWorkoutData.length > 0 ? processedWorkoutData : mockWorkoutData;

  // Filter data based on time range
  const filterDataByTimeRange = (history) => {
    if (timeRange === 'all') return history;

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === '4weeks') {
      cutoffDate.setDate(now.getDate() - 28);
    } else if (timeRange === '8weeks') {
      cutoffDate.setDate(now.getDate() - 56);
    }

    return history.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!exerciseData || exerciseData.length === 0) return [];

    return exerciseData.map((exercise) => {
      // Check if exercise has history
      if (!exercise.history || exercise.history.length === 0) return null;

      const filteredHistory = filterDataByTimeRange(exercise.history);

      if (filteredHistory.length === 0) return null;

      const latestWorkout = filteredHistory[filteredHistory.length - 1];
      const previousWorkout = filteredHistory[filteredHistory.length - 2];
      const firstWorkout = filteredHistory[0];

      // Safely access properties with fallbacks
      const volumeChange = previousWorkout
        ? ((latestWorkout.volume - previousWorkout.volume) / (previousWorkout.volume || 1)) * 100
        : 0;

      const totalVolumeGain = firstWorkout
        ? ((latestWorkout.volume - firstWorkout.volume) / (firstWorkout.volume || 1)) * 100
        : 0;

      const avgWeeklyGain = filteredHistory.length > 1
        ? totalVolumeGain / (filteredHistory.length - 1)
        : 0;

      // Calculate 1RM estimate (Brzycki formula) with safety checks
      let estimated1RM = null;
      if (latestWorkout.weight && latestWorkout.reps && latestWorkout.reps < 37) {
        estimated1RM = latestWorkout.weight * (36 / (37 - latestWorkout.reps));
      }

      // Determine progress trend
      let progressTrend = 'stalled';
      if (volumeChange > 5) {
        progressTrend = 'accelerating';
      } else if (volumeChange > 0) {
        progressTrend = 'steady';
      }

      return {
        // Use name or exerciseName property (handle both cases)
        name: exercise.name || exercise.exerciseName || 'Unknown Exercise',
        muscleGroups: exercise.muscleGroups || [],
        currentVolume: latestWorkout.volume || 0,
        volumeChange: parseFloat(volumeChange.toFixed(1)),
        totalVolumeGain: parseFloat(totalVolumeGain.toFixed(1)),
        weekCount: filteredHistory.length,
        avgWeeklyGain: parseFloat(avgWeeklyGain.toFixed(1)),
        history: filteredHistory,
        latestWorkout: {
          ...latestWorkout,
          weight: latestWorkout.weight || 0,
          reps: latestWorkout.reps || 0,
          volume: latestWorkout.volume || 0,
        },
        estimated1RM: estimated1RM ? Math.round(estimated1RM) : null,
        progressTrend,
      };
    }).filter(Boolean); // Remove null entries
  }, [exerciseData, timeRange]);

  
  // Generate progressive overload suggestions based on real data
  const generateSuggestions = useMemo(() => {
    const newSuggestions = [];

    performanceMetrics.forEach(metric => {
      if (!metric || metric.history.length < 2) return;

      const latest = metric.latestWorkout;
      const previous = metric.history[metric.history.length - 2];

      // Check if progress has stalled
      if (metric.volumeChange < 2) {
        newSuggestions.push({
          exercise: metric.name,
          currentVolume: metric.currentVolume,
          suggestedVolume: Math.round(metric.currentVolume * 1.05), // 5% increase
          reason: 'Progress has stalled. Try changing up your routine.',
          adjustmentType: 'modify',
          recommendations: [
            { type: 'weight', value: Math.round(latest.weight * 1.05), change: '+5% weight' },
            { type: 'reps', value: latest.reps + 1, change: '+1 rep' },
            { type: 'technique', value: 'Consider changing grip or tempo' },
          ],
        });
      }
      // Check if consistent progress (5-10% weekly gain)
      else if (metric.volumeChange > 5 && metric.volumeChange < 15) {
        newSuggestions.push({
          exercise: metric.name,
          currentVolume: metric.currentVolume,
          suggestedVolume: Math.round(metric.currentVolume * 1.075), // 7.5% increase
          reason: 'Consistent progress! Keep up the good work with a moderate increase.',
          adjustmentType: 'increase',
          recommendations: [
            { type: 'weight', value: Math.round(latest.weight * 1.05), change: '+5% weight' },
            { type: 'sets', value: latest.sets + 1, change: '+1 set' },
          ],
        });
      }
      // Aggressive progress
      else if (metric.volumeChange >= 15) {
        newSuggestions.push({
          exercise: metric.name,
          currentVolume: metric.currentVolume,
          suggestedVolume: Math.round(metric.currentVolume * 1.1), // 10% increase
          reason: 'Excellent progress! You can handle a bigger increase this week.',
          adjustmentType: 'aggressive',
          recommendations: [
            { type: 'weight', value: Math.round(latest.weight * 1.1), change: '+10% weight' },
            { type: 'reps', value: latest.reps + 2, change: '+2 reps' },
          ],
        });
      }
    });

    return newSuggestions;
  }, [performanceMetrics]);

  // Use provided suggestions or generated ones
  const activeSuggestions = suggestions.length > 0 ? suggestions : generateSuggestions;

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalVolume = performanceMetrics.reduce((sum, m) => sum + m.currentVolume, 0);
    const avgGain = performanceMetrics.reduce((sum, m) => sum + m.avgWeeklyGain, 0) / performanceMetrics.length;
    const improvingExercises = performanceMetrics.filter(m => m.volumeChange > 0).length;
    const stalledExercises = performanceMetrics.filter(m => m.volumeChange <= 0).length;

    return {
      totalVolume,
      avgGain: avgGain || 0,
      improvingExercises,
      stalledExercises,
      totalExercises: performanceMetrics.length,
    };
  }, [performanceMetrics]);

  const handleAcceptSuggestion = (suggestion) => {
    onAdjust && onAdjust({ action: 'accept', suggestion });
    toast.success(`Applied suggestion for ${suggestion.exercise}`);
  };

  const handleRejectSuggestion = (suggestion) => {
    onAdjust && onAdjust({ action: 'reject', suggestion });
    toast('Suggestion dismissed', { icon: '👋' });
  };

  const getAdjustmentColor = (type) => {
    switch (type) {
      case 'increase':
        return 'from-green-500 to-emerald-500';
      case 'aggressive':
        return 'from-purple-500 to-pink-500';
      case 'modify':
        return 'from-yellow-500 to-orange-500';
      case 'maintain':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getAdjustmentIcon = (type) => {
    switch (type) {
      case 'increase':
      case 'aggressive':
        return <TrendingUp className="w-6 h-6" />;
      case 'modify':
        return <Activity className="w-6 h-6" />;
      case 'maintain':
        return <Target className="w-6 h-6" />;
      default:
        return <Dumbbell className="w-6 h-6" />;
    }
  };

  const getProgressColor = (trend) => {
    switch (trend) {
      case 'accelerating':
        return 'text-green-600';
      case 'steady':
        return 'text-blue-600';
      case 'stalled':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Progressive Overload Tracker</h2>
            <p className="text-gray-600 text-sm mt-1">
              Track your strength gains and get personalized progression suggestions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('4weeks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === '4weeks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              4 Weeks
            </button>
            <button
              onClick={() => setTimeRange('8weeks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === '8weeks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              8 Weeks
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Experience Level Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
          <Award className="w-4 h-4" />
          {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} Level
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Total Volume</h3>
            <BarChart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {overallStats.totalVolume.toLocaleString()} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">Across {overallStats.totalExercises} exercises</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Avg Weekly Gain</h3>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <p className={`text-2xl font-bold ${overallStats.avgGain > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
            {overallStats.avgGain > 0 ? '+' : ''}{overallStats.avgGain.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Per exercise average</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Improving</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{overallStats.improvingExercises}</p>
          <p className="text-xs text-gray-500 mt-1">Exercises with positive trend</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Stalled</h3>
            <Activity className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{overallStats.stalledExercises}</p>
          <p className="text-xs text-gray-500 mt-1">Need adjustment</p>
        </div>
      </div>

      {/* Suggestions Section */}
      {activeSuggestions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Recommended Adjustments</h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Based on your recent performance, here are personalized suggestions
          </p>

          <div className="space-y-4">
            {activeSuggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {suggestion.exercise}
                    </h3>
                    <p className="text-sm text-gray-600">{suggestion.reason}</p>
                  </div>
                  <div
                    className={`bg-gradient-to-r ${getAdjustmentColor(
                      suggestion.adjustmentType
                    )} text-white p-3 rounded-lg`}
                  >
                    {getAdjustmentIcon(suggestion.adjustmentType)}
                  </div>
                </div>

                {/* Volume Change */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Current Volume</p>
                    <p className="text-xl font-bold text-gray-800">
                      {suggestion.currentVolume} kg
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-r ${getAdjustmentColor(
                      suggestion.adjustmentType
                    )} bg-opacity-10 rounded-lg p-3`}
                  >
                    <p className="text-xs text-gray-600 mb-1">Suggested Volume</p>
                    <p className="text-xl font-bold text-gray-800">
                      {suggestion.suggestedVolume} kg
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      +
                      {(
                        ((suggestion.suggestedVolume - suggestion.currentVolume) /
                          suggestion.currentVolume) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Recommended Adjustments
                  </p>
                  <ul className="space-y-1">
                    {suggestion.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="text-sm text-gray-700">
                        <span className="font-medium capitalize">{rec.type}:</span>{' '}
                        {rec.type === 'weight' || rec.type === 'reps' || rec.type === 'sets'
                          ? `${rec.value} (${rec.change})`
                          : rec.value}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Apply This Week
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(suggestion)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Skip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Performance History */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Exercise Progress</h2>
        </div>

        <div className="space-y-4">
          {performanceMetrics.length > 0 ? (
            performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {metric.muscleGroups?.map((group, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${metric.volumeChange > 0
                          ? 'bg-green-100 text-green-700'
                          : metric.volumeChange < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {metric.volumeChange > 0 ? '+' : ''}
                      {metric.volumeChange.toFixed(1)}%
                    </span>
                    {expandedExercise === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current</p>
                    <p className="font-bold text-gray-800">{metric.currentVolume} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">1RM Est.</p>
                    <p className="font-bold text-purple-600">
                      {metric.estimated1RM ? Math.round(metric.estimated1RM) : '-'} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Gain</p>
                    <p className={`font-bold ${metric.totalVolumeGain > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.totalVolumeGain > 0 ? '+' : ''}{metric.totalVolumeGain.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trend</p>
                    <p className={`font-bold capitalize ${getProgressColor(metric.progressTrend)}`}>
                      {metric.progressTrend}
                    </p>
                  </div>
                </div>

                {/* Mini Volume Chart */}
                <div className="mt-3 flex items-end gap-1 h-12">
                  {metric.history.slice(-8).map((workout, idx) => {
                    const maxVolume = Math.max(...metric.history.map((w) => w.volume));
                    const height = (workout.volume / maxVolume) * 100;
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t relative group"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      >
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {new Date(workout.date).toLocaleDateString()}: {workout.volume}kg
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Details */}
                {expandedExercise === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-700 mb-2">Detailed History</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {metric.history.slice().reverse().map((workout, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                          <span className="font-medium">{workout.sets} × {workout.reps} × {workout.weight}kg</span>
                          <span className="text-gray-600">{workout.volume}kg volume</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No workout data yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start logging your workouts to see progressive overload insights
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Progressive Overload Explained</h4>
            <p className="text-sm text-blue-800">
              Progressive overload means gradually increasing the stress on your muscles. This can be
              achieved by increasing weight, reps, sets, or reducing rest time. Our suggestions are
              based on your actual performance data and follow safe progression rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data as fallback
const mockWorkoutData = [
  {
    exerciseName: 'Barbell Bench Press',
    history: [
      { date: '2024-01-01', volume: 1200, sets: 4, reps: 10, weight: 30 },
      { date: '2024-01-08', volume: 1280, sets: 4, reps: 10, weight: 32 },
      { date: '2024-01-15', volume: 1350, sets: 4, reps: 10, weight: 33.75 },
      { date: '2024-01-22', volume: 1400, sets: 4, reps: 10, weight: 35 },
    ],
    muscleGroups: ['chest'],
  },
  {
    exerciseName: 'Barbell Squats',
    history: [
      { date: '2024-01-02', volume: 2000, sets: 5, reps: 8, weight: 50 },
      { date: '2024-01-09', volume: 2120, sets: 5, reps: 8, weight: 53 },
      { date: '2024-01-16', volume: 2200, sets: 5, reps: 8, weight: 55 },
      { date: '2024-01-23', volume: 2300, sets: 5, reps: 8, weight: 57.5 },
    ],
    muscleGroups: ['legs'],
  },
  {
    exerciseName: 'Pull-Ups',
    history: [
      { date: '2024-01-03', volume: 600, sets: 4, reps: 8, weight: 0 },
      { date: '2024-01-10', volume: 720, sets: 4, reps: 9, weight: 0 },
      { date: '2024-01-17', volume: 800, sets: 4, reps: 10, weight: 0 },
      { date: '2024-01-24', volume: 840, sets: 4, reps: 10, weight: 2.5 },
    ],
    muscleGroups: ['back'],
  },
];

export default ProgressOverload;