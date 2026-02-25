import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Flame,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const GoalSettings = ({ onChange, values, errors, maintenanceCalories }) => {
  const [formData, setFormData] = useState({
    goalType: values?.goalType || '',
    targetWeight: values?.targetWeight || '',
    timeline: values?.timeline || '',
    experienceLevel: values?.experienceLevel || '',
  });

  const [calorieTarget, setCalorieTarget] = useState(null);
  const [safetyWarnings, setSafetyWarnings] = useState([]);

  // Goal type options
  const goalTypes = [
    { value: 'lose', label: 'Lose Weight', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-50' },
    { value: 'maintain', label: 'Maintain Weight', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'gain', label: 'Gain Weight', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'muscle', label: 'Build Muscle', icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  // Timeline options
  const timelineOptions = [
    { value: '1', label: '1 Month', description: 'Aggressive' },
    { value: '2', label: '2 Months', description: 'Moderate' },
    { value: '3', label: '3 Months', description: 'Balanced' },
    { value: '6', label: '6 Months', description: 'Sustainable' },
    { value: '12', label: '12 Months', description: 'Long-term' },
  ];

  // Experience level options
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to fitness' },
    { value: 'intermediate', label: 'Intermediate', description: '6 months - 2 years' },
    { value: 'advanced', label: 'Advanced', description: '2+ years experience' },
  ];

  // Calculate calorie target and check for safety warnings
  useEffect(() => {
    const warnings = [];
    
    if (maintenanceCalories && formData.goalType && formData.targetWeight && values?.currentWeight) {
      const weightDiff = Math.abs(formData.targetWeight - values.currentWeight);
      const months = parseInt(formData.timeline);
      
      let calculatedCalories = maintenanceCalories;

      if (formData.goalType === 'lose') {
        // Safe weight loss: 0.5-1 kg per week
        const weeklyLoss = weightDiff / (months * 4);
        
        if (weeklyLoss > 1) {
          warnings.push('Your target weight loss rate exceeds 1kg/week, which may not be sustainable.');
        }
        
        // 1kg fat = ~7700 calories, so daily deficit needed
        const dailyDeficit = (weightDiff * 7700) / (months * 30);
        calculatedCalories = Math.round(maintenanceCalories - dailyDeficit);
        
        if (calculatedCalories < 1200) {
          warnings.push('Calorie target is below 1200/day, which is not recommended without medical supervision.');
          calculatedCalories = 1200;
        }
      } else if (formData.goalType === 'gain' || formData.goalType === 'muscle') {
        // Safe weight gain: 0.25-0.5 kg per week
        const weeklyGain = weightDiff / (months * 4);
        
        if (weeklyGain > 0.5) {
          warnings.push('Your target weight gain rate exceeds 0.5kg/week, which may lead to excess fat gain.');
        }
        
        const dailySurplus = (weightDiff * 7700) / (months * 30);
        calculatedCalories = Math.round(maintenanceCalories + dailySurplus);
        
        if (calculatedCalories > maintenanceCalories + 500) {
          warnings.push('Large calorie surplus detected. Consider a more moderate approach for lean muscle gain.');
        }
      } else if (formData.goalType === 'maintain') {
        calculatedCalories = maintenanceCalories;
      }

      setCalorieTarget(calculatedCalories);
    } else {
      setCalorieTarget(null);
    }

    setSafetyWarnings(warnings);
  }, [formData, maintenanceCalories, values?.currentWeight]);

  // Update parent component
  useEffect(() => {
    if (onChange) {
      onChange({ ...formData, calorieTarget, safetyWarnings });
    }
  }, [formData, calorieTarget, safetyWarnings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalTypeSelect = (goalType) => {
    setFormData((prev) => ({ ...prev, goalType }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goal Settings</h2>
        <p className="text-gray-600 text-sm">
          Define your fitness goals and we'll create a personalized plan for you
        </p>
      </div>

      {/* Goal Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's your primary goal?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goalTypes.map((goal) => {
            const Icon = goal.icon;
            const isSelected = formData.goalType === goal.value;
            
            return (
              <motion.button
                key={goal.value}
                type="button"
                onClick={() => handleGoalTypeSelect(goal.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${goal.bgColor} border-${goal.value === 'lose' ? 'red' : goal.value === 'maintain' ? 'blue' : goal.value === 'gain' ? 'green' : 'purple'}-500`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-8 h-8 ${isSelected ? goal.color : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                    {goal.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
        {errors?.goalType && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errors.goalType}
          </p>
        )}
      </div>

      {/* Target Weight Input */}
      {formData.goalType && formData.goalType !== 'maintain' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Target Weight (kg)
            </div>
          </label>
          <input
            type="number"
            name="targetWeight"
            value={formData.targetWeight}
            onChange={handleInputChange}
            min="0"
            step="0.1"
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
              errors?.targetWeight
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
            }`}
            placeholder="Enter your target weight"
          />
          {errors?.targetWeight && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.targetWeight}
            </p>
          )}
          
          {/* Weight difference display */}
          {formData.targetWeight && values?.currentWeight && (
            <p className="text-sm text-gray-600 mt-2">
              {formData.goalType === 'lose' ? 'To lose: ' : 'To gain: '}
              <span className="font-semibold">
                {Math.abs(formData.targetWeight - values.currentWeight).toFixed(1)} kg
              </span>
            </p>
          )}
        </motion.div>
      )}

      {/* Timeline Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-600" />
            Timeline to achieve your goal
          </div>
        </label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
            errors?.timeline
              ? 'border-red-300 bg-red-50 focus:border-red-500'
              : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
          }`}
        >
          <option value="">Select timeline</option>
          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
        {errors?.timeline && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errors.timeline}
          </p>
        )}
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            Fitness Experience Level
          </div>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experienceLevels.map((level) => {
            const isSelected = formData.experienceLevel === level.value;
            
            return (
              <motion.button
                key={level.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, experienceLevel: level.value }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-purple-50 border-purple-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className={`font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                  {level.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{level.description}</p>
              </motion.button>
            );
          })}
        </div>
        {errors?.experienceLevel && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errors.experienceLevel}
          </p>
        )}
      </div>

      {/* Calorie Target Display */}
      {calorieTarget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Daily Calorie Target</h3>
              <p className="text-sm text-gray-600">Based on your goals and activity level</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-orange-600" />
                <p className="text-4xl font-bold text-orange-600">{calorieTarget}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">calories/day</p>
            </div>
          </div>

          {/* Calorie breakdown */}
          {maintenanceCalories && (
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg text-sm">
              <span className="text-gray-700">Maintenance: {maintenanceCalories} cal</span>
              <span className={`font-semibold ${
                calorieTarget > maintenanceCalories ? 'text-green-600' : 'text-red-600'
              }`}>
                {calorieTarget > maintenanceCalories ? '+' : ''}
                {calorieTarget - maintenanceCalories} cal/day
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Safety Warnings */}
      {safetyWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Safety Considerations</h4>
              <ul className="space-y-1">
                {safetyWarnings.map((warning, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {warning}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                Consult with a healthcare professional before making significant dietary changes.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success message when no warnings */}
      {calorieTarget && safetyWarnings.length === 0 && formData.goalType && formData.timeline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-700">
              Your goal settings look great! This is a safe and sustainable approach.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GoalSettings;
