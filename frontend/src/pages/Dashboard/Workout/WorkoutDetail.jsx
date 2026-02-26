import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Info,
  Video,
  Clock,
  Dumbbell,
  Target,
  Weight,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import WorkoutLogger from './WorkoutLogger';
import { useAuth } from '../../../context/AuthContext';
import { createWorkout } from '../../../services/profileService';
import toast from 'react-hot-toast';

const WorkoutDetail = ({ exercise, dayData, onComplete, onClose }) => {
  const { user } = useAuth();
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [logData, setLogData] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState(exercise.weight || 0);
  const [reps, setReps] = useState(parseInt(exercise.reps) || 10);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user data for context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setShowTimer(true);
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleLogWorkout = () => {
    setShowLogger(true);
    setShowForm(true);
  };

  const handleCompleteSet = () => {
    const newSet = {
      setNumber: currentSet,
      weight: weight,
      reps: reps,
      completedAt: new Date().toISOString(),
    };
    
    setCompletedSets([...completedSets, newSet]);
    
    if (currentSet < (exercise.sets || 4)) {
      setCurrentSet(currentSet + 1);
      // Auto-start rest timer
      setTime(0);
      setIsRunning(true);
      setShowTimer(true);
    } else {
      // All sets completed
      handleSubmitLog();
    }
  };

  const handleSubmitLog = async () => {
    setIsSubmitting(true);
    try {
      const workoutData = {
        date: new Date(),
        workoutType: dayData?.focus || exercise.muscleGroup || 'Strength',
        duration: time,
        caloriesBurned: Math.round(time * 0.17 * (userVitals.currentWeight || 70)), // Rough estimate
        exercises: [
          {
            name: exercise.name,
            sets: completedSets.length || exercise.sets,
            reps: reps,
            weight: weight,
            notes: notes,
            muscleGroup: exercise.muscleGroup,
            equipment: exercise.equipment,
          }
        ],
        intensity: calculateIntensity(),
        notes: notes,
      };

      const savedWorkout = await createWorkout(workoutData);
      
      setLogData(savedWorkout);
      setShowLogger(false);
      setShowForm(false);
      
      if (onComplete) {
        onComplete(savedWorkout);
      }
      
      toast.success('Workout logged successfully! 💪');
    } catch (error) {
      toast.error('Failed to log workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateIntensity = () => {
    // Simple intensity calculation based on RPE
    const percentageOfMax = weight / (exercise.estimated1RM || weight * 1.2);
    if (percentageOfMax > 0.85) return 5; // Very Heavy
    if (percentageOfMax > 0.75) return 4; // Heavy
    if (percentageOfMax > 0.6) return 3; // Moderate
    if (percentageOfMax > 0.4) return 2; // Light
    return 1; // Very Light
  };

  const handleCancelLog = () => {
    setShowLogger(false);
    setShowForm(false);
    setCompletedSets([]);
    setCurrentSet(1);
  };

  // Get video URL based on exercise
  const getVideoUrl = () => {
    // This would come from your exercise database
    const videoMap = {
      'Barbell Bench Press': 'https://www.youtube.com/watch?v=4Y2ZdHCOXok',
      'Barbell Squats': 'https://www.youtube.com/watch?v=ultWZbUMPL8',
      'Pull-Ups': 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    };
    return videoMap[exercise.name] || '#';
  };

  const openVideo = () => {
    const url = getVideoUrl();
    if (url !== '#') {
      window.open(url, '_blank');
    } else {
      toast.error('Video not available for this exercise');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{exercise.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dayData?.day || 'Today'} · {dayData?.focus || exercise.muscleGroup || 'Strength Training'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exercise Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Sets</p>
              <p className="text-2xl font-bold text-blue-600">
                {showForm ? currentSet : exercise.sets}/{exercise.sets}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Reps</p>
              <p className="text-2xl font-bold text-purple-600">{exercise.reps}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Rest</p>
              <p className="text-2xl font-bold text-green-600">{exercise.rest}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Equipment</p>
              <p className="text-sm font-bold text-orange-600 capitalize">{exercise.equipment}</p>
            </div>
          </div>

          {/* Video Demonstration */}
          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative group">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Exercise demonstration video</p>
              <button 
                onClick={openVideo}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4" />
                Watch Tutorial
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Form Guidance</h3>
                <p className="text-sm text-gray-700">{exercise.notes || 'Maintain proper form throughout the movement. Keep core engaged and control the weight.'}</p>
              </div>
            </div>
          </div>

          {/* Active Workout Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-blue-200 rounded-xl p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                Set {currentSet} of {exercise.sets}
              </h3>

              <div className="space-y-4">
                {/* Weight Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter weight used"
                  />
                </div>

                {/* Reps Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Reps Completed
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter reps completed"
                  />
                </div>

                {/* Notes Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="How did this set feel?"
                  />
                </div>

                {/* Set Completion Progress */}
                {completedSets.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-700 mb-2">Completed Sets:</p>
                    <div className="flex gap-2">
                      {completedSets.map((set, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold"
                        >
                          {set.setNumber}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCompleteSet}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Check className="w-5 h-5" />
                    {currentSet === exercise.sets ? 'Complete Exercise' : 'Complete Set'}
                  </button>
                  <button
                    onClick={handleCancelLog}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timer/Stopwatch */}
          {showTimer && !showForm && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Rest Timer
                </h3>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">{formatTime(time)}</div>
                <div className="flex items-center justify-center gap-3">
                  {!isRunning ? (
                    <button
                      onClick={() => setIsRunning(true)}
                      className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseTimer}
                      className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  )}
                  <button
                    onClick={handleResetTimer}
                    className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Workout Button */}
          {!showForm && !showTimer && (
            <button
              onClick={handleLogWorkout}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Dumbbell className="w-5 h-5" />
              Start Workout
            </button>
          )}

          {/* Workout Logger (Alternative UI) */}
          {showLogger && !showForm && (
            <WorkoutLogger
              exercise={exercise}
              onSubmit={handleSubmitLog}
              initialData={logData}
              onCancel={handleCancelLog}
            />
          )}

          {/* Complete Button */}
          {logData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-2 border-green-500 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Workout Logged!</p>
                    <p className="text-sm text-gray-600">Great job! Keep up the progress 💪</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}

          {/* Safety Tips */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Safety Tips</h4>
                <ul className="text-sm text-yellow-700 list-disc list-inside">
                  <li>Warm up properly before starting</li>
                  <li>Use proper form to prevent injury</li>
                  <li>Don't sacrifice form for heavier weight</li>
                  <li>Listen to your body and rest when needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutDetail;