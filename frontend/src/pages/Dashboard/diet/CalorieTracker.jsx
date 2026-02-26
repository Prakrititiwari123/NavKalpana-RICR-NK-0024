import React, { useMemo, useState, useEffect } from 'react';
import { Droplet, Flame, PieChart, Plus, Utensils, Clock, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { createNutritionLog } from '../../../services/profileService';
import toast from 'react-hot-toast';

const CalorieTracker = ({ logs = [], target = {}, onLog, dailyTotals: externalTotals }) => {
  const { user } = useAuth();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [water, setWater] = useState(0);
  const [newMeal, setNewMeal] = useState({
    mealType: 'Breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    foodItems: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};

  // Extract targets with defaults from user data
  const calorieTarget = target.calories || userGoals.calorieTarget || 2200;
  const proteinTarget = target.protein || Math.round(calorieTarget * 0.3 / 4) || 165;
  const carbsTarget = target.carbs || Math.round(calorieTarget * 0.45 / 4) || 247;
  const fatTarget = target.fat || Math.round(calorieTarget * 0.25 / 9) || 61;

  // Filter logs for selected date
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === selectedDate;
    });
  }, [logs, selectedDate]);

  // Calculate totals for selected date
  const totals = useMemo(() => {
    const totalsData = filteredLogs.reduce(
      (acc, entry) => {
        acc.calories += entry.calories || 0;
        acc.protein += entry.macros?.protein || 0;
        acc.carbs += entry.macros?.carbs || 0;
        acc.fats += entry.macros?.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return totalsData;
  }, [filteredLogs]);

  // Use external totals if provided (from parent)
  const displayTotals = externalTotals || totals;

  const remaining = Math.max(calorieTarget - displayTotals.calories, 0);
  const caloriePercent = Math.min(Math.round((displayTotals.calories / calorieTarget) * 100), 100);

  // Load water intake from localStorage (could be from backend)
  useEffect(() => {
    const savedWater = localStorage.getItem(`water_${selectedDate}`);
    if (savedWater) {
      setWater(parseInt(savedWater));
    } else {
      setWater(0);
    }
  }, [selectedDate]);

  const logWater = () => {
    const nextWater = Math.min(water + 1, 10);
    setWater(nextWater);
    localStorage.setItem(`water_${selectedDate}`, nextWater.toString());
    
    toast.success(`Water intake updated: ${nextWater}/10 glasses`);
  };

  const resetWater = () => {
    setWater(0);
    localStorage.removeItem(`water_${selectedDate}`);
    toast.success('Water intake reset');
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    
    if (!newMeal.calories) {
      toast.error('Please enter calories for this meal');
      return;
    }

    try {
      const mealData = {
        date: new Date(newMeal.date),
        mealType: newMeal.mealType,
        calories: parseInt(newMeal.calories),
        macros: {
          protein: parseInt(newMeal.protein) || 0,
          carbs: parseInt(newMeal.carbs) || 0,
          fats: parseInt(newMeal.fats) || 0,
        },
        foodItems: newMeal.foodItems ? newMeal.foodItems.split(',').map(item => item.trim()) : [],
        notes: newMeal.notes || '',
      };

      // Call parent onLog function
      if (onLog) {
        await onLog(mealData);
      }

      // Reset form
      setNewMeal({
        mealType: 'Breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        foodItems: '',
        notes: '',
        date: selectedDate,
      });
      
      setShowAddMeal(false);
      toast.success('Meal logged successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to log meal');
    }
  };

  const macroRing = (label, current, target, color) => {
    const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
    
    return (
      <div className="text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center relative"
          style={{
            background: `conic-gradient(${color} ${percentage}%, #e5e7eb 0)`
          }}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">{percentage}%</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{label}</p>
        <p className="text-sm font-semibold text-gray-700">
          {current}g / {target}g
        </p>
      </div>
    );
  };

  const mealTypeColors = {
    Breakfast: 'bg-orange-100 text-orange-700',
    Lunch: 'bg-blue-100 text-blue-700',
    Dinner: 'bg-purple-100 text-purple-700',
    Snack: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Select Date</h3>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-800">
            Daily Calories - {new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Consumed</p>
            <p className="text-2xl font-bold text-emerald-700">{displayTotals.calories} kcal</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-blue-700">{remaining} kcal</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Target</p>
            <p className="text-2xl font-bold text-amber-700">{calorieTarget} kcal</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{caloriePercent}% of daily target</p>
        </div>
      </div>

      {/* Macro Balance */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Macro Balance</h3>
        </div>
        
        <div className="mt-5 grid grid-cols-3 gap-4">
          {macroRing('Protein', displayTotals.protein, proteinTarget, '#10b981')}
          {macroRing('Carbs', displayTotals.carbs, carbsTarget, '#3b82f6')}
          {macroRing('Fats', displayTotals.fats, fatTarget, '#f59e0b')}
        </div>

        {/* Macro Insights */}
        {displayTotals.protein < proteinTarget * 0.7 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-2 text-sm text-yellow-700">
            <AlertCircle className="w-4 h-4" />
            <span>You're low on protein today. Try to add more protein-rich foods.</span>
          </div>
        )}
      </div>

      {/* Water Tracking */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">Water Intake</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetWater}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
            >
              Reset
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              onClick={logWater}
            >
              + Add Glass
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-8 h-12 rounded-md transition-colors ${
                index < water ? 'bg-blue-500' : 'bg-blue-100'
              }`}
            />
          ))}
          <span className="text-sm font-medium text-gray-600 ml-2">{water}/10 glasses</span>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Recommended: 8-10 glasses per day for optimal hydration
        </p>
      </div>

      {/* Add Meal Button */}
      {!showAddMeal && (
        <button
          onClick={() => setShowAddMeal(true)}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Meal for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </button>
      )}

      {/* Add Meal Form */}
      {showAddMeal && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Add Meal</h3>
            <button
              onClick={() => setShowAddMeal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleAddMeal} className="space-y-4">
            {/* Meal Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
              <select
                value={newMeal.mealType}
                onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            {/* Calories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Calories *</label>
              <input
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                placeholder="e.g., 500"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  placeholder="25"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  placeholder="50"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fats (g)</label>
                <input
                  type="number"
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                  placeholder="15"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Food Items */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Items <span className="text-xs text-gray-500">(comma separated)</span>
              </label>
              <input
                type="text"
                value={newMeal.foodItems}
                onChange={(e) => setNewMeal({ ...newMeal, foodItems: e.target.value })}
                placeholder="e.g., Chicken breast, Brown rice, Broccoli"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={newMeal.notes}
                onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                placeholder="Any additional notes about this meal"
                rows="2"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save Meal
              </button>
              <button
                type="button"
                onClick={() => setShowAddMeal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Today's Meals List */}
      {filteredLogs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Meals</h3>
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mealTypeColors[log.mealType] || 'bg-gray-100 text-gray-700'}`}>
                        {log.mealType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{log.calories} kcal</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-600">
                      <span>P: {log.macros?.protein || 0}g</span>
                      <span>C: {log.macros?.carbs || 0}g</span>
                      <span>F: {log.macros?.fats || 0}g</span>
                    </div>
                    {log.foodItems && log.foodItems.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {log.foodItems.join(' • ')}
                      </p>
                    )}
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieTracker;