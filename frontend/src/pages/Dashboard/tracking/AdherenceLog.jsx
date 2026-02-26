import React, { useState, useMemo, useEffect } from 'react';
import { CheckSquare, Calendar, Flame, Heart, Award, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import toast from 'react-hot-toast';

const AdherenceLog = ({ logs = [], onSubmit, date = new Date() }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Get user data from auth context
  const userGoals = user?.healthData?.goals || {};
  const userProfile = user?.healthData?.profile || {};
  const userVitals = user?.healthData?.vitals || {};

  const [todayLog, setTodayLog] = useState({
    workoutCompleted: false,
    dietFollowed: false,
    waterIntake: false,
    sleepQuality: 0,
    mood: 3,
    energy: 3,
    notes: '',
  });

  const todayString = useMemo(() => {
    return new Date(date).toISOString().split('T')[0];
  }, [date]);

  const existingLog = useMemo(() => {
    if (!logs || logs.length === 0) return null;
    return logs.find((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === todayString;
    });
  }, [logs, todayString]);

  // Calculate current streak based on real logs
  const currentStreak = useMemo(() => {
    if (!logs || logs.length === 0) return 0;
    
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const log = sortedLogs[i];
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        // Consider a successful day if workout and diet are completed
        if (log.workoutCompleted && log.dietFollowed) {
          streak++;
        } else {
          break;
        }
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  }, [logs]);

  // Calculate weekly stats based on real logs
  const weeklyStats = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        workouts: 0,
        diet: 0,
        water: 0,
        avgSleep: 0,
        avgMood: 0,
        avgEnergy: 0,
        total: 0,
      };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    
    const weekLogs = logs.filter((log) => new Date(log.date) >= oneWeekAgo);
    
    const workouts = weekLogs.filter((log) => log.workoutCompleted).length;
    const diet = weekLogs.filter((log) => log.dietFollowed).length;
    const water = weekLogs.filter((log) => log.waterIntake).length;
    
    const avgSleep = weekLogs.reduce((sum, log) => sum + (log.sleepQuality || 0), 0) / (weekLogs.length || 1);
    const avgMood = weekLogs.reduce((sum, log) => sum + (log.mood || 3), 0) / (weekLogs.length || 1);
    const avgEnergy = weekLogs.reduce((sum, log) => sum + (log.energy || 3), 0) / (weekLogs.length || 1);
    
    return {
      workouts,
      diet,
      water,
      avgSleep: avgSleep.toFixed(1),
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      total: weekLogs.length,
    };
  }, [logs]);

  // Calculate adherence score (0-100)
  const adherenceScore = useMemo(() => {
    if (!logs || logs.length === 0) return 0;
    
    const last30Days = logs.filter(log => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(log.date) >= thirtyDaysAgo;
    });
    
    if (last30Days.length === 0) return 0;
    
    const totalScore = last30Days.reduce((sum, log) => {
      let dayScore = 0;
      if (log.workoutCompleted) dayScore += 40;
      if (log.dietFollowed) dayScore += 30;
      if (log.waterIntake) dayScore += 15;
      dayScore += (log.sleepQuality || 0) * 3; // Max 15 points
      return sum + dayScore;
    }, 0);
    
    return Math.min(Math.round(totalScore / last30Days.length), 100);
  }, [logs]);

  // Load existing log if available
  useEffect(() => {
    if (existingLog) {
      setTodayLog({
        workoutCompleted: existingLog.workoutCompleted || false,
        dietFollowed: existingLog.dietFollowed || false,
        waterIntake: existingLog.waterIntake || false,
        sleepQuality: existingLog.sleepQuality || 0,
        mood: existingLog.mood || 3,
        energy: existingLog.energy || 3,
        notes: existingLog.notes || '',
      });
    }
  }, [existingLog]);

  const handleCheckboxChange = (field) => {
    setTodayLog((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRatingChange = (field, rating) => {
    setTodayLog((prev) => ({ ...prev, [field]: rating }));
  };

  const handleNotesChange = (e) => {
    setTodayLog((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const adherenceData = {
        ...todayLog,
        date: new Date(date),
        adherenceScore: calculateDailyScore(todayLog)
      };
      
      await onSubmit(adherenceData);
      
      // Reset form only if it's a new entry (not editing)
      if (!existingLog) {
        setTodayLog({
          workoutCompleted: false,
          dietFollowed: false,
          waterIntake: false,
          sleepQuality: 0,
          mood: 3,
          energy: 3,
          notes: '',
        });
      }
      
      toast.success(existingLog ? 'Log updated successfully!' : 'Log saved successfully!');
    } catch (error) {
      toast.error('Failed to save log');
    } finally {
      setSaving(false);
    }
  };

  const calculateDailyScore = (log) => {
    let score = 0;
    if (log.workoutCompleted) score += 40;
    if (log.dietFollowed) score += 30;
    if (log.waterIntake) score += 15;
    score += (log.sleepQuality || 0) * 3;
    return Math.min(score, 100);
  };

  const isLoggedToday = !!existingLog;

  // Get motivational message based on streak and adherence
  const getMotivationalMessage = () => {
    if (adherenceScore >= 90) {
      return "Outstanding! You're crushing your goals! 💪";
    } else if (adherenceScore >= 75) {
      return "Great job! Consistency is building momentum! 🔥";
    } else if (adherenceScore >= 50) {
      return "Good progress! Keep pushing forward! ⚡";
    } else if (currentStreak > 0) {
      return `You're on a ${currentStreak}-day streak! Keep it going! 🌟`;
    } else {
      return "Start your streak today! Small steps lead to big changes. 🎯";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Streak and Score */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-1">Daily Check-In</h2>
            <p className="text-purple-100">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {userGoals?.primaryGoal && (
              <p className="text-sm text-purple-200 mt-2 capitalize">
                Goal: {userGoals.primaryGoal.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <p className="text-4xl font-bold">{currentStreak}</p>
                <p className="text-sm text-purple-100">Day Streak</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <p className="text-4xl font-bold">{adherenceScore}</p>
                <p className="text-sm text-purple-100">Adherence %</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Log */}
      {isLoggedToday ? (
        <div className="bg-green-50 rounded-2xl border-2 border-green-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">Today's Log Complete!</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Workout: {existingLog.workoutCompleted ? 'Completed' : 'Skipped'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Diet: {existingLog.dietFollowed ? 'Followed' : 'Not Followed'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Water: {existingLog.waterIntake ? 'Met Goal' : 'Below Goal'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Sleep: {existingLog.sleepQuality}/5
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Mood: {existingLog.mood}/5
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">
                  Energy: {existingLog.energy}/5
                </span>
              </div>
            </div>
          </div>
          {existingLog.notes && (
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
              <p className="text-gray-600">{existingLog.notes}</p>
            </div>
          )}
          <button
            onClick={() => setTodayLog(existingLog)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Today's Log
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Log Today's Adherence</h3>
          
          {/* Checklist */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.workoutCompleted}
                onChange={() => handleCheckboxChange('workoutCompleted')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Workout Completed</p>
                <p className="text-sm text-gray-600">Did you complete your workout today?</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.dietFollowed}
                onChange={() => handleCheckboxChange('dietFollowed')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Diet Followed</p>
                <p className="text-sm text-gray-600">Did you stick to your meal plan?</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.waterIntake}
                onChange={() => handleCheckboxChange('waterIntake')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Water Intake Goal</p>
                <p className="text-sm text-gray-600">Did you meet your water intake goal?</p>
              </div>
            </label>
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Sleep Quality */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Sleep Quality</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={`sleep-${rating}`}
                    onClick={() => handleRatingChange('sleepQuality', rating)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      todayLog.sleepQuality >= rating
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Mood</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={`mood-${rating}`}
                    onClick={() => handleRatingChange('mood', rating)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      todayLog.mood >= rating
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Energy Level</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={`energy-${rating}`}
                    onClick={() => handleRatingChange('energy', rating)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      todayLog.energy >= rating
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4 text-center">
            1 = Poor, 3 = Average, 5 = Excellent
          </p>

          {/* Notes */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-3">
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Notes (Optional)
            </label>
            <textarea
              value={todayLog.notes}
              onChange={handleNotesChange}
              placeholder="How did you feel today? Any challenges or wins?"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (existingLog ? 'Update Log' : 'Save Todays Log')}
          </button>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Last 7 Days Summary</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-purple-600 text-sm font-semibold mb-1">Workouts</p>
            <p className="text-3xl font-bold text-gray-800">{weeklyStats.workouts}/7</p>
            <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.workouts / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-600 text-sm font-semibold mb-1">Diet</p>
            <p className="text-3xl font-bold text-gray-800">{weeklyStats.diet}/7</p>
            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.diet / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-600 text-sm font-semibold mb-1">Water</p>
            <p className="text-3xl font-bold text-gray-800">{weeklyStats.water}/7</p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.water / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-pink-50 rounded-xl p-4">
            <p className="text-pink-600 text-sm font-semibold mb-1">Avg Sleep</p>
            <p className="text-3xl font-bold text-gray-800">{weeklyStats.avgSleep}/5</p>
            <div className="mt-2 w-full bg-pink-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.avgSleep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Average Mood</p>
            <p className="text-lg font-bold text-gray-800">{weeklyStats.avgMood}/5</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Average Energy</p>
            <p className="text-lg font-bold text-gray-800">{weeklyStats.avgEnergy}/5</p>
          </div>
        </div>
      </div>

      {/* Motivation Card */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200 p-6">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 text-orange-600 shrink-0" />
          <div>
            <h4 className="font-bold text-orange-900 mb-2">Keep It Up!</h4>
            <p className="text-orange-800">
              {getMotivationalMessage()}
            </p>
            {userGoals?.timeline && (
              <p className="text-sm text-orange-700 mt-2">
                Target: {userGoals.timeline} month goal timeline
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceLog;
