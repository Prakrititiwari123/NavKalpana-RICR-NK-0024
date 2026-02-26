import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Utensils, Calendar, Activity, Calculator, Loader } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import DietPlan from './diet/DietPlan';
import CalorieTracker from './diet/CalorieTracker';
import MacroCalculator from './diet/MacroCalculator';
import { useAuth } from '../../Context/AuthContext';
import { 
  getNutritionLogs, 
  createNutritionLog,
  updateGoals,
  getProgress
} from '../../Services/profileService';
import toast from 'react-hot-toast';

const Diet = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plan');
  const [loading, setLoading] = useState(true);
  const [mealLogs, setMealLogs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoalsData = userHealthData.goals || {};

  // Calculate macro targets based on user goals
  const [macroTargets, setMacroTargets] = useState({
    calories: userGoalsData.calorieTarget || 2100,
    protein: Math.round((userGoalsData.calorieTarget || 2100) * 0.3 / 4) || 158, // 30% protein, 4 cal/g
    carbs: Math.round((userGoalsData.calorieTarget || 2100) * 0.45 / 4) || 236,   // 45% carbs, 4 cal/g
    fat: Math.round((userGoalsData.calorieTarget || 2100) * 0.25 / 9) || 58,      // 25% fat, 9 cal/g
    fiber: 30,
    sugar: 50,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Daily calorie target
  const dailyTarget = 2200;
  
  // Current day macros
  const macros = {
    protein: { consumed: 145, target: 180, unit: 'g' },
    carbs: { consumed: 220, target: 275, unit: 'g' },
    fats: { consumed: 58, target: 73, unit: 'g' },
    fiber: { consumed: 28, target: 35, unit: 'g' }
  };

  const todaysMeals = [
    {
      id: 1,
      name: 'Breakfast',
      time: '8:00 AM',
      calories: 450,
      status: 'completed',
      items: [
        { food: 'Oatmeal', amount: '100g', calories: 150 },
        { food: 'Almond Butter', amount: '2 tbsp', calories: 190 },
        { food: 'Banana', amount: '1 medium', calories: 110 }
      ]
    },
    {
      id: 2,
      name: 'Lunch',
      time: '1:00 PM',
      calories: 650,
      status: 'completed',
      items: [
        { food: 'Grilled Chicken Breast', amount: '200g', calories: 330 },
        { food: 'Brown Rice', amount: '150g', calories: 195 },
        { food: 'Mixed Vegetables', amount: '200g', calories: 80 },
        { food: 'Olive Oil', amount: '1 tbsp', calories: 120 }
      ]
    },
    {
      id: 3,
      name: 'Dinner',
      time: '7:00 PM',
      calories: 600,
      status: 'pending',
      items: [
        { food: 'Salmon Fillet', amount: '180g', calories: 280 },
        { food: 'Sweet Potato', amount: '150g', calories: 130 },
        { food: 'Broccoli', amount: '200g', calories: 70 },
        { food: 'Lemon & Herbs', amount: 'to taste', calories: 20 }
      ]
    },
    {
      id: 4,
      name: 'Snacks',
      time: 'Flexible',
      calories: 200,
      status: 'pending',
      items: [
        { food: 'Greek Yogurt', amount: '150g', calories: 100 },
        { food: 'Almonds', amount: '30g', calories: 100 }
      ]
    }
  ];

  const loadUserNutritionData = useCallback(async () => {
    setLoading(true);
    try {
      // Load nutrition logs
      const nutritionData = await getNutritionLogs();
      if (nutritionData && nutritionData.length > 0) {
        setMealLogs(nutritionData);
      }

      // Load progress data for goals
      await getProgress();

      // Set user profile
      setUserProfile({
        age: userHealthData.profile?.age,
        gender: userHealthData.profile?.gender,
        height: userVitals.height,
        weight: userVitals.currentWeight,
        activityLevel: userHealthData.profile?.activityLevel,
        goal: userGoalsData.primaryGoal,
        targetWeight: userVitals.goalWeight,
      });

    } catch (error) {
      console.error('Error loading nutrition data:', error);
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  }, [userGoalsData.primaryGoal, userHealthData.profile?.activityLevel, userHealthData.profile?.age, userHealthData.profile?.gender, userVitals.currentWeight, userVitals.goalWeight, userVitals.height]);

  // Load user data on mount
  useEffect(() => {
    loadUserNutritionData();
  }, [loadUserNutritionData]);

  // Handle meal swap (for meal plan)
  const handleMealSwap = async (meal) => {
    try {
      console.log('Swapping meal:', meal);
      // TODO: Implement meal swap logic with backend
      toast.success('Meal swapped successfully!');
    } catch {
      toast.error('Failed to swap meal');
    }
  };

  // Handle logging a meal
  const handleLogMeal = async (logData) => {
    try {
      // Prepare data for backend
      const mealData = {
        date: logData.date || new Date(),
        mealType: logData.mealType,
        calories: parseInt(logData.calories),
        macros: {
          protein: parseInt(logData.protein) || 0,
          carbs: parseInt(logData.carbs) || 0,
          fats: parseInt(logData.fats) || 0,
        },
        foodItems: logData.foodItems || [],
        notes: logData.notes || '',
      };

      // Save to backend
      const savedMeal = await createNutritionLog(mealData);
      
      // Update local state
      setMealLogs((prev) => [savedMeal, ...prev]);
      
      toast.success('Meal logged successfully!');
    } catch (error) {
      console.error('Error logging meal:', error);
      toast.error(error.message || 'Failed to log meal');
    }
  };

  // Handle macro calculation
  const handleCalculateMacros = async (macroData) => {
    try {
      console.log('Calculated macros:', macroData);
      
      // Update macro targets
      setMacroTargets(macroData);
      
      // Update user goals in backend
      await updateGoals({
        calorieTarget: macroData.calories,
      });

      toast.success('Macro targets updated!');
    } catch {
      toast.error('Failed to update macro targets');
    }
  };

  // Calculate daily totals from logs
  const dailyTotals = () => {
    const today = new Date().toDateString();
    const todayLogs = mealLogs.filter(log => 
      new Date(log.date).toDateString() === today
    );

    return todayLogs.reduce((acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.macros?.protein || 0),
      carbs: acc.carbs + (log.macros?.carbs || 0),
      fats: acc.fats + (log.macros?.fats || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const todaysProgress = dailyTotals();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 text-green-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nutrition Center
              </h1>
            </div>
            <p className="text-gray-600">
              Plan your meals, track calories, and calculate optimal macros for your goals.
            </p>

            {/* User Info Summary */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Daily Calories</p>
                <p className="text-lg font-bold text-gray-800">
                  {todaysProgress.calories} / {macroTargets.calories} kcal
                </p>
                <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((todaysProgress.calories / macroTargets.calories) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Protein</p>
                <p className="text-lg font-bold text-gray-800">
                  {todaysProgress.protein} / {macroTargets.protein}g
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-600">Carbs</p>
                <p className="text-lg font-bold text-gray-800">
                  {todaysProgress.carbs} / {macroTargets.carbs}g
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-600">Fats</p>
                <p className="text-lg font-bold text-gray-800">
                  {todaysProgress.fats} / {macroTargets.fat}g
                </p>
              </div>
            </div>

            {/* User Profile Info */}
            {userProfile && (
              <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4">
                {userProfile.age && <span>Age: {userProfile.age}</span>}
                {userProfile.gender && <span>Gender: {userProfile.gender}</span>}
                {userProfile.weight && <span>Weight: {userProfile.weight} kg</span>}
                {userProfile.height && <span>Height: {userProfile.height} cm</span>}
                {userProfile.goal && (
                  <span className="capitalize">Goal: {userProfile.goal}</span>
                )}
              </div>
            )}
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
                        ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-md'
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
                <DietPlan 
                  onSwap={handleMealSwap}
                  userProfile={userProfile}
                  macroTargets={macroTargets}
                />
              )}

              {activeTab === 'tracker' && (
                <CalorieTracker
                  logs={mealLogs}
                  target={macroTargets}
                  onLog={handleLogMeal}
                  dailyTotals={todaysProgress}
                />
              )}

              {activeTab === 'calculator' && (
                <MacroCalculator 
                  onCalculate={handleCalculateMacros}
                  userProfile={userProfile}
                  initialTargets={macroTargets}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SECTION 2: MACRO NUTRIENTS OVERVIEW */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <GiWeightLiftingUp className="w-6 h-6 text-blue-600" />
            Macro Nutrients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Protein */}
            <div className="p-5 bg-linear-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">Protein</span>
                <span className="text-sm text-gray-500">{macros.protein.consumed}/{macros.protein.target}g</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="h-full bg-linear-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getMacroPercentage(macros.protein.consumed, macros.protein.target), 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{getMacroPercentage(macros.protein.consumed, macros.protein.target)}% of goal</p>
            </div>

            {/* Carbs */}
            <div className="p-5 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">Carbs</span>
                <span className="text-sm text-gray-500">{macros.carbs.consumed}/{macros.carbs.target}g</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getMacroPercentage(macros.carbs.consumed, macros.carbs.target), 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{getMacroPercentage(macros.carbs.consumed, macros.carbs.target)}% of goal</p>
            </div>

            {/* Fats */}
            <div className="p-5 bg-linear-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">Fats</span>
                <span className="text-sm text-gray-500">{macros.fats.consumed}/{macros.fats.target}g</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getMacroPercentage(macros.fats.consumed, macros.fats.target), 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{getMacroPercentage(macros.fats.consumed, macros.fats.target)}% of goal</p>
            </div>

            {/* Fiber */}
            <div className="p-5 bg-linear-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">Fiber</span>
                <span className="text-sm text-gray-500">{macros.fiber.consumed}/{macros.fiber.target}g</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="h-full bg-linear-to-r from-green-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getMacroPercentage(macros.fiber.consumed, macros.fiber.target), 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{getMacroPercentage(macros.fiber.consumed, macros.fiber.target)}% of goal</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: TODAY'S MEALS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IoRestaurant className="w-6 h-6 text-green-600" />
            Today's Meals
          </h2>
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <div
                key={meal.id}
                className="relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-300"
                style={{
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Meal Header - Collapsible */}
                <div
                  onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                  className={`w-full p-4 md:p-5 flex items-center justify-between text-left transition-all duration-300 cursor-pointer ${
                    meal.status === 'completed'
                      ? 'bg-linear-to-r from-green-50 to-emerald-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMeal(meal.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                        completedMeals.includes(meal.id)
                          ? 'bg-green-500 border-green-500 scale-110'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {completedMeals.includes(meal.id) && (
                        <FiCheck className="w-4 h-4 text-white animate-scaleIn" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3 className={`text-lg font-bold transition-colors duration-300 ${
                        completedMeals.includes(meal.id) ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {meal.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-sm text-gray-500">{meal.time}</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                          {meal.calories} kcal
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          meal.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {meal.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <FiChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      expandedMeal === meal.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Meal Details - Expandable */}
                {expandedMeal === meal.id && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-200 space-y-3 animate-fadeIn">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700">Food Items</h4>
                      {meal.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                          style={{
                            animation: `slideInLeft 0.3s ease-out ${itemIndex * 0.05}s backwards`
                          }}
                        >
                          <div>
                            <p className="font-medium text-gray-800">{item.food}</p>
                            <p className="text-sm text-gray-500">{item.amount}</p>
                          </div>
                          <span className="text-sm font-semibold text-orange-600">{item.calories} kcal</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      <FiEdit3 className="w-4 h-4 inline mr-2" />
                      Log Meal
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: WATER INTAKE TRACKER */}
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-blue-200 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IoWater className="w-6 h-6 text-blue-600" />
            Water Intake Tracker
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Water glasses visual */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-16 rounded-lg border-2 flex items-end justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                      index < waterIntake
                        ? 'bg-blue-400 border-blue-500 shadow-lg'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => setWaterIntake(index + 1)}
                    style={{
                      animation: `bounceIn 0.6s ease-out ${index * 0.1}s backwards`
                    }}
                  >
                    {index < waterIntake && (
                      <div className="text-2xl text-blue-600 font-bold mb-1">
                        {Math.round(((index + 1) / 8) * 2 * 100) / 100}L
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center text-gray-600">
                <p className="text-sm">
                  {waterIntake} / 8 glasses consumed ({(waterIntake / 8 * 2).toFixed(2)} L)
                </p>
              </div>
            </div>

            {/* Water stats and button */}
            <div className="flex flex-col justify-between items-center space-y-4">
              <div className="w-full space-y-3">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Daily Goal</span>
                    <span className="text-2xl font-bold text-blue-600">8 glasses / 2L</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Remaining</span>
                    <span className="text-2xl font-bold text-blue-600">{8 - waterIntake} glasses</span>
                  </div>
                </div>
              </div>

              <button
                onClick={addWater}
                disabled={waterIntake >= 8}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                  waterIntake >= 8
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <IoWater className="w-6 h-6" />
                {waterIntake >= 8 ? 'Goal Reached!' : '+ Add Water'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: WEEKLY MEAL HISTORY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiCalendar className="w-6 h-6 text-green-600" />
            Weekly Meal History
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily breakdown */}
            <div className="space-y-3">
              {weeklyHistory.map((day, index) => (
                <div
                  key={index}
                  className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300"
                  style={{
                    animation: `slideInLeft 0.5s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{day.day}</h3>
                    <span className="text-sm text-gray-500">
                      {((day.calories / dailyTarget) * 100).toFixed(0)}% of target
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((day.calories / dailyTarget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{day.calories} kcal</p>
                </div>
              ))}
            </div>

            {/* Macro distribution summary */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-4">Today's Macro Distribution</h3>

              {/* Protein */}
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Protein</span>
                  <span className="text-sm text-red-600 font-bold">{macros.protein.consumed}g</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="h-full bg-linear-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((macros.protein.consumed / macros.protein.target) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Carbs</span>
                  <span className="text-sm text-yellow-600 font-bold">{macros.carbs.consumed}g</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div
                    className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((macros.carbs.consumed / macros.carbs.target) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Fats</span>
                  <span className="text-sm text-purple-600 font-bold">{macros.fats.consumed}g</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((macros.fats.consumed / macros.fats.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: MEAL SUGGESTIONS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FiTrendingUp className="w-6 h-6 text-orange-600" />
            Meal Suggestions & Tips
          </h2>
          <p className="text-gray-600 mb-6">Healthy recipe ideas and meal prep tips</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="p-6 bg-linear-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-lg hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animation: `bounceIn 0.6s ease-out ${index * 0.15}s backwards`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex-1">{suggestion.title}</h3>
                  <IoFlame className="w-5 h-5 text-orange-500 shrink-0 ml-2" />
                </div>

                <p className="text-gray-600 text-sm mb-4">{suggestion.description}</p>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    {suggestion.calories} kcal
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {suggestion.proteinPerk}
                  </span>
                </div>

                <button className="w-full mt-4 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Try Recipe
                </button>
              </div>
            ))}
          </div>

          {/* Meal Prep Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Prep Ahead',
                tip: 'Prepare meals on Sunday for the week. Store in portions to save time.'
              },
              {
                title: 'Healthy Substitutes',
                tip: 'Replace white rice with brown rice or quinoa for more nutrients.'
              },
              {
                title: 'Track Everything',
                tip: 'Log all meals and snacks to stay accountable and meet your goals.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.2}s backwards`
                }}
              >
                <h4 className="font-bold text-blue-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Custom CSS Animations */}
      <style>{`
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
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Diet;
