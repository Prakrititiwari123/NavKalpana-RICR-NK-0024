import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
} from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { getWorkouts, getProgress , getAnalytics , getNutritionLogs } from '../../Services/profileService';

import toast from 'react-hot-toast';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  
  // State for loaded raw data
  const [, setWorkouts] = useState([]);
  const [, setMeals] = useState([]);
  const [, setWeightLogs] = useState([]);
  const [, setAnalyticsData] = useState([]);

  // Derived data for charts
  const [weightAnalysisData, setWeightAnalysisData] = useState([]);
  const [workoutByDayData, setWorkoutByDayData] = useState([]);
  const [workoutTypesData, setWorkoutTypesData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [macroDistributionData, setMacroDistributionData] = useState([]);
  const [sleepWorkoutData, setSleepWorkoutData] = useState([]);
  const [dietWeightData, setDietWeightData] = useState([]);
  const [weightForecastData, setWeightForecastData] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);

  // Stats
  const [overviewStats, setOverviewStats] = useState({
    totalWorkouts: 0,
    totalMeals: 0,
    weightChange: 0,
    habitScoreAvg: 0,
  });

  const [weightAnalysis, setWeightAnalysis] = useState({
    rateOfChange: 0,
    plateauDetected: false,
  });

  const [workoutPatterns, setWorkoutPatterns] = useState({
    mostConsistent: 'N/A',
    leastConsistent: 'N/A',
  });

  const [nutritionStats, setNutritionStats] = useState({
    mostConsistentMeal: 'N/A',
  });

  const [predictions, setPredictions] = useState({
    achievementProbability: 0,
    recommendedAdjustments: [],
  });

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];

  // Load all data
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch real data from services
      const workoutsData = await getWorkouts();
      const mealsData = await getNutritionLogs();
      const progressData = await getProgress();
      const analyticsRecords = await getAnalytics();

      setWorkouts(workoutsData || []);
      setMeals(mealsData || []);
      setWeightLogs(progressData?.weightLogs || []);
      setAnalyticsData(analyticsRecords || []);

      // Process data for charts based on date range
      const normalizedWeights = Array.isArray(progressData?.weightLogs) ? progressData.weightLogs : [];
      processDataForCharts(workoutsData || [], mealsData || [], normalizedWeights, dateRange);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
      
      // Set mock data as fallback
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const processDataForCharts = (workoutsData, mealsData, weightsData, range) => {
    // Filter data based on date range
    const cutoffDate = getCutoffDate(range);
    
    const filteredWorkouts = workoutsData.filter(w => new Date(w.date) >= cutoffDate);
    const filteredMeals = mealsData.filter(m => new Date(m.date) >= cutoffDate);
    const filteredWeights = weightsData.filter(w => new Date(w.date) >= cutoffDate);

    // Calculate overview stats
    calculateOverviewStats(filteredWorkouts, filteredMeals, filteredWeights);
    
    // Generate weight analysis data
    generateWeightAnalysis(filteredWeights);
    
    // Generate workout patterns
    generateWorkoutPatterns(filteredWorkouts);
    
    // Generate nutrition analysis
    generateNutritionAnalysis(filteredMeals);
    
    // Generate correlations
    generateCorrelations(filteredWorkouts, filteredMeals, filteredWeights);
    
    // Generate predictions
    generatePredictions(filteredWorkouts, filteredMeals, filteredWeights);
    
    // Generate heat map
    generateHeatMap(filteredWorkouts);
  };

  const getCutoffDate = (range) => {
    const now = new Date();
    switch(range) {
      case '30days':
        return new Date(now.setDate(now.getDate() - 30));
      case '3months':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case '1year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  };

  const calculateOverviewStats = (filteredWorkouts, filteredMeals, filteredWeights) => {
    const totalWorkouts = filteredWorkouts.length;
    const totalMeals = filteredMeals.length;
    
    const weightChange = filteredWeights.length >= 2 
      ? (filteredWeights[filteredWeights.length - 1]?.weight - filteredWeights[0]?.weight).toFixed(1)
      : 0;

    // Calculate habit score from analytics or derive from data
    const habitScoreAvg = calculateAverageHabitScore(filteredWorkouts, filteredMeals);

    setOverviewStats({
      totalWorkouts,
      totalMeals,
      weightChange,
      habitScoreAvg,
    });
  };

  const calculateAverageHabitScore = (workouts, meals) => {
    // Simplified habit score calculation
    const workoutScore = Math.min(workouts.length * 2, 40);
    const mealScore = Math.min(meals.length / 3, 30);
    const consistencyScore = 30; // Base score
    return Math.min(Math.round((workoutScore + mealScore + consistencyScore) / 3 * 100), 100);
  };

  const generateWeightAnalysis = (weights) => {
    if (weights.length < 2) {
      setWeightAnalysisData([]);
      setWeightAnalysis({
        rateOfChange: 0,
        plateauDetected: false,
      });
      return;
    }

    // Sort by date
    const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate rate of change (kg per week)
    const totalDays = (new Date(sortedWeights[sortedWeights.length - 1].date) - new Date(sortedWeights[0].date)) / (1000 * 60 * 60 * 24);
    const totalChange = sortedWeights[sortedWeights.length - 1].weight - sortedWeights[0].weight;
    const rateOfChange = (totalChange / totalDays * 7).toFixed(2);

    // Detect plateau (no significant change in last 14 days)
    const recentWeights = sortedWeights.slice(-3);
    const plateauDetected = recentWeights.length >= 3 && 
      Math.max(...recentWeights.map(w => w.weight)) - Math.min(...recentWeights.map(w => w.weight)) < 0.5;

    setWeightAnalysis({ rateOfChange: parseFloat(rateOfChange), plateauDetected });

    // Generate chart data
    const chartData = sortedWeights.map((w, index) => {
      const date = new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Calculate moving average (last 3 entries)
      const movingAvg = index >= 2 
        ? (sortedWeights[index].weight + sortedWeights[index-1].weight + sortedWeights[index-2].weight) / 3
        : w.weight;
      
      // Simple trend line (linear regression would be better but keeping it simple)
      const trend = w.weight - (rateOfChange / 7 * (sortedWeights.length - index));

      return {
        date,
        weight: w.weight,
        movingAvg: parseFloat(movingAvg.toFixed(1)),
        trend: parseFloat(trend.toFixed(1)),
      };
    });

    setWeightAnalysisData(chartData);
  };

  const generateWorkoutPatterns = (workouts) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const workoutsByDay = Array(7).fill(0);

    workouts.forEach(workout => {
      const day = new Date(workout.date).getDay();
      workoutsByDay[day]++;
    });

    // Find most and least consistent days
    const maxWorkouts = Math.max(...workoutsByDay);
    const minWorkouts = Math.min(...workoutsByDay);
    
    const mostConsistent = daysOfWeek[workoutsByDay.indexOf(maxWorkouts)];
    const leastConsistent = daysOfWeek[workoutsByDay.indexOf(minWorkouts)];

    setWorkoutPatterns({ mostConsistent, leastConsistent });

    // Generate workout by day data
    const dayData = daysOfWeek.map((day, index) => ({
      day,
      workouts: workoutsByDay[index],
    }));
    setWorkoutByDayData(dayData);

    // Generate workout types distribution
    const typesCount = {
      Cardio: 0,
      Strength: 0,
      Yoga: 0,
      HIIT: 0,
    };

    workouts.forEach(workout => {
      if (Object.prototype.hasOwnProperty.call(typesCount, workout.workoutType)) {
        typesCount[workout.workoutType]++;
      }
    });

    const totalWorkouts = workouts.length || 1; // Avoid division by zero
    const typesData = Object.entries(typesCount).map(([name, count]) => ({
      name,
      value: Math.round((count / totalWorkouts) * 100),
    }));

    setWorkoutTypesData(typesData);
  };

  const generateNutritionAnalysis = (meals) => {
    if (meals.length === 0) {
      setNutritionData([]);
      setMacroDistributionData([]);
      setNutritionStats({ mostConsistentMeal: 'N/A' });
      return;
    }

    // Group by day
    const mealsByDay = {};
    const macrosByDay = {};
    const caloriesByDay = {};

    meals.forEach(meal => {
      const date = new Date(meal.date).toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!mealsByDay[date]) {
        mealsByDay[date] = [];
        macrosByDay[date] = { protein: 0, carbs: 0, fats: 0 };
        caloriesByDay[date] = 0;
      }
      
      mealsByDay[date].push(meal);
      macrosByDay[date].protein += meal.macros?.protein || 0;
      macrosByDay[date].carbs += meal.macros?.carbs || 0;
      macrosByDay[date].fats += meal.macros?.fats || 0;
      caloriesByDay[date] += meal.calories || 0;
    });

    // Generate nutrition chart data
    const nutritionChartData = Object.keys(caloriesByDay).map(date => ({
      date,
      protein: Math.round(macrosByDay[date].protein),
      carbs: Math.round(macrosByDay[date].carbs),
      fats: Math.round(macrosByDay[date].fats),
      targetCalories: 2100, // This should come from user goals
      actualCalories: Math.round(caloriesByDay[date]),
    }));

    setNutritionData(nutritionChartData);

    // Calculate average macro distribution
    const totalMacros = {
      protein: 0,
      carbs: 0,
      fats: 0,
    };

    meals.forEach(meal => {
      totalMacros.protein += meal.macros?.protein || 0;
      totalMacros.carbs += meal.macros?.carbs || 0;
      totalMacros.fats += meal.macros?.fats || 0;
    });

    const total = totalMacros.protein + totalMacros.carbs + totalMacros.fats;
    const macroDist = [
      { name: 'Protein', value: total > 0 ? Math.round((totalMacros.protein / total) * 100) : 30, color: '#ef4444' },
      { name: 'Carbs', value: total > 0 ? Math.round((totalMacros.carbs / total) * 100) : 50, color: '#3b82f6' },
      { name: 'Fats', value: total > 0 ? Math.round((totalMacros.fats / total) * 100) : 20, color: '#f59e0b' },
    ];

    setMacroDistributionData(macroDist);

    // Find most consistent meal type
    const mealTypeCount = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      Snack: 0,
    };

    meals.forEach(meal => {
      if (Object.prototype.hasOwnProperty.call(mealTypeCount, meal.mealType)) {
        mealTypeCount[meal.mealType]++;
      }
    });

    const mostConsistent = Object.entries(mealTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    setNutritionStats({ mostConsistentMeal: mostConsistent });
  };

  const generateCorrelations = () => {
    // Mock correlation data for now (would need more sophisticated analysis)
    setSleepWorkoutData([
      { sleep: 5, performance: 60 },
      { sleep: 6, performance: 70 },
      { sleep: 6.5, performance: 75 },
      { sleep: 7, performance: 85 },
      { sleep: 7.5, performance: 90 },
      { sleep: 8, performance: 95 },
      { sleep: 8.5, performance: 92 },
    ]);

    setDietWeightData([
      { adherence: 60, weightLoss: 0.2 },
      { adherence: 70, weightLoss: 0.3 },
      { adherence: 75, weightLoss: 0.35 },
      { adherence: 80, weightLoss: 0.4 },
      { adherence: 85, weightLoss: 0.45 },
      { adherence: 90, weightLoss: 0.5 },
      { adherence: 95, weightLoss: 0.55 },
    ]);
  };

  const generatePredictions = (workouts, meals, weights) => {
    if (weights.length < 2) {
      setWeightForecastData([]);
      setPredictions({
        achievementProbability: 0,
        recommendedAdjustments: [
          'Log more weight entries to see predictions',
          'Track your workouts consistently',
          'Monitor your daily meals',
        ],
      });
      return;
    }

    // Generate weight forecast
    const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentWeight = sortedWeights[sortedWeights.length - 1].weight;
    
    // Calculate average weekly change
    const totalChange = sortedWeights[sortedWeights.length - 1].weight - sortedWeights[0].weight;
    const totalDays = (new Date(sortedWeights[sortedWeights.length - 1].date) - new Date(sortedWeights[0].date)) / (1000 * 60 * 60 * 24);
    const weeklyChange = (totalChange / totalDays) * 7;

    const forecastData = [
      { week: 'Current', actual: currentWeight, forecast: currentWeight, upper: currentWeight, lower: currentWeight },
      { week: 'Week +1', actual: null, forecast: currentWeight - weeklyChange, upper: currentWeight - weeklyChange + 0.4, lower: currentWeight - weeklyChange - 0.4 },
      { week: 'Week +2', actual: null, forecast: currentWeight - weeklyChange * 2, upper: currentWeight - weeklyChange * 2 + 0.6, lower: currentWeight - weeklyChange * 2 - 0.6 },
      { week: 'Week +3', actual: null, forecast: currentWeight - weeklyChange * 3, upper: currentWeight - weeklyChange * 3 + 0.8, lower: currentWeight - weeklyChange * 3 - 0.8 },
      { week: 'Week +4', actual: null, forecast: currentWeight - weeklyChange * 4, upper: currentWeight - weeklyChange * 4 + 1.0, lower: currentWeight - weeklyChange * 4 - 1.0 },
    ];

    setWeightForecastData(forecastData);

    // Calculate achievement probability
    const workoutConsistency = workouts.length / 30; // workouts per day
    const mealConsistency = meals.length / 90; // meals per day
    const probability = Math.min(Math.round((workoutConsistency * 40 + mealConsistency * 60) * 100), 99);

    // Generate recommendations based on patterns
    const recommendations = [];
    
    if (workouts.length < 12) {
      recommendations.push('Increase workout frequency to at least 4 sessions per week');
    }
    
    if (meals.length < 60) {
      recommendations.push('Try to log more meals to track nutrition better');
    }
    
    if (Math.abs(weeklyChange) < 0.2) {
      recommendations.push('Consider adjusting your calorie intake to break through plateau');
    }
    
    if (workoutConsistency < 0.4) {
      recommendations.push('Focus on consistency - even short workouts help');
    }

    setPredictions({
      achievementProbability: probability || 75,
      recommendedAdjustments: recommendations.length > 0 ? recommendations : [
        'Keep up the great work!',
        'Maintain your current routine',
        'Stay consistent with your habits',
      ],
    });
  };

  const generateHeatMap = (workouts) => {
    const heatMap = [];
    const weeks = 8;
    const days = 7;

    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < days; day++) {
        // Find workouts for this day (simplified)
        const hasWorkout = workouts.some(w => {
          const date = new Date(w.date);
          const dayDiff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
          return dayDiff >= week * 7 + day && dayDiff < (week + 1) * 7 + day;
        });

        const intensity = hasWorkout ? Math.floor(Math.random() * 4) + 1 : 0;
        heatMap.push({
          week,
          day,
          intensity,
        });
      }
    }

    setHeatMapData(heatMap);
  };

  const setMockData = () => {
    // Fallback mock data
    setWorkoutByDayData([
      { day: 'Mon', workouts: 12 },
      { day: 'Tue', workouts: 15 },
      { day: 'Wed', workouts: 10 },
      { day: 'Thu', workouts: 14 },
      { day: 'Fri', workouts: 13 },
      { day: 'Sat', workouts: 8 },
      { day: 'Sun', workouts: 6 },
    ]);

    setWorkoutTypesData([
      { name: 'Cardio', value: 35 },
      { name: 'Strength', value: 40 },
      { name: 'Yoga', value: 15 },
      { name: 'HIIT', value: 10 },
    ]);

    setMacroDistributionData([
      { name: 'Protein', value: 30, color: '#ef4444' },
      { name: 'Carbs', value: 50, color: '#3b82f6' },
      { name: 'Fats', value: 20, color: '#f59e0b' },
    ]);

    setWeightAnalysisData([
      { date: 'Jan 1', weight: 85, movingAvg: 85, trend: 85 },
      { date: 'Jan 8', weight: 84.5, movingAvg: 84.7, trend: 84.5 },
      { date: 'Jan 15', weight: 84.2, movingAvg: 84.4, trend: 84 },
      { date: 'Jan 22', weight: 83.8, movingAvg: 84.1, trend: 83.5 },
      { date: 'Jan 29', weight: 83.5, movingAvg: 83.8, trend: 83 },
      { date: 'Feb 5', weight: 83.1, movingAvg: 83.5, trend: 82.5 },
      { date: 'Feb 12', weight: 82.8, movingAvg: 83.2, trend: 82 },
      { date: 'Feb 19', weight: 82.5, movingAvg: 82.9, trend: 81.5 },
    ]);

    setNutritionData([
      { date: 'Mon', protein: 150, carbs: 200, fats: 60, targetCalories: 2100, actualCalories: 2050 },
      { date: 'Tue', protein: 160, carbs: 180, fats: 65, targetCalories: 2100, actualCalories: 2100 },
      { date: 'Wed', protein: 145, carbs: 210, fats: 55, targetCalories: 2100, actualCalories: 2000 },
      { date: 'Thu', protein: 155, carbs: 190, fats: 70, targetCalories: 2100, actualCalories: 2150 },
      { date: 'Fri', protein: 150, carbs: 220, fats: 50, targetCalories: 2100, actualCalories: 2080 },
      { date: 'Sat', protein: 140, carbs: 200, fats: 60, targetCalories: 2100, actualCalories: 2000 },
      { date: 'Sun', protein: 135, carbs: 230, fats: 55, targetCalories: 2100, actualCalories: 2120 },
    ]);

    setWeightForecastData([
      { week: 'Current', actual: 82.5, forecast: 82.5, upper: 82.5, lower: 82.5 },
      { week: 'Week +1', actual: null, forecast: 82.1, upper: 82.5, lower: 81.7 },
      { week: 'Week +2', actual: null, forecast: 81.7, upper: 82.3, lower: 81.1 },
      { week: 'Week +3', actual: null, forecast: 81.3, upper: 82.0, lower: 80.6 },
      { week: 'Week +4', actual: null, forecast: 80.9, upper: 81.7, lower: 80.1 },
    ]);

    setSleepWorkoutData([
      { sleep: 5, performance: 60 },
      { sleep: 6, performance: 70 },
      { sleep: 6.5, performance: 75 },
      { sleep: 7, performance: 85 },
      { sleep: 7.5, performance: 90 },
      { sleep: 8, performance: 95 },
      { sleep: 8.5, performance: 92 },
    ]);

    setDietWeightData([
      { adherence: 60, weightLoss: 0.2 },
      { adherence: 70, weightLoss: 0.3 },
      { adherence: 75, weightLoss: 0.35 },
      { adherence: 80, weightLoss: 0.4 },
      { adherence: 85, weightLoss: 0.45 },
      { adherence: 90, weightLoss: 0.5 },
      { adherence: 95, weightLoss: 0.55 },
    ]);

    setOverviewStats({
      totalWorkouts: 78,
      totalMeals: 186,
      weightChange: -2.5,
      habitScoreAvg: 82,
    });

    setWeightAnalysis({
      rateOfChange: -0.44,
      plateauDetected: false,
    });

    setWorkoutPatterns({
      mostConsistent: 'Tuesday',
      leastConsistent: 'Sunday',
    });

    setNutritionStats({
      mostConsistentMeal: 'Breakfast',
    });

    setPredictions({
      achievementProbability: 87,
      recommendedAdjustments: [
        'Increase protein intake by 10g on rest days',
        'Add one more cardio session on weekends',
        'Maintain current sleep schedule (7-8 hours)',
      ],
    });

    const heatMap = [];
    for (let week = 0; week < 8; week++) {
      for (let day = 0; day < 7; day++) {
        heatMap.push({
          week,
          day,
          intensity: Math.floor(Math.random() * 5),
        });
      }
    }
    setHeatMapData(heatMap);
  };

  const getHeatMapColor = (intensity) => {
    const colors = ['#f3f4f6', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'];
    return colors[intensity] || colors[0];
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleGenerateReport = () => {
    // Prepare data for export
    const reportData = {
      overview: overviewStats,
      weightAnalysis,
      workoutPatterns,
      nutrition: nutritionStats,
      predictions,
      generatedAt: new Date().toISOString(),
    };
    
    console.log('Report data:', reportData);
    toast.success('Report generated! Check console for data.');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="analytics-page">
        {/* SECTION 1: PAGE HEADER */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Advanced Analytics</h1>
            <div className="date-range-selector">
              <select value={dateRange} onChange={handleDateRangeChange}>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last 1 year</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>

        {/* SECTION 2: OVERVIEW STATS */}
        <div className="overview-section">
          <div className="overview-stats">
            <div className="overview-card">
              <div className="overview-icon">🏋️</div>
              <div className="overview-content">
                <span className="overview-label">Total Workouts</span>
                <span className="overview-value">{overviewStats.totalWorkouts}</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">🍽️</div>
              <div className="overview-content">
                <span className="overview-label">Total Meals Logged</span>
                <span className="overview-value">{overviewStats.totalMeals}</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⚖️</div>
              <div className="overview-content">
                <span className="overview-label">Weight Change</span>
                <span className={`overview-value ${overviewStats.weightChange < 0 ? 'positive' : 'negative'}`}>
                  {overviewStats.weightChange > 0 ? '+' : ''}{overviewStats.weightChange} kg
                </span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⭐</div>
              <div className="overview-content">
                <span className="overview-label">Habit Score Average</span>
                <span className="overview-value">{overviewStats.habitScoreAvg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WEIGHT ANALYSIS */}
        <div className="analytics-section">
          <h2>Weight Analysis</h2>
          
          <div className="weight-analysis-stats">
            <div className="stat-item">
              <span className="stat-label">Rate of Change</span>
              <span className="stat-value">{weightAnalysis.rateOfChange} kg/week</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Plateau Detection</span>
              <span className={`stat-value ${weightAnalysis.plateauDetected ? 'alert' : 'success'}`}>
                {weightAnalysis.plateauDetected ? 'Plateau Detected' : 'On Track'}
              </span>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={weightAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={2} name="Actual Weight" />
                <Line type="monotone" dataKey="movingAvg" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="7-Day Moving Avg" />
                <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="Trend Line" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4: WORKOUT PATTERNS */}
        <div className="analytics-section">
          <h2>Workout Patterns</h2>
          
          <div className="workout-pattern-stats">
            <div className="stat-item">
              <span className="stat-label">Most Consistent Day</span>
              <span className="stat-value">{workoutPatterns.mostConsistent}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Least Consistent Day</span>
              <span className="stat-value">{workoutPatterns.leastConsistent}</span>
            </div>
          </div>

          <div className="dual-chart-grid">
            <div className="chart-container">
              <h3>Workouts by Day of Week</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutByDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Workout Types Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workoutTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {workoutTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Consistency Calendar (Heat Map)</h3>
            <div className="heatmap-container">
              <div className="heatmap-grid">
                {heatMapData.map((cell, idx) => (
                  <div
                    key={idx}
                    className="heatmap-cell"
                    style={{ backgroundColor: getHeatMapColor(cell.intensity) }}
                    title={`Week ${cell.week + 1}, Day ${cell.day + 1}: Intensity ${cell.intensity}`}
                  />
                ))}
              </div>
              <div className="heatmap-legend">
                <span>Less</span>
                <div className="legend-colors">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="legend-cell" style={{ backgroundColor: getHeatMapColor(i) }} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: NUTRITION ANALYSIS */}
        <div className="analytics-section">
          <h2>Nutrition Analysis</h2>
          
          <div className="nutrition-stats">
            <div className="stat-item">
              <span className="stat-label">Most Consistent Meal</span>
              <span className="stat-value">{nutritionStats.mostConsistentMeal}</span>
            </div>
          </div>

          <div className="dual-chart-grid">
            <div className="chart-container">
              <h3>Daily Macros Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" stackId="a" fill="#ef4444" name="Protein (g)" />
                  <Bar dataKey="carbs" stackId="a" fill="#3b82f6" name="Carbs (g)" />
                  <Bar dataKey="fats" stackId="a" fill="#f59e0b" name="Fats (g)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Average Macro Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macroDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Calorie Intake vs. Target</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="targetCalories" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                <Line type="monotone" dataKey="actualCalories" stroke="#10b981" strokeWidth={2} name="Actual Intake" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 6: CORRELATION INSIGHTS */}
        <div className="analytics-section correlation-section">
          <h2>What Affects Your Progress?</h2>
          
          <div className="dual-chart-grid">
            <div className="chart-container">
              <h3>Sleep vs. Workout Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sleep" name="Sleep Hours" unit="h" />
                  <YAxis dataKey="performance" name="Performance" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Sleep Impact" data={sleepWorkoutData} fill="#4f46e5" />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="insight-text">💡 Better sleep (7-8h) correlates with 90%+ performance</p>
            </div>

            <div className="chart-container">
              <h3>Diet Adherence vs. Weight Loss</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="adherence" name="Adherence" unit="%" />
                  <YAxis dataKey="weightLoss" name="Weight Loss" unit="kg" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Diet Impact" data={dietWeightData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="insight-text">💡 85%+ diet adherence yields optimal weight loss</p>
            </div>
          </div>

          <div className="correlation-summary">
            <div className="correlation-card">
              <h4>🌙 Sleep Quality</h4>
              <p>Strong positive correlation with workout performance</p>
            </div>
            <div className="correlation-card">
              <h4>🥗 Diet Adherence</h4>
              <p>Direct impact on weight loss rate</p>
            </div>
            <div className="correlation-card">
              <h4>⚡ Energy Levels</h4>
              <p>Moderate correlation with workout completion</p>
            </div>
          </div>
        </div>

        {/* SECTION 7: TRENDS & PREDICTIONS */}
        <div className="analytics-section predictions-section">
          <h2>Trends & Predictions</h2>
          
          <div className="chart-container">
            <h3>Weight Forecast (Next 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={weightForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="upper" fill="#e0e7ff" stroke="none" name="Confidence Range" />
                <Area type="monotone" dataKey="lower" fill="#ffffff" stroke="none" />
                <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Forecast" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="predictions-content">
            <div className="achievement-probability">
              <div className="probability-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray={`${predictions.achievementProbability * 2.827} 282.7`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="probability-text">
                  <span className="probability-value">{predictions.achievementProbability}%</span>
                  <span className="probability-label">Achievement Probability</span>
                </div>
              </div>
            </div>

            <div className="recommendations">
              <h3>Recommended Adjustments</h3>
              <ul className="recommendations-list">
                {predictions.recommendedAdjustments.map((adjustment, idx) => (
                  <li key={idx}>
                    <span className="recommendation-icon">✓</span>
                    {adjustment}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <style jsx="true">{`
          .analytics-page {
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            background: #f9fafb;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
            margin: 0;
          }

          .date-range-selector select {
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            background: white;
            color: #374151;
            transition: all 0.2s;
          }

          .date-range-selector select:hover {
            border-color: #4f46e5;
          }

          .date-range-selector select:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.95rem;
          }

          .btn-primary {
            background: #4f46e5;
            color: white;
          }

          .btn-primary:hover {
            background: #4338ca;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }

          .overview-section {
            margin-bottom: 2rem;
          }

          .overview-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .overview-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: transform 0.2s;
          }

          .overview-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .overview-icon {
            font-size: 2.5rem;
          }

          .overview-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .overview-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
          }

          .overview-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: #111827;
          }

          .overview-value.positive {
            color: #10b981;
          }

          .overview-value.negative {
            color: #ef4444;
          }

          .analytics-section {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .analytics-section h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
            margin: 0 0 1.5rem 0;
          }

          .analytics-section h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #374151;
            margin: 0 0 1rem 0;
          }

          .weight-analysis-stats,
          .workout-pattern-stats,
          .nutrition-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 1.5rem;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .stat-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
          }

          .stat-value.success {
            color: #10b981;
          }

          .stat-value.alert {
            color: #ef4444;
          }

          .chart-container {
            background: #fafafa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .dual-chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .heatmap-container {
            padding: 1rem;
          }

          .heatmap-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-bottom: 1rem;
          }

          .heatmap-cell {
            aspect-ratio: 1;
            border-radius: 3px;
            border: 1px solid #e5e7eb;
            transition: transform 0.2s;
            cursor: pointer;
          }

          .heatmap-cell:hover {
            transform: scale(1.1);
            border-color: #4f46e5;
          }

          .heatmap-legend {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #6b7280;
          }

          .legend-colors {
            display: flex;
            gap: 3px;
          }

          .legend-cell {
            width: 16px;
            height: 16px;
            border-radius: 2px;
            border: 1px solid #e5e7eb;
          }

          .insight-text {
            margin-top: 0.75rem;
            padding: 0.75rem;
            background: #f0fdf4;
            border-left: 3px solid #10b981;
            border-radius: 4px;
            font-size: 0.875rem;
            color: #166534;
            font-weight: 500;
          }

          .correlation-section .correlation-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .correlation-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1.5rem;
            border-radius: 10px;
            color: white;
          }

          .correlation-card h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
          }

          .correlation-card p {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.95;
          }

          .predictions-section .predictions-content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            margin-top: 1.5rem;
          }

          .achievement-probability {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .probability-circle {
            position: relative;
            width: 200px;
            height: 200px;
          }

          .probability-circle svg {
            width: 100%;
            height: 100%;
          }

          .probability-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            display: flex;
            flex-direction: column;
          }

          .probability-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #10b981;
          }

          .probability-label {
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 500;
          }

          .recommendations {
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 8px;
          }

          .recommendations h3 {
            margin: 0 0 1rem 0;
            color: #111827;
          }

          .recommendations-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .recommendations-list li {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #10b981;
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            font-size: 0.95rem;
            color: #374151;
          }

          .recommendation-icon {
            color: #10b981;
            font-weight: 700;
          }

          @media (max-width: 768px) {
            .analytics-page {
              padding: 1rem;
            }

            .page-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .header-left {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
              width: 100%;
            }

            .btn {
              width: 100%;
            }

            .page-title {
              font-size: 1.5rem;
            }

            .analytics-section {
              padding: 1.5rem;
            }

            .dual-chart-grid {
              grid-template-columns: 1fr;
            }

            .predictions-content {
              grid-template-columns: 1fr !important;
            }

            .overview-stats {
              grid-template-columns: 1fr;
            }

            .overview-value {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
