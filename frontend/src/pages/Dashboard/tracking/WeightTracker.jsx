import React, { useState, useMemo } from 'react';
import { Scale, TrendingDown, TrendingUp, Trash2, Plus, Calendar, Activity, User, Target, Award } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const WeightTracker = ({ logs = [], goal: propGoal, onSubmit, onDelete }) => {
  const { user } = useAuth();
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all'); // 'week', 'month', 'all'

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};
  const userProfile = userHealthData.profile || {};

  // Set goal from props or user data
  const goal = toNumber(propGoal) ?? toNumber(userVitals?.goalWeight) ?? 75;

  // Get initial weight from user data if no logs
  const initialWeight = toNumber(userVitals?.currentWeight) ?? 0;

  // Sort logs by date (newest first)
  const sortedLogs = useMemo(() => {
    return (Array.isArray(logs) ? logs : [])
      .map((log, index) => {
        const date = toDate(log?.date);
        const weight = toNumber(log?.weight);
        if (!date || weight === null) return null;

        return {
          ...log,
          id: log?.id || log?._id || `${date.getTime()}-${index}`,
          date,
          weight,
          note: log?.note || '',
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [logs]);

  // Filter logs based on selected timeframe
  const filteredLogs = useMemo(() => {
    if (selectedTimeframe === 'all') return sortedLogs;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (selectedTimeframe === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (selectedTimeframe === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    return sortedLogs.filter(log => log.date >= cutoff);
  }, [sortedLogs, selectedTimeframe]);

  // Current and start weights
  const currentWeight = filteredLogs[0]?.weight || initialWeight || 0;
  const startWeight = filteredLogs[filteredLogs.length - 1]?.weight || currentWeight;
  
  // Calculate statistics
  const totalChange = filteredLogs.length < 2 ? 0 : (currentWeight - startWeight) || 0;
  const goalRemaining = currentWeight - goal;
  const progress = startWeight === goal
    ? 0
    : (() => {
        const totalToLose = startWeight - goal;
        const lostSoFar = startWeight - currentWeight;
        return totalToLose !== 0 ? (lostSoFar / totalToLose) * 100 : 0;
      })();

  // Calculate weekly average change
  let weeklyChange = 0;
  if (filteredLogs.length >= 2) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLogs = filteredLogs.filter(log => log.date >= oneWeekAgo);
    if (recentLogs.length >= 2) {
      const latest = recentLogs[0]?.weight || 0;
      const oldest = recentLogs[recentLogs.length - 1]?.weight || 0;
      weeklyChange = latest - oldest;
    }
  }

  // Calculate BMI
  const calculateBMI = () => {
    if (userVitals?.height && currentWeight) {
      const heightInMeters = userVitals.height / 100;
      const bmi = (currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  // Get BMI category
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi >= 18.5 && bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi >= 25 && bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  // Calculate recommended daily calories
  const calculateRecommendedCalories = () => {
    if (!userProfile?.age || !userProfile?.gender || !userVitals?.height || !currentWeight || !userProfile?.activityLevel) {
      return null;
    }

    let bmr;
    const age = parseInt(userProfile.age);
    const height = userVitals.height;
    const weight = currentWeight;

    if (userProfile.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };

    const multiplier = activityMultipliers[userProfile.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  // Find min and max for chart scaling
  const chartBounds = (() => {
    if (filteredLogs.length === 0) {
      return { min: goal - 5, max: goal + 5 };
    }
    const weights = filteredLogs.map(l => l.weight);
    const minWeight = Math.min(...weights, goal, initialWeight);
    const maxWeight = Math.max(...weights, goal, initialWeight);
    const padding = (maxWeight - minWeight) * 0.1 || 2;
    return {
      min: minWeight - padding,
      max: maxWeight + padding
    };
  })();

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
  const recommendedCalories = calculateRecommendedCalories();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (weight && parseFloat(weight) > 0) {
      onSubmit({ 
        weight: parseFloat(weight),
        note: note.trim() || undefined
      });
      setWeight('');
      setNote('');
      setShowForm(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* User Info Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Age / Gender</p>
              <p className="font-semibold text-gray-800">
                {userProfile?.age || '-'} / {userProfile?.gender || 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Scale className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-semibold text-gray-800">
                {userVitals?.height || '-'} cm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-semibold text-gray-800 capitalize">
                {userGoals?.primaryGoal || 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Award className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="font-semibold text-gray-800 capitalize">
                {userGoals?.experienceLevel || 'Beginner'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Weight</span>
            <Scale className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {currentWeight ? currentWeight.toFixed(1) : '--'} kg
          </p>
          {bmi && (
            <p className={`text-xs font-medium mt-1 ${bmiCategory?.color}`}>
              BMI: {bmi} ({bmiCategory?.label})
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Goal Weight</span>
            <Scale className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{goal} kg</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.abs(goalRemaining).toFixed(1)} kg {goalRemaining > 0 ? 'to lose' : 'to gain'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Change</span>
            {totalChange < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : totalChange > 0 ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <Scale className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className={`text-3xl font-bold ${totalChange < 0 ? 'text-green-600' : totalChange > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {totalChange !== 0 ? (totalChange > 0 ? '+' : '') + totalChange.toFixed(1) : '0'} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            from {startWeight.toFixed(1)} kg
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Weekly Change</span>
            {weeklyChange < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : weeklyChange > 0 ? (
              <TrendingUp className="w-5 h-5 text-orange-600" />
            ) : (
              <Scale className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className={`text-3xl font-bold ${weeklyChange < 0 ? 'text-green-600' : weeklyChange > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
            {weeklyChange !== 0 ? (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(1) : '0'} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">last 7 days</p>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Goal Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Start: {startWeight.toFixed(1)} kg</span>
            <span>Current: {currentWeight.toFixed(1)} kg</span>
            <span>Goal: {goal} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 relative"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress: {Math.min(Math.max(progress, 0), 100).toFixed(0)}%</span>
            <span className="text-gray-500">
              {Math.abs(goalRemaining).toFixed(1)} kg {goalRemaining > 0 ? 'to lose' : 'to gain'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Calories */}
      {recommendedCalories && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Recommended Daily Calories</h3>
          <p className="text-3xl font-bold text-purple-600">{recommendedCalories} kcal</p>
          <p className="text-sm text-gray-600 mt-2">
            Based on your {userProfile?.activityLevel?.replace(/([A-Z])/g, ' $1').trim() || 'moderate'} activity level
          </p>
        </div>
      )}

      {/* Timeframe Selector */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setSelectedTimeframe('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedTimeframe === 'week'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedTimeframe === 'month'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedTimeframe === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Visual Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weight Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {filteredLogs.length > 0 ? (
            filteredLogs.slice(0, 20).reverse().map((log, index) => {
              const height = ((log.weight - chartBounds.min) / (chartBounds.max - chartBounds.min)) * 100;
              return (
                <div key={log.id || index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-purple-100 rounded-t-lg relative">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ height: `${Math.max(height * 2, 4)}px` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {log.weight.toFixed(1)} kg
                      {log.note && ` - ${log.note}`}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                    {formatDate(log.date)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-400">No weight entries in this period</p>
            </div>
          )}
        </div>
        
        {/* Goal line indicator */}
        <div className="relative mt-2">
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-green-400" 
               style={{ bottom: `${((goal - chartBounds.min) / (chartBounds.max - chartBounds.min)) * 64}px` }}>
            <span className="absolute right-0 -top-4 text-xs text-green-600 bg-white px-1">Goal: {goal} kg</span>
          </div>
        </div>
      </div>

      {/* Add Weight Entry */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Log Weight</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Entry'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={currentWeight ? currentWeight.toFixed(1) : "75.5"}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Morning weight, After workout"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Weight History</h3>
          <span className="text-sm text-gray-500">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Weight</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Note</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {
                  const prevWeight = filteredLogs[index + 1]?.weight;
                  const change = prevWeight ? log.weight - prevWeight : 0;
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(log.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{log.weight.toFixed(1)} kg</span>
                      </td>
                      <td className="py-3 px-4">
                        {prevWeight ? (
                          <div className="flex items-center gap-1">
                            {change < 0 ? (
                              <TrendingDown className="w-4 h-4 text-green-600" />
                            ) : change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-red-600" />
                            ) : null}
                            <span className={`font-semibold ${change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{log.note || '-'}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDelete(log.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No weight entries in this period</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Add your first entry {'->'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WeightTracker;
