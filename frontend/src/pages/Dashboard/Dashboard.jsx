import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiStar, FiActivity, FiCheck, FiArrowRight,
  FiEdit3, FiTrendingUp, FiTrendingDown, FiZap,
  FiMessageSquare, FiCalendar
} from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { IoFlame, IoRestaurant } from 'react-icons/io5';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState('Alex');
  const [scrollY, setScrollY] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  // Mock data
  const userData = {
    habitScore: 78,
    weight: 72.5,
    weightChange: -2.3,
    calories: 1850,
    caloriesTarget: 2200,
    workoutFocus: 'Chest & Triceps',
    exercisesToday: 6,
    streak: 15,
    startWeight: 85,
    goalWeight: 70,
    currentWeight: 72.5
  };

  const todayExercises = [
    { id: 1, name: 'Bench Press', sets: 4, reps: 8, focus: 'Chest' },
    { id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: 10, focus: 'Chest' },
    { id: 3, name: 'Cable Flyes', sets: 3, reps: 12, focus: 'Chest' },
    { id: 4, name: 'Tricep Dips', sets: 3, reps: 10, focus: 'Triceps' },
    { id: 5, name: 'Rope Pushdowns', sets: 3, reps: 12, focus: 'Triceps' },
    { id: 6, name: 'Overhead Extension', sets: 3, reps: 12, focus: 'Triceps' }
  ];

  const macros = {
    protein: { current: 145, target: 160, color: 'bg-red-500' },
    carbs: { current: 215, target: 250, color: 'bg-blue-500' },
    fat: { current: 62, target: 73, color: 'bg-yellow-500' }
  };

  const weeklyStats = {
    workoutCompletion: 85,
    dietAdherence: 72,
    energyLevel: 'Good'
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleExerciseComplete = (id) => {
    setCompletedExercises(prev =>
      prev.includes(id) ? prev.filter(ex => ex !== id) : [...prev, id]
    );
  };

  const progressPercentage = ((userData.currentWeight - userData.startWeight) / (userData.goalWeight - userData.startWeight)) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-100 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-purple-100 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* SECTION 1: WELCOME SECTION */}
        <div className="mb-8 animate-fadeInDown">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {userName}!
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border border-orange-200">
              <IoFlame className="w-8 h-8 text-orange-500 animate-bounce-subtle" />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-3xl font-bold text-orange-500">{userData.streak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: QUICK STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Habit Score Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-yellow-100 rounded-xl p-3">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm font-semibold text-yellow-600">+5</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Habit Score</h3>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">{userData.habitScore}</p>
              <p className="text-xs text-gray-500">out of 100</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${userData.habitScore}%` }}
              ></div>
            </div>
          </div>

          {/* Current Weight Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <FiTrendingDown className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-sm font-semibold ${userData.weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {userData.weightChange < 0 ? '↓' : '↑'} {Math.abs(userData.weightChange)} kg
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Current Weight</h3>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">{userData.weight}</p>
              <p className="text-xs text-gray-500">kg</p>
            </div>
            <p className="text-xs text-green-600 font-semibold">From start: {userData.weightChange} kg</p>
          </div>

          {/* Calories Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-red-100 rounded-xl p-3">
                <FiZap className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-red-600">{Math.round((userData.calories / userData.caloriesTarget) * 100)}%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Calories</h3>
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">{userData.calories}</p>
              <p className="text-xs text-gray-500">of {userData.caloriesTarget} kcal</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userData.calories / userData.caloriesTarget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Workout Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 rounded-xl p-3">
                <GiWeightLiftingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-purple-600">Today</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Workout</h3>
            <div className="mb-3">
              <p className="text-lg font-bold text-gray-900">{userData.workoutFocus}</p>
              <p className="text-xs text-gray-500">{userData.exercisesToday} exercises</p>
            </div>
            <div className="flex items-center gap-1 text-purple-600 text-xs font-semibold">
              <FiCheck className="w-3 h-3" />
              <span>In Progress</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: TODAY'S WORKOUT */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <GiWeightLiftingUp className="w-6 h-6 text-blue-600" />
                Today's Workout
              </h2>
              <div className="mt-2 inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                {userData.workoutFocus}
              </div>
            </div>
            <button
              onClick={() => navigate('/workout')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group"
            >
              View All
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {todayExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 animate-slideInRight"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => handleExerciseComplete(exercise.id)}
                  className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    completedExercises.includes(exercise.id)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {completedExercises.includes(exercise.id) && (
                    <FiCheck className="w-4 h-4 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-semibold transition-all ${completedExercises.includes(exercise.id) ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {exercise.name}
                  </p>
                  <p className="text-sm text-gray-500">{exercise.focus}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{exercise.sets} × {exercise.reps}</p>
                  <p className="text-xs text-gray-500">Sets × Reps</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/workout')}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <FiEdit3 className="w-5 h-5" />
            Log Workout
          </button>
        </div>

        {/* SECTION 4: TODAY'S NUTRITION */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <IoRestaurant className="w-6 h-6 text-green-600" />
              Today's Nutrition
            </h2>
            <button
              onClick={() => navigate('/diet')}
              className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2 group"
            >
              View All
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Protein', current: macros.protein.current, target: macros.protein.target, color: 'bg-red-500', unit: 'g' },
              { label: 'Carbs', current: macros.carbs.current, target: macros.carbs.target, color: 'bg-blue-500', unit: 'g' },
              { label: 'Fat', current: macros.fat.current, target: macros.fat.target, color: 'bg-yellow-500', unit: 'g' }
            ].map((macro, index) => (
              <div
                key={macro.label}
                className="p-6 bg-gray-50 rounded-xl animate-fadeInUp"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <p className="text-sm font-semibold text-gray-600 mb-2">{macro.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {macro.current}
                  <span className="text-sm text-gray-500 ml-1">{macro.unit}</span>
                </p>
                <p className="text-xs text-gray-500 mb-3">of {macro.target}g</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${macro.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/diet')}
            className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <FiEdit3 className="w-5 h-5" />
            Log Meal
          </button>
        </div>

        {/* SECTION 5: PROGRESS SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FiTrendingUp className="w-6 h-6 text-indigo-600" />
              Progress Summary
            </h2>
            <button
              onClick={() => navigate('/progress')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2 group"
            >
              View All
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Weight Progress */}
          <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Weight Goal Progress</h3>
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold">{userData.startWeight}</span> kg
              </span>
              <span className="text-gray-600">
                <span className="font-semibold">{userData.currentWeight}</span> kg
              </span>
              <span className="text-indigo-600 font-semibold">
                Goal: <span>{userData.goalWeight}</span> kg
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(progressPercentage, 100))}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {Math.max(0, Math.min(progressPercentage, 100)).toFixed(1)}% Complete
            </p>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Workout Completion', value: weeklyStats.workoutCompletion, color: 'from-purple-500 to-pink-500' },
              { label: 'Diet Adherence', value: weeklyStats.dietAdherence, color: 'from-green-500 to-emerald-500' },
              { label: 'Energy Level', value: weeklyStats.energyLevel, isText: true }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="p-4 bg-gray-50 rounded-xl animate-fadeInUp"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
                {stat.isText ? (
                  <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-linear-to-r ${stat.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${stat.value}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          {[
            { label: 'Log Workout', icon: GiWeightLiftingUp, color: 'from-blue-500 to-indigo-500', action: '/workout' },
            { label: 'Log Meal', icon: IoRestaurant, color: 'from-green-500 to-emerald-500', action: '/diet' },
            { label: 'Update Weight', icon: FiTrendingDown, color: 'from-purple-500 to-pink-500', action: '/progress' },
            { label: 'Ask AI', icon: FiMessageSquare, color: 'from-orange-500 to-red-500', action: '/chat' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.action)}
                className={`bg-linear-to-r ${action.color} text-white font-semibold py-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 flex flex-col items-center gap-3 group animate-slideInUp`}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 group-hover:scale-125 transition-transform duration-300" />
                <span>{action.label}</span>
                <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx="true">{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;