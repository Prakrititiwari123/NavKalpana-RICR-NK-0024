import React, { useMemo, useState, useEffect } from 'react';
import { Calculator, SlidersHorizontal, Target, Activity, User, Dumbbell } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import toast from 'react-hot-toast';

const MacroCalculator = ({ 
  weight: propWeight, 
  goal: propGoal, 
  calories: propCalories, 
  onCalculate,
  userProfile,
  initialTargets 
}) => {
  const { user } = useAuth();
  const [preset, setPreset] = useState('balanced');
  const [proteinPercent, setProteinPercent] = useState(30);
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};
  const userProfile_ = userHealthData.profile || {};

  // Use props or fallback to user data
  const weight = propWeight || userVitals.currentWeight || 70;
  const height = userVitals.height || 170;
  const age = userProfile_?.age || 30;
  const gender = userProfile_?.gender || 'male';
  const goal = propGoal || userGoals.primaryGoal || 'maintain';
  const activityLevel = userProfile_?.activityLevel || 'moderate';
  const calories = propCalories || userGoals.calorieTarget || calculateBMR();

  // Calculate BMR based on Mifflin-St Jeor Equation
  function calculateBMR() {
    if (!weight || !height || !age) return 2000;
    
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };
    
    const multiplier = multipliers[activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
  }

  // Preset ratios based on goal
  const presetRatios = useMemo(() => {
    switch(goal) {
      case 'lose':
        return {
          balanced: { protein: 35, carbs: 35, fats: 30 },
          'high-protein': { protein: 40, carbs: 30, fats: 30 },
          'low-carb': { protein: 40, carbs: 20, fats: 40 },
          'cut': { protein: 40, carbs: 30, fats: 30 },
        };
      case 'gain':
      case 'muscle':
        return {
          balanced: { protein: 30, carbs: 45, fats: 25 },
          'high-protein': { protein: 35, carbs: 40, fats: 25 },
          'low-carb': { protein: 35, carbs: 30, fats: 35 },
          'cut': { protein: 30, carbs: 45, fats: 25 },
        };
      default: // maintain
        return {
          balanced: { protein: 30, carbs: 40, fats: 30 },
          'high-protein': { protein: 35, carbs: 35, fats: 30 },
          'low-carb': { protein: 35, carbs: 25, fats: 40 },
          'cut': { protein: 35, carbs: 35, fats: 30 },
        };
    }
  }, [goal]);

  const ratios = useMemo(() => {
    return presetRatios[preset] || presetRatios.balanced;
  }, [preset, presetRatios]);

  const customRatios = useMemo(() => {
    const carbs = Math.max(100 - proteinPercent - 25, 20);
    const fats = 100 - proteinPercent - carbs;
    return { protein: proteinPercent, carbs, fats };
  }, [proteinPercent]);

  const calculateMacros = (ratio) => {
    const protein = Math.round((calories * (ratio.protein / 100)) / 4);
    const carbs = Math.round((calories * (ratio.carbs / 100)) / 4);
    const fats = Math.round((calories * (ratio.fats / 100)) / 9);
    return { 
      protein, 
      carbs, 
      fats, 
      calories,
      ratio,
      perKg: {
        protein: (protein / weight).toFixed(1),
        carbs: (carbs / weight).toFixed(1),
        fats: (fats / weight).toFixed(1),
      }
    };
  };

  const target = preset === 'custom' ? calculateMacros(customRatios) : calculateMacros(ratios);

  // Update protein percent when preset changes
  useEffect(() => {
    if (preset !== 'custom') {
      setProteinPercent(ratios.protein);
    }
  }, [preset, ratios]);

  const handleApply = () => {
    if (onCalculate) {
      onCalculate(target);
      toast.success('Macro targets updated successfully!');
    }
  };

  const getGoalColor = () => {
    switch(goal) {
      case 'lose': return 'text-orange-600';
      case 'gain': return 'text-green-600';
      case 'muscle': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-emerald-600" />
        <h3 className="text-xl font-bold text-gray-800">Macro Calculator</h3>
      </div>

      {/* User Info Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <User className="w-4 h-4 mx-auto text-gray-500 mb-1" />
          <p className="text-xs text-gray-500">Age/Gender</p>
          <p className="text-sm font-semibold text-gray-700">{age} / {gender}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <Activity className="w-4 h-4 mx-auto text-gray-500 mb-1" />
          <p className="text-xs text-gray-500">Weight</p>
          <p className="text-sm font-semibold text-gray-700">{weight} kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <Dumbbell className="w-4 h-4 mx-auto text-gray-500 mb-1" />
          <p className="text-xs text-gray-500">Activity</p>
          <p className="text-sm font-semibold text-gray-700 capitalize">{activityLevel}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <Target className="w-4 h-4 mx-auto text-gray-500 mb-1" />
          <p className="text-xs text-gray-500">Goal</p>
          <p className={`text-sm font-semibold capitalize ${getGoalColor()}`}>{goal}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Based on your profile · Target: <span className="font-bold text-emerald-600">{calories} kcal</span>
      </p>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {['balanced', 'high-protein', 'low-carb', 'cut', 'custom'].map((option) => (
          <button
            key={option}
            onClick={() => setPreset(option)}
            className={`px-3 py-2 rounded-lg text-xs md:text-sm font-semibold border transition-all ${
              preset === option
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {option.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Custom Slider */}
      {preset === 'custom' && (
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Custom Macro Split</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Protein</span>
                <span className="font-semibold text-emerald-600">{proteinPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="1"
                value={proteinPercent}
                onChange={(e) => setProteinPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div className="bg-white rounded p-2">
                <span className="block text-blue-600 font-semibold">Carbs</span>
                {customRatios.carbs}%
              </div>
              <div className="bg-white rounded p-2">
                <span className="block text-amber-600 font-semibold">Fats</span>
                {customRatios.fats}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Macro Results */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Protein</p>
          <p className="text-2xl font-bold text-emerald-700">{target.protein}g</p>
          <p className="text-xs text-gray-400 mt-1">{target.perKg.protein}g/kg</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Carbs</p>
          <p className="text-2xl font-bold text-blue-700">{target.carbs}g</p>
          <p className="text-xs text-gray-400 mt-1">{target.perKg.carbs}g/kg</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Fats</p>
          <p className="text-2xl font-bold text-amber-700">{target.fats}g</p>
          <p className="text-xs text-gray-400 mt-1">{target.perKg.fats}g/kg</p>
        </div>
      </div>

      {/* Calorie Breakdown */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold text-gray-700 mb-2">Calorie Breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Protein</span>
            <span className="font-medium">{Math.round(target.protein * 4)} kcal ({target.ratio.protein}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carbs</span>
            <span className="font-medium">{Math.round(target.carbs * 4)} kcal ({target.ratio.carbs}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fats</span>
            <span className="font-medium">{Math.round(target.fats * 9)} kcal ({target.ratio.fats}%)</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-emerald-600">{target.calories} kcal</span>
          </div>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {showAdvanced ? 'Hide' : 'Show'} advanced options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Meal Frequency</p>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map(num => (
              <button
                key={num}
                className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                {num} meals
              </button>
            ))}
          </div>
          
          <p className="text-sm font-semibold text-gray-700 mt-3 mb-2">Per Meal Average</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-white rounded p-2">
              <span className="block text-emerald-600 font-bold">{Math.round(target.protein / 4)}g</span>
              <span className="text-gray-500">Protein</span>
            </div>
            <div className="bg-white rounded p-2">
              <span className="block text-blue-600 font-bold">{Math.round(target.carbs / 4)}g</span>
              <span className="text-gray-500">Carbs</span>
            </div>
            <div className="bg-white rounded p-2">
              <span className="block text-amber-600 font-bold">{Math.round(target.fats / 4)}g</span>
              <span className="text-gray-500">Fats</span>
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-md"
      >
        Apply Macro Targets
      </button>

      {/* Info Note */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Based on the Mifflin-St Jeor equation. Adjust based on your personal response.
      </p>
    </div>
  );
};

export default MacroCalculator;