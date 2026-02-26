import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, RefreshCw, Printer, ShoppingBag, ArrowRightLeft, Loader, Check, X } from 'lucide-react';
import MealDetail from './MealDetail.jsx';
import MacroCalculator from './MacroCalculator.jsx';
import { useAuth } from '../../../context/AuthContext';
import { getNutritionLogs } from '../../../services/profileService';
import toast from 'react-hot-toast';

const DietPlan = ({ plan: externalPlan, dayOffset = 0, onSwap, userProfile, macroTargets: externalMacros }) => {
  const { user } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [macroTargets, setMacroTargets] = useState(externalMacros || null);
  const [loading, setLoading] = useState(false);
  const [todayMeals, setTodayMeals] = useState([]);

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};

  // Generate dynamic meal plan based on user profile
  const generateMealPlan = (userData) => {
    const goal = userGoals.primaryGoal || 'maintain';
    const calories = macroTargets?.calories || userGoals.calorieTarget || 2200;
    const weight = userVitals.currentWeight || 70;
    
    // Calculate macros based on goal
    let proteinRatio, carbRatio, fatRatio;
    switch(goal) {
      case 'lose':
        proteinRatio = 0.35; // Higher protein for satiety
        carbRatio = 0.4;
        fatRatio = 0.25;
        break;
      case 'gain':
      case 'muscle':
        proteinRatio = 0.3;
        carbRatio = 0.45; // Higher carbs for energy
        fatRatio = 0.25;
        break;
      default: // maintain
        proteinRatio = 0.3;
        carbRatio = 0.4;
        fatRatio = 0.3;
    }

    const protein = Math.round((calories * proteinRatio) / 4);
    const carbs = Math.round((calories * carbRatio) / 4);
    const fats = Math.round((calories * fatRatio) / 9);

    // Generate meal suggestions based on time of day
    const meals = [
      {
        id: 'breakfast',
        name: 'Breakfast',
        time: '8:00 AM',
        calories: Math.round(calories * 0.25),
        macros: {
          protein: Math.round(protein * 0.25),
          carbs: Math.round(carbs * 0.25),
          fats: Math.round(fats * 0.25),
        },
        items: getBreakfastItems(goal),
        prepTime: '10 min',
        instructions: ['Prepare ingredients', 'Cook as desired', 'Serve and enjoy'],
        alternatives: ['Oatmeal with fruits', 'Egg white scramble', 'Protein smoothie'],
      },
      {
        id: 'lunch',
        name: 'Lunch',
        time: '1:00 PM',
        calories: Math.round(calories * 0.35),
        macros: {
          protein: Math.round(protein * 0.35),
          carbs: Math.round(carbs * 0.35),
          fats: Math.round(fats * 0.35),
        },
        items: getLunchItems(goal),
        prepTime: '20 min',
        instructions: ['Prep vegetables', 'Cook protein', 'Combine and season'],
        alternatives: ['Grilled chicken salad', 'Quinoa bowl', 'Turkey wrap'],
      },
      {
        id: 'snack',
        name: 'Snack',
        time: '4:00 PM',
        calories: Math.round(calories * 0.15),
        macros: {
          protein: Math.round(protein * 0.15),
          carbs: Math.round(carbs * 0.15),
          fats: Math.round(fats * 0.15),
        },
        items: getSnackItems(goal),
        prepTime: '5 min',
        instructions: ['Quick preparation', 'Portion control', 'Enjoy'],
        alternatives: ['Greek yogurt', 'Apple with peanut butter', 'Protein bar'],
      },
      {
        id: 'dinner',
        name: 'Dinner',
        time: '7:30 PM',
        calories: Math.round(calories * 0.25),
        macros: {
          protein: Math.round(protein * 0.25),
          carbs: Math.round(carbs * 0.25),
          fats: Math.round(fats * 0.25),
        },
        items: getDinnerItems(goal),
        prepTime: '25 min',
        instructions: ['Prep ingredients', 'Cook meal', 'Plate and serve'],
        alternatives: ['Baked salmon', 'Lean steak', 'Vegetable stir-fry'],
      },
    ];

    // Generate shopping list
    const shoppingList = [];
    meals.forEach(meal => {
      meal.items.forEach(item => {
        if (!shoppingList.includes(item)) {
          shoppingList.push(item);
        }
      });
    });

    return {
      dayName: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      calories,
      goal: userGoals.primaryGoal || 'Maintain',
      meals,
      shoppingList,
      totalCalories: calories,
      remainingCalories: calories,
    };
  };

  // Helper functions for meal items
  const getBreakfastItems = (goal) => {
    const options = {
      lose: ['Egg whites', 'Oats', 'Berries', 'Green tea'],
      gain: ['Whole eggs', 'Oats', 'Banana', 'Peanut butter', 'Milk'],
      muscle: ['Eggs', 'Oatmeal', 'Protein powder', 'Almonds'],
      maintain: ['Greek yogurt', 'Oats', 'Mixed berries', 'Honey'],
    };
    return options[goal] || options.maintain;
  };

  const getLunchItems = (goal) => {
    const options = {
      lose: ['Grilled chicken', 'Quinoa', 'Broccoli', 'Olive oil'],
      gain: ['Chicken thigh', 'Brown rice', 'Avocado', 'Sweet potato'],
      muscle: ['Lean beef', 'Brown rice', 'Spinach', 'Sweet potato'],
      maintain: ['Turkey breast', 'Whole wheat wrap', 'Lettuce', 'Tomato'],
    };
    return options[goal] || options.maintain;
  };

  const getSnackItems = (goal) => {
    const options = {
      lose: ['Protein shake', 'Apple', 'Celery sticks'],
      gain: ['Peanut butter sandwich', 'Banana', 'Protein bar'],
      muscle: ['Cottage cheese', 'Almonds', 'Protein bar'],
      maintain: ['Greek yogurt', 'Mixed nuts', 'Berries'],
    };
    return options[goal] || options.maintain;
  };

  const getDinnerItems = (goal) => {
    const options = {
      lose: ['Salmon', 'Asparagus', 'Quinoa', 'Lemon'],
      gain: ['Salmon', 'Sweet potato', 'Broccoli', 'Brown rice'],
      muscle: ['Lean steak', 'Sweet potato', 'Green beans', 'Mushrooms'],
      maintain: ['Chicken breast', 'Roasted vegetables', 'Brown rice'],
    };
    return options[goal] || options.maintain;
  };

  // Generate plan based on user data
  const generatedPlan = useMemo(() => {
    return generateMealPlan(userProfile);
  }, [userProfile, macroTargets]);

  const currentPlan = externalPlan || generatedPlan;

  const planDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [dayOffset]);

  // Load today's logged meals
  useEffect(() => {
    const loadTodayMeals = async () => {
      try {
        const logs = await getNutritionLogs();
        const today = new Date().toDateString();
        const todaysMeals = logs.filter(log => 
          new Date(log.date).toDateString() === today
        );
        setTodayMeals(todaysMeals);
      } catch (error) {
        console.error('Error loading today\'s meals:', error);
      }
    };
    loadTodayMeals();
  }, []);

  // Calculate consumed calories from today's meals
  const consumedCalories = useMemo(() => {
    return todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  }, [todayMeals]);

  // Calculate remaining calories
  const remainingCalories = Math.max((currentPlan.calories || 0) - consumedCalories, 0);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('New meal plan generated!');
    } catch (error) {
      toast.error('Failed to regenerate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Meal Plan - ${planDate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #059669; }
            .meal { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .meal-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .meal-name { font-size: 18px; font-weight: bold; color: #1f2937; }
            .meal-time { color: #6b7280; }
            .macros { display: flex; gap: 10px; margin: 10px 0; }
            .macro { background: #f3f4f6; padding: 5px 10px; border-radius: 4px; }
            .items { list-style: none; padding: 0; }
            .items li { padding: 3px 0; }
            .shopping-list { margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Meal Plan - ${planDate}</h1>
          <p>Goal: ${currentPlan.goal} | Target Calories: ${currentPlan.calories} kcal</p>
          <p>Consumed: ${consumedCalories} kcal | Remaining: ${remainingCalories} kcal</p>
          
          ${currentPlan.meals.map(meal => `
            <div class="meal">
              <div class="meal-header">
                <span class="meal-name">${meal.name}</span>
                <span class="meal-time">${meal.time} · ${meal.prepTime}</span>
              </div>
              <div class="macros">
                <span class="macro">Protein: ${meal.macros.protein}g</span>
                <span class="macro">Carbs: ${meal.macros.carbs}g</span>
                <span class="macro">Fats: ${meal.macros.fats}g</span>
                <span class="macro">Calories: ${meal.calories}</span>
              </div>
              <ul class="items">
                ${meal.items.map(item => `<li>• ${item}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
          
          <div class="shopping-list">
            <h3>Shopping List</h3>
            <ul class="items">
              ${currentPlan.shoppingList.map(item => `<li>• ${item}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{planDate}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-1 capitalize">
              {currentPlan.goal} Plan
            </h2>
            <p className="text-sm text-gray-500">
              Target {currentPlan.calories} kcal · Based on your {userGoals.experienceLevel || 'beginner'} level
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Regenerate
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consumed Today</p>
              <p className="text-2xl font-bold text-emerald-700">{consumedCalories} kcal</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-800">{remainingCalories} kcal</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full transition-all"
              style={{ width: `${Math.min((consumedCalories / currentPlan.calories) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {userProfile?.age && <span>Age: {userProfile.age}</span>}
          {userVitals?.height && <span>Height: {userVitals.height} cm</span>}
          {userVitals?.currentWeight && <span>Weight: {userVitals.currentWeight} kg</span>}
          {userVitals?.goalWeight && <span>Goal: {userVitals.goalWeight} kg</span>}
        </div>
      </div>

      {/* Macro Calculator */}
      <MacroCalculator
        weight={userVitals.currentWeight || 70}
        goal={userGoals.primaryGoal || 'maintain'}
        calories={currentPlan.calories}
        onCalculate={setMacroTargets}
        userProfile={userProfile}
      />

      {/* Macro Targets Display */}
      {macroTargets && (
        <div className="bg-white rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-gray-600">Daily Macro Targets</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-gray-500">Protein</p>
              <p className="font-bold text-emerald-700">{macroTargets.protein} g</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-gray-500">Carbs</p>
              <p className="font-bold text-blue-700">{macroTargets.carbs} g</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-gray-500">Fats</p>
              <p className="font-bold text-amber-700">{macroTargets.fats} g</p>
            </div>
          </div>
        </div>
      )}

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentPlan.meals.map((meal) => {
          const isLogged = todayMeals.some(m => m.mealType === meal.name);
          
          return (
            <div
              key={meal.id}
              className={`bg-white rounded-xl border-2 transition-colors p-5 ${
                isLogged 
                  ? 'border-green-300 bg-green-50/30' 
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
                  <p className="text-sm text-gray-500">{meal.time} · {meal.prepTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isLogged && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Logged
                    </span>
                  )}
                  <button
                    className="text-sm text-emerald-600 font-semibold flex items-center gap-1"
                    onClick={() => onSwap && onSwap(meal)}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    Swap
                  </button>
                </div>
              </div>

              {/* Macros */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-emerald-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Protein</p>
                  <p className="font-bold text-emerald-700">{meal.macros.protein}g</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Carbs</p>
                  <p className="font-bold text-blue-700">{meal.macros.carbs}g</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Fats</p>
                  <p className="font-bold text-amber-700">{meal.macros.fats}g</p>
                </div>
              </div>

              {/* Items */}
              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                {meal.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Alternatives */}
              {meal.alternatives && (
                <div className="mt-3 text-xs text-gray-500">
                  <span className="font-medium">Alternatives:</span> {meal.alternatives.join(' • ')}
                </div>
              )}

              {/* Action Button */}
              <button
                className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors ${
                  isLogged
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700'
                }`}
                onClick={() => setSelectedMeal(meal)}
              >
                {isLogged ? 'View Details' : 'Log This Meal'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Shopping List */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">Shopping List</h3>
          <span className="text-xs text-gray-500 ml-auto">{currentPlan.shoppingList.length} items</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
          {currentPlan.shoppingList.map((item) => (
            <div key={item} className="bg-emerald-50 rounded-lg p-2 flex items-center justify-between group">
              <span>{item}</span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetail
          meal={{
            ...selectedMeal,
            instructions: selectedMeal.instructions || [
              'Prepare all ingredients',
              'Follow cooking instructions',
              'Plate and enjoy your meal',
            ],
            tips: [
              'Prep ingredients in advance',
              'Use fresh ingredients when possible',
              'Adjust portions based on your needs',
            ],
          }}
          onCook={() => setSelectedMeal(null)}
          onLog={() => {
            // Trigger log from calorie tracker
            setSelectedMeal(null);
            // Switch to tracker tab
            window.dispatchEvent(new CustomEvent('switchToTracker', { detail: selectedMeal }));
          }}
          scale={1}
        />
      )}
    </div>
  );
};

export default DietPlan;