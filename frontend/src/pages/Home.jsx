import React, { useState, useEffect } from 'react';
import { 
  FiActivity, FiTrendingUp, FiCalendar, FiDroplet, 
  FiClock, FiAward, FiTarget, FiHeart, FiZap,
  FiArrowRight, FiCheckCircle, FiBarChart2,
  FiSun, FiMoon, FiChevronRight, FiChevronLeft, FiPlay, FiPause,
  FiCoffee, FiMapPin, FiPhone, FiMail,
  FiAlertCircle, FiThermometer, FiHeart as FiHeartIcon,
  FiGitPullRequest, FiClipboard, FiFileText,
  FiVideo, FiCamera, FiUpload, FiDownload,
  FiShare2, FiBookmark, FiMoreVertical,
  FiRefreshCw, FiPlus, FiMinus, FiCheck
} from 'react-icons/fi';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedEnergy, setSelectedEnergy] = useState('');
  const [waterIntake, setWaterIntake] = useState(5);
  const [completedExercises, setCompletedExercises] = useState([1]);
  const [completedMeals, setCompletedMeals] = useState([0]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock user data based on your schema
  const userData = {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    mobileNumber: '+1 234 567 8900',
    dob: '1990-05-15',
    gender: 'male',
    address: '123 Fitness Street',
    city: 'New York',
    pin: '10001',
    photo: {
      url: '',
      publicID: ''
    },
    
    healthData: {
      vitals: {
        height: 175,
        weight: 72.5,
        bmi: 23.7,
        bloodGroup: 'O+',
        heartRate: 72,
        bloodPressure: '120/80',
        oxygenSaturation: 98,
        temperature: 36.6
      },
      medicalHistory: {
        chronicDiseases: ['None'],
        surgeries: ['None'],
        allergies: ['Pollen', 'Dust']
      },
      medications: {
        currentMedications: ['Vitamin D', 'Protein Supplement'],
        pastMedications: []
      },
      lifestyle: {
        smoking: false,
        alcohol: false,
        exerciseFrequency: 'Regular',
        diet: 'Balanced Diet'
      },
      labReports: [
        {
          reportName: 'Blood Test',
          reportDate: '2024-02-15',
          result: 'Normal',
          fileUrl: ''
        }
      ],
      appointments: [
        {
          doctorName: 'Dr. Sarah Smith',
          specialization: 'General Physician',
          appointmentDate: '2024-03-20',
          notes: 'Annual checkup'
        }
      ],
      vaccinations: [
        {
          vaccineName: 'COVID-19',
          dose: 'Booster',
          date: '2023-12-10'
        }
      ],
      emergencyContacts: [
        {
          name: 'Jane Johnson',
          relation: 'Spouse',
          phone: '+1 234 567 8901'
        }
      ]
    },

    documents: {
      gst: 'N/A',
      uidai: '1234-5678-9012',
      pan: 'ABCDE1234F'
    },

    isActive: 'active'
  };

  // Motivational quotes
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you need to convince.",
    "The hard days are the best because that's when champions are made.",
    "Strive for progress, not perfection.",
    "You are stronger than you think!"
  ];

  // Mock workout
  const todaysWorkout = {
    day: 'Monday',
    focus: 'Upper Body',
    duration: '45 min',
    difficulty: 'Intermediate',
    calories: 320,
    exercises: [
      { id: 0, name: 'Push-ups', sets: 3, reps: 12, completed: false, emoji: '💪' },
      { id: 1, name: 'Pull-ups', sets: 3, reps: 8, completed: true, emoji: '🏋️' },
      { id: 2, name: 'Shoulder Press', sets: 3, reps: 10, completed: false, emoji: '🏋️‍♂️' },
      { id: 3, name: 'Bicep Curls', sets: 3, reps: 12, completed: false, emoji: '💪' }
    ]
  };

  // Mock meals
  const todaysMeals = [
    { id: 0, type: 'Breakfast', calories: 450, protein: 30, carbs: 45, fat: 15, completed: true, icon: '🍳', time: '8:00 AM' },
    { id: 1, type: 'Lunch', calories: 550, protein: 35, carbs: 60, fat: 20, completed: false, icon: '🥗', time: '12:30 PM' },
    { id: 2, type: 'Dinner', calories: 600, protein: 40, carbs: 70, fat: 22, completed: false, icon: '🍽️', time: '7:00 PM' },
    { id: 3, type: 'Snack', calories: 200, protein: 10, carbs: 25, fat: 8, completed: false, icon: '🥤', time: '4:00 PM' }
  ];

  // Upcoming workouts
  const upcomingWorkouts = [
    { day: 'Tuesday', workout: 'Lower Body', time: '9:00 AM', intensity: 'High', icon: '🏋️' },
    { day: 'Wednesday', workout: 'Cardio', time: '8:30 AM', intensity: 'Medium', icon: '🏃' },
    { day: 'Thursday', workout: 'Upper Body', time: '10:00 AM', intensity: 'High', icon: '💪' },
    { day: 'Friday', workout: 'Rest Day', time: '-', intensity: 'Recovery', icon: '😴' },
    { day: 'Saturday', workout: 'Full Body', time: '9:00 AM', intensity: 'High', icon: '🏋️‍♂️' },
    { day: 'Sunday', workout: 'Active Recovery', time: '4:00 PM', intensity: 'Low', icon: '🧘' }
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setGreetingIcon(<FiSun className="w-6 h-6 text-yellow-500" />);
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
      setGreetingIcon(<FiSun className="w-6 h-6 text-orange-500" />);
    } else {
      setGreeting('Good Evening');
      setGreetingIcon(<FiMoon className="w-6 h-6 text-indigo-500" />);
    }

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const toggleExercise = (id) => {
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(i => i !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const toggleMeal = (id) => {
    if (completedMeals.includes(id)) {
      setCompletedMeals(completedMeals.filter(i => i !== id));
    } else {
      setCompletedMeals([...completedMeals, id]);
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-500', bg: 'bg-green-100' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { text: 'Obese', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const unreadCount = 2;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* SECTION 1: Welcome Banner */}
        {showWelcome && (
          <section className="mb-8 animate-fadeInDown">
            <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-1000"></div>
              
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm animate-bounce">
                    {greetingIcon}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold flex items-center">
                      {greeting}, {userData.fullName}! 
                      <span className="ml-3 animate-wave inline-block text-4xl">👋</span>
                    </h1>
                    <p className="text-white/90 mt-2 text-lg italic font-light">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-110"
                >
                  ✕
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: User Profile Card */}
        <section className="mb-8 animate-fadeInUp">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center space-x-6 flex-1">
                <div className="relative">
                  <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userData.fullName.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200">
                    <FiCamera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{userData.fullName}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      <FiMail className="w-4 h-4 mr-2 text-blue-600" /> {userData.email}
                    </span>
                    <span className="flex items-center text-sm text-gray-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <FiPhone className="w-4 h-4 mr-2 text-indigo-600" /> {userData.mobileNumber}
                    </span>
                    <span className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                      <FiMapPin className="w-4 h-4 mr-2 text-purple-600" /> {userData.city}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                  🎂 Age: {calculateAge(userData.dob)}
                </span>
                <span className="px-4 py-2 bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                  👤 {userData.gender === 'male' ? 'Male' : 'Female'}
                </span>
                <span className="px-4 py-2 bg-linear-to-r from-red-50 to-pink-50 text-red-700 rounded-full text-sm font-semibold border border-red-200">
                  🩸 {userData.healthData.vitals.bloodGroup}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-3 pt-6 border-t border-gray-100">
              <button className="flex-1 bg-linear-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 py-3 rounded-xl text-sm font-semibold text-blue-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 shadow-sm">
                <FiShare2 className="w-4 h-4" /> Share
              </button>
              <button className="flex-1 bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 py-3 rounded-xl text-sm font-semibold text-purple-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 shadow-sm">
                <FiBookmark className="w-4 h-4" /> Save
              </button>
              <button className="flex-1 bg-linear-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 shadow-sm">
                <FiMoreVertical className="w-4 h-4" /> More
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: Health Metrics Grid */}
        <section className="mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            Health Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* BMI Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">BMI</p>
                  <p className="text-4xl font-bold text-gray-800">{userData.healthData.vitals.bmi}</p>
                </div>
                <div className="bg-linear-to-br from-blue-100 to-blue-200 p-3 rounded-xl group-hover:rotate-12 transition-transform">
                  <FiBarChart2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className={`text-sm font-semibold ${getBmiCategory(userData.healthData.vitals.bmi).color}`}>
                {getBmiCategory(userData.healthData.vitals.bmi).text}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                H: {userData.healthData.vitals.height}cm | W: {userData.healthData.vitals.weight}kg
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">Heart Rate</p>
                  <p className="text-4xl font-bold text-gray-800">{userData.healthData.vitals.heartRate}</p>
                </div>
                <div className="bg-linear-to-br from-red-100 to-pink-200 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <FiHeartIcon className="w-6 h-6 text-red-600 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">bpm • Normal</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">Resting rate</div>
            </div>

            {/* Blood Pressure Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">Blood Pressure</p>
                  <p className="text-4xl font-bold text-gray-800">{userData.healthData.vitals.bloodPressure}</p>
                </div>
                <div className="bg-linear-to-br from-purple-100 to-purple-200 p-3 rounded-xl group-hover:rotate-12 transition-transform">
                  <FiGitPullRequest className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">mmHg • Normal</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">Systolic/Diastolic</div>
            </div>

            {/* Oxygen Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">O2 Saturation</p>
                  <p className="text-4xl font-bold text-gray-800">{userData.healthData.vitals.oxygenSaturation}%</p>
                </div>
                <div className="bg-linear-to-br from-green-100 to-emerald-200 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <FiDroplet className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">Excellent</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">SpO2 Level</div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Main Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeInUp">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Workout */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-linear-to-b from-indigo-600 to-blue-600 rounded-full"></span>
                Today's Workout
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{todaysWorkout.day} • {todaysWorkout.focus}</p>
                    <p className="text-xs text-gray-400 mt-2">{todaysWorkout.duration} • {todaysWorkout.difficulty}</p>
                  </div>
                  <div className="text-right bg-linear-to-r from-indigo-50 to-blue-50 px-4 py-3 rounded-xl border border-indigo-100">
                    <p className="text-xs text-gray-500 font-medium">Calories</p>
                    <p className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{todaysWorkout.calories}</p>
                  </div>
                </div>

                {/* Workout Timer */}
                <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between border border-indigo-100">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-white shadow-lg hover:scale-110 ${
                        isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-1" />}
                    </button>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-lg font-bold text-gray-800">00:00 / 45:00</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-indigo-600">Active</p>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-3">
                  {todaysWorkout.exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer border-2 ${
                        completedExercises.includes(exercise.id) 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:border-indigo-200'
                      }`}
                      onClick={() => toggleExercise(exercise.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          completedExercises.includes(exercise.id)
                            ? 'bg-green-500 border-green-500 shadow-lg'
                            : 'border-gray-300 hover:border-indigo-400'
                        }`}>
                          {completedExercises.includes(exercise.id) && (
                            <FiCheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <span className="text-2xl">{exercise.emoji}</span>
                        <div>
                          <p className={`text-sm font-semibold ${
                            completedExercises.includes(exercise.id) ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                            {exercise.name}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{exercise.sets} sets × {exercise.reps} reps</p>
                        </div>
                      </div>
                      <button className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        completedExercises.includes(exercise.id)
                          ? 'bg-green-200 text-green-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {completedExercises.includes(exercise.id) ? '✓ Done' : 'Start'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600 mb-3 font-medium">
                    <span>Progress</span>
                    <span className="font-bold text-indigo-600">{completedExercises.length}/{todaysWorkout.exercises.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedExercises.length / todaysWorkout.exercises.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Medical History & Lifestyle */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
                Health Profile
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medical History */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiClipboard className="w-4 h-4 mr-2 text-purple-600" />
                      Medical History
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Chronic Diseases</p>
                        <p className="text-sm font-medium text-gray-800">{userData.healthData.medicalHistory.chronicDiseases.join(', ')}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Allergies</p>
                        <p className="text-sm font-medium text-gray-800">{userData.healthData.medicalHistory.allergies.join(', ')}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Current Medications</p>
                        <p className="text-sm font-medium text-gray-800">{userData.healthData.medications.currentMedications.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiHeart className="w-4 h-4 mr-2 text-purple-600" />
                      Lifestyle
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Exercise Frequency</p>
                        <p className="text-sm font-medium text-gray-800">{userData.healthData.lifestyle.exerciseFrequency}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Diet</p>
                        <p className="text-sm font-medium text-gray-800">{userData.healthData.lifestyle.diet}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Habits</p>
                        <p className="text-sm font-medium text-gray-800">
                          {!userData.healthData.lifestyle.smoking && !userData.healthData.lifestyle.alcohol ? 
                            'Non-smoker, Non-drinker' : 
                            `${userData.healthData.lifestyle.smoking ? 'Smoker' : ''} ${userData.healthData.lifestyle.alcohol ? 'Drinker' : ''}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Appointments & Vaccinations */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-pink-600 rounded-full mr-3"></span>
                Medical Schedule
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Appointments */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2 text-pink-600" />
                      Upcoming Appointment
                    </h3>
                    {userData.healthData.appointments.map((appointment, index) => (
                      <div key={index} className="bg-pink-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{appointment.doctorName}</p>
                        <p className="text-xs text-gray-500 mt-1">{appointment.specialization}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 italic">"{appointment.notes}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Vaccinations */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiFileText className="w-4 h-4 mr-2 text-pink-600" />
                      Recent Vaccination
                    </h3>
                    {userData.healthData.vaccinations.map((vaccine, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{vaccine.vaccineName}</p>
                        <p className="text-xs text-gray-500 mt-1">Dose: {vaccine.dose}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(vaccine.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Quick Check-in */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-green-600 rounded-full mr-3"></span>
                Quick Check-in
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {/* Energy Level */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-3">Energy Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Energized', 'Normal', 'Fatigued', 'Tired'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedEnergy(level)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedEnergy === level
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Water Intake */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-3">Water Intake</label>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <button
                      onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow"
                    >
                      <FiMinus className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <FiDroplet className="w-5 h-5 text-blue-500" />
                      <span className="text-xl font-bold text-gray-800">{waterIntake}</span>
                      <span className="text-xs text-gray-500">/ 8</span>
                    </div>
                    
                    <button
                      onClick={() => setWaterIntake(Math.min(8, waterIntake + 1))}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow"
                    >
                      <FiPlus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors">
                  Save Check-in
                </button>
              </div>
            </section>

            {/* Emergency Contact */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-red-600 rounded-full mr-3"></span>
                Emergency
              </h2>
              <div className="bg-linear-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
                {userData.healthData.emergencyContacts.map((contact, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg mb-1">{contact.name}</h3>
                    <p className="text-sm text-white/80 mb-2">{contact.relation}</p>
                    <p className="text-lg font-semibold flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {contact.phone}
                    </p>
                  </div>
                ))}
                <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                  Call Emergency Contact
                </button>
              </div>
            </section>

            {/* Documents */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-yellow-600 rounded-full mr-3"></span>
                Documents
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">UIDAI</span>
                    <span className="text-sm font-medium text-gray-800">{userData.documents.uidai}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">PAN</span>
                    <span className="text-sm font-medium text-gray-800">{userData.documents.pan}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">GST</span>
                    <span className="text-sm font-medium text-gray-800">{userData.documents.gst}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Lab Reports */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-teal-600 rounded-full mr-3"></span>
                Lab Reports
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {userData.healthData.labReports.map((report, index) => (
                  <div key={index} className="bg-teal-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">{report.reportName}</h3>
                        <p className="text-xs text-gray-500">{new Date(report.reportDate).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-200 text-green-700 rounded-full text-xs">
                        {report.result}
                      </span>
                    </div>
                    <button className="text-teal-600 text-xs font-medium hover:text-teal-700">
                      View Report →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Today's Meals Preview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-linear-to-b from-orange-600 to-amber-600 rounded-full"></span>
                Today's Meals
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-3">
                  {todaysMeals.slice(0, 3).map((meal) => (
                    <div 
                      key={meal.id} 
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        completedMeals.includes(meal.id) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-orange-200'
                      }`}
                      onClick={() => toggleMeal(meal.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="text-3xl">{meal.icon}</span>
                        <div>
                          <p className={`text-sm font-semibold ${
                            completedMeals.includes(meal.id) ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                            {meal.type} • {meal.time}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{meal.calories} kcal • P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g</p>
                        </div>
                      </div>
                      {completedMeals.includes(meal.id) ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">✓ Eaten</span>
                        </div>
                      ) : (
                        <button className="text-xs px-4 py-2 rounded-lg font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 transition-all duration-300 transform hover:scale-105">
                          Log
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="w-full text-indigo-600 text-xs font-semibold py-2 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all duration-300 mt-2">
                    View All Meals →
                  </button>
                </div>
              </div>
            </section>

            {/* Upcoming Workouts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-linear-to-b from-blue-600 to-cyan-600 rounded-full"></span>
                Upcoming Week
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-3">
                  {upcomingWorkouts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full transition-all group-hover:scale-150 ${
                          item.intensity === 'High' ? 'bg-red-500' :
                          item.intensity === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item.day}: {item.workout}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{item.time} • {item.intensity}</p>
                        </div>
                      </div>
                      <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
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
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animate-wave {
          animation: wave 1s infinite;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;