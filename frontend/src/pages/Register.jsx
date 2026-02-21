import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMail, FiLock, FiUser, FiEye, FiEyeOff, 
  FiActivity, FiCalendar, FiDroplet, FiSmartphone 
} from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle registration logic here
    console.log('Registration data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .step-enter {
          animation: slideInFromRight 0.4s ease-out forwards;
        }
      `}</style>
      {/* Main Container */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl flex overflow-hidden relative z-10 animate-fadeInUp">
        
        {/* Left Side - Branding & Progress */}
        <div className="hidden lg:flex lg:w-2/5 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 flex-col relative overflow-hidden animate-slideInLeft">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          
          {/* Logo */}
          <div className="relative z-10 flex items-center space-x-3 group">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
              <FiActivity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="text-white text-2xl font-bold tracking-wide">Healthnexus</span>
          </div>

          {/* Welcome Message */}
          <div className="relative z-10 mt-12">
            <h1 className="text-white text-3xl font-bold">Start Your Journey</h1>
            <p className="text-white/80 mt-3 text-sm leading-relaxed">
              Join thousands of users who are transforming their lives with AI-powered health management.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center space-x-4 transform transition-all duration-300 hover:translate-x-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                ${currentStep >= 1 ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 text-white'}`}>
                1
              </div>
              <div>
                <p className={`text-sm font-medium ${currentStep >= 1 ? 'text-white' : 'text-white/60'}`}>
                  Account Details
                </p>
                <p className={`text-xs ${currentStep >= 1 ? 'text-white/80' : 'text-white/40'}`}>
                  Create your login credentials
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 transform transition-all duration-300 hover:translate-x-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                ${currentStep >= 2 ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 text-white'}`}>
                2
              </div>
              <div>
                <p className={`text-sm font-medium ${currentStep >= 2 ? 'text-white' : 'text-white/60'}`}>
                  Personal Info
                </p>
                <p className={`text-xs ${currentStep >= 2 ? 'text-white/80' : 'text-white/40'}`}>
                  Tell us about yourself
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 transform transition-all duration-300 hover:translate-x-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                ${currentStep >= 3 ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 text-white'}`}>
                3
              </div>
              <div>
                <p className={`text-sm font-medium ${currentStep >= 3 ? 'text-white' : 'text-white/60'}`}>
                  Fitness Goals
                </p>
                <p className={`text-xs ${currentStep >= 3 ? 'text-white/80' : 'text-white/40'}`}>
                  Set your fitness objectives
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 mt-auto mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 hover:bg-white/15 hover:scale-105">
              <p className="text-white/90 text-sm italic">
                "Healthnexus transformed my approach to wellness. The personalized plans are incredible!"
              </p>
              <p className="text-white/70 text-xs mt-2">— Sarah Johnson, Improved Health</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-screen animate-slideInRight">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Account</h2>
              <p className="text-gray-500 mt-2">
                Step {currentStep} of 3: {currentStep === 1 ? 'Account Details' : currentStep === 2 ? 'Personal Information' : 'Fitness Goals'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Account Details */}
              {currentStep === 1 && (
                <div className="space-y-5 step-enter">
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center transition-transform duration-200 hover:scale-110"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters with 1 number and 1 special character
                    </p>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center transition-transform duration-200 hover:scale-110"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-5 step-enter">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                        </div>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                          placeholder="25"
                          required
                        />
                      </div>
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300 cursor-pointer"
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSmartphone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                        </div>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                          placeholder="170"
                          required
                        />
                      </div>
                    </div>

                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiDroplet className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                        </div>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300"
                          placeholder="70"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300 cursor-pointer"
                      required
                    >
                      <option value="">Select your activity level</option>
                      <option value="sedentary">Sedentary (office job)</option>
                      <option value="light">Lightly Active (1-2 days/week)</option>
                      <option value="moderate">Moderately Active (3-5 days/week)</option>
                      <option value="very">Very Active (6-7 days/week)</option>
                      <option value="extreme">Extremely Active (athlete)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Fitness Goals */}
              {currentStep === 3 && (
                <div className="space-y-5 step-enter">
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Goal
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none hover:border-indigo-300 cursor-pointer"
                      required
                    >
                      <option value="">Select your primary goal</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="recomposition">Body Recomposition</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="endurance">Improve Endurance</option>
                    </select>
                  </div>

                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 transform transition-all duration-300 hover:shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-3">Medical Disclaimer</h3>
                    <p className="text-sm text-gray-600">
                      By creating an account, you confirm that you have consulted with a healthcare 
                      professional before starting any health program. Healthnexus provides personalized 
                      plans but always prioritize your safety.
                    </p>
                    <div className="mt-3 flex items-start">
                      <input
                        type="checkbox"
                        id="disclaimer"
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all duration-200"
                        required
                      />
                      <label htmlFor="disclaimer" className="ml-2 text-sm text-gray-600 cursor-pointer">
                        I understand and agree to the medical disclaimer
                      </label>
                    </div>
                  </div>

                  {/* Calorie Safety Info */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 transform transition-all duration-300 hover:shadow-md">
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">Note:</span> Healthnexus enforces safe calorie floors:
                      <br />• Women: Minimum 1200-1400 kcal/day
                      <br />• Men: Minimum 1500-1800 kcal/day
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative">Continue</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                    </span>
                  </button>
                )}
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 relative group">
                  Sign in 
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;