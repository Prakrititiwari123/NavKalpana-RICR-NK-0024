// Register.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  User, Mail, Lock, Eye, EyeOff, Calendar,
  Ruler, Weight, Activity, Target,
  AlertCircle, CheckCircle, Heart, FileText,
  ArrowRight, ArrowLeft, Shield, Award, Zap, TrendingUp
} from 'lucide-react';
import { validateForm, calculateBMI, getPasswordStrength } from '../../Utils/Validations';
import api from "../../config/Api";

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Health Profile
    age: '',
    biologicalSex: '',
    height: '',
    weight: '',
    activityLevel: '',
    experienceLevel: '',
    primaryGoal: '',
    
    // Legal
    medicalDisclaimer: false,
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Password strength indicator
  const passwordStrength = useMemo(() => 
    getPasswordStrength(formData.password), [formData.password]
  );

  // BMI Calculation
  const bmi = useMemo(() => 
    calculateBMI(formData.weight, formData.height), [formData.weight, formData.height]
  );

  // Debounced validation
  const debouncedValidate = useCallback(
    debounce((data) => {
      const validation = validateForm(data);
      setErrors(validation.errors);
    }, 300),
    []
  );

  // Real-time validation with debounce
  useEffect(() => {
    debouncedValidate(formData);
    return () => {
      debouncedValidate.cancel();
    };
  }, [formData, debouncedValidate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Immediate validation on blur
    const validation = validateForm(formData);
    setErrors(validation.errors);
  }, [formData]);

  const validateStep = useCallback((step) => {
    const stepFields = {
      1: ['fullName', 'email', 'password', 'confirmPassword'],
      2: ['age', 'biologicalSex', 'height', 'weight', 'activityLevel', 'experienceLevel', 'primaryGoal'],
      3: ['medicalDisclaimer', 'termsAccepted']
    };

    const stepErrors = {};
    stepFields[step].forEach(field => {
      if (errors[field]) {
        stepErrors[field] = errors[field];
      }
    });

    return Object.keys(stepErrors).length === 0;
  }, [errors]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = {
        1: ['fullName', 'email', 'password', 'confirmPassword'],
        2: ['age', 'biologicalSex', 'height', 'weight', 'activityLevel', 'experienceLevel', 'primaryGoal'],
        3: ['medicalDisclaimer', 'termsAccepted']
      };
      
      const newTouched = { ...touched };
      stepFields[currentStep].forEach(field => {
        newTouched[field] = true;
      });
      setTouched(newTouched);
      
      toast.error('Please fill all required fields correctly');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3) || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const response = await api.post("/auth/register", formData);
      
      setIsSuccess(true);
      toast.success('Account created successfully!');
      
      setTimeout(() => {
        navigate('/login', { state: { user: response.user } });
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  };

  // Step configuration
  const steps = [
    {
      number: 1,
      title: 'Personal Info',
      icon: User,
      description: 'Basic details',
      mobileTitle: 'Personal'
    },
    {
      number: 2,
      title: 'Health Profile',
      icon: Heart,
      description: 'Fitness metrics',
      mobileTitle: 'Health'
    },
    {
      number: 3,
      title: 'Legal',
      icon: Shield,
      description: 'Terms & agreements',
      mobileTitle: 'Legal'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-slow-pulse absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
        <div className="animate-slow-pulse-delay absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-300/5 rounded-full blur-3xl" />
        <style jsx>{`
          @keyframes slowPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .animate-slow-pulse {
            animation: slowPulse 20s ease-in-out infinite;
          }
          .animate-slow-pulse-delay {
            animation: slowPulse 20s ease-in-out infinite reverse;
          }
        `}</style>
      </div>

      {/* Success Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 bg-linear-to-r from-green-400 to-blue-500 z-50 flex items-center justify-center p-4 transition-opacity duration-500">
          <div className="text-center w-full max-w-sm mx-auto">
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white mx-auto mb-3 sm:mb-4 animate-bounce" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white animate-fade-in-up">
              Welcome to HealthNexus!
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-1 sm:mt-2 animate-fade-in-up animation-delay-200">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div
        ref={formRef}
        data-aos="fade-up"
        data-aos-duration="1000"
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
      >
        {/* Progress Header - Responsive */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          {/* Step Indicators - Mobile Optimized */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    ) : (
                      <step.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-white/60'
                  }`}>
                    {isMobile ? step.mobileTitle : step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-1 sm:mx-2 md:mx-4 relative">
                    <div className="h-1 bg-white/20 rounded-full">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all duration-500"
                        style={{ width: currentStep > step.number ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Title - Hide on very small screens */}
          <h2
            key={currentStep}
            className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
          >
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div
                key="step1"
                className="space-y-3 sm:space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                    />
                  </div>
                  {touched.fullName && errors.fullName && (
                    <p className="text-red-300 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="john@example.com"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-red-300 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 hover:text-white/60" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 hover:text-white/60" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.level
                                ? passwordStrength.level === 1
                                  ? 'bg-red-400'
                                  : passwordStrength.level === 2
                                  ? 'bg-yellow-400'
                                  : passwordStrength.level === 3
                                  ? 'bg-blue-400'
                                  : 'bg-green-400'
                                : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-white/60">
                        {passwordStrength.message}
                      </p>
                    </div>
                  )}

                  {touched.password && errors.password && (
                    <p className="text-red-300 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 hover:text-white/60" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 hover:text-white/60" />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-red-300 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Health Profile */}
            {currentStep === 2 && (
              <div
                key="step2"
                className="space-y-3 sm:space-y-4"
              >
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {/* Age */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="25"
                        className="w-full pl-7 sm:pl-8 pr-2 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    {touched.age && errors.age && (
                      <p className="text-red-300 text-xs mt-1">{errors.age}</p>
                    )}
                  </div>

                  {/* Biological Sex */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Gender
                    </label>
                    <select
                      name="biologicalSex"
                      value={formData.biologicalSex}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                    >
                      <option value="" className="bg-gray-800">Select</option>
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                    {touched.biologicalSex && errors.biologicalSex && (
                      <p className="text-red-300 text-xs mt-1">{errors.biologicalSex}</p>
                    )}
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="175"
                        className="w-full pl-7 sm:pl-8 pr-2 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    {touched.height && errors.height && (
                      <p className="text-red-300 text-xs mt-1">{errors.height}</p>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <Weight className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="70"
                        className="w-full pl-7 sm:pl-8 pr-2 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    {touched.weight && errors.weight && (
                      <p className="text-red-300 text-xs mt-1">{errors.weight}</p>
                    )}
                  </div>
                </div>

                {/* BMI Preview */}
                {bmi && (
                  <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-white">
                      Your BMI: <span className="font-bold">{bmi.value}</span> 
                      {' - '}
                      <span className={`font-semibold ${
                        bmi.category === 'Normal' ? 'text-green-300' :
                        bmi.category === 'Overweight' ? 'text-yellow-300' :
                        bmi.category === 'Obese' ? 'text-red-300' :
                        'text-blue-300'
                      }`}>
                        {bmi.category}
                      </span>
                    </p>
                  </div>
                )}

                {/* Activity Level */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                  >
                    <option value="" className="bg-gray-800">Select Activity Level</option>
                    <option value="sedentary" className="bg-gray-800">Sedentary</option>
                    <option value="light" className="bg-gray-800">Lightly Active</option>
                    <option value="moderate" className="bg-gray-800">Moderately Active</option>
                    <option value="very" className="bg-gray-800">Very Active</option>
                    <option value="extra" className="bg-gray-800">Extra Active</option>
                  </select>
                  {touched.activityLevel && errors.activityLevel && (
                    <p className="text-red-300 text-xs mt-1">{errors.activityLevel}</p>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                  >
                    <option value="" className="bg-gray-800">Select Experience</option>
                    <option value="beginner" className="bg-gray-800">Beginner (0-1 years)</option>
                    <option value="intermediate" className="bg-gray-800">Intermediate (1-3 years)</option>
                    <option value="advanced" className="bg-gray-800">Advanced (3+ years)</option>
                  </select>
                  {touched.experienceLevel && errors.experienceLevel && (
                    <p className="text-red-300 text-xs mt-1">{errors.experienceLevel}</p>
                  )}
                </div>

                {/* Primary Goal */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                    Primary Goal
                  </label>
                  <select
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all text-xs sm:text-sm"
                  >
                    <option value="" className="bg-gray-800">Select Goal</option>
                    <option value="weight_loss" className="bg-gray-800">Weight Loss</option>
                    <option value="muscle_gain" className="bg-gray-800">Muscle Gain</option>
                    <option value="maintenance" className="bg-gray-800">Maintenance</option>
                    <option value="endurance" className="bg-gray-800">Endurance</option>
                    <option value="strength" className="bg-gray-800">Strength</option>
                  </select>
                  {touched.primaryGoal && errors.primaryGoal && (
                    <p className="text-red-300 text-xs mt-1">{errors.primaryGoal}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Legal */}
            {currentStep === 3 && (
              <div
                key="step3"
                className="space-y-4 sm:space-y-6"
              >
                {/* Medical Disclaimer */}
                <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="medicalDisclaimer"
                      checked={formData.medicalDisclaimer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 mr-2 sm:mr-3 shrink-0"
                    />
                    <label className="text-xs sm:text-sm text-white">
                      I confirm that I have consulted with a healthcare professional before starting any fitness program
                    </label>
                  </div>
                  {touched.medicalDisclaimer && errors.medicalDisclaimer && (
                    <p className="text-red-300 text-xs flex items-center mt-2">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {errors.medicalDisclaimer}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 mr-2 sm:mr-3 shrink-0"
                    />
                    <label className="text-xs sm:text-sm text-white">
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                  </div>
                  {touched.termsAccepted && errors.termsAccepted && (
                    <p className="text-red-300 text-xs flex items-center mt-2">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-linear-to-r from-blue-500/20 to-purple-500/20 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Registration Summary
                  </h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/80">
                    <p><span className="font-medium">Name:</span> {formData.fullName || 'Not provided'}</p>
                    <p><span className="font-medium">Email:</span> {formData.email || 'Not provided'}</p>
                    <p><span className="font-medium">Age:</span> {formData.age || 'Not provided'}</p>
                    <p><span className="font-medium">Goal:</span> {formData.primaryGoal?.replace('_', ' ') || 'Not selected'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Responsive */}
            <div className="flex justify-between mt-5 sm:mt-6 md:mt-8 gap-2 sm:gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center text-xs sm:text-sm hover:scale-102 active:scale-98"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Previous</span>
                  <span className="xs:hidden">Prev</span>
                </button>
              )}
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center text-xs sm:text-sm hover:scale-102 active:scale-98 ${
                    currentStep === 1 ? 'ml-auto' : ''
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateStep(3) || isSubmitting}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-all flex items-center ml-auto text-xs sm:text-sm ${
                    !validateStep(3) || isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-green-500 text-white hover:bg-green-600 hover:scale-102 active:scale-98'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="hidden xs:inline">Creating...</span>
                      <span className="xs:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden xs:inline">Create Account</span>
                      <span className="xs:hidden">Create</span>
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-white/80 mt-4 sm:mt-5 md:mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-white font-semibold hover:text-white/80 transition-colors underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* Features Footer - Responsive */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"
        >
          {[
            { icon: Zap, text: 'AI-Powered' },
            { icon: TrendingUp, text: 'Track Progress' },
            { icon: Award, text: 'Expert Guidance' }
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center space-x-1 sm:space-x-2 text-white/80">
              <feature.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Register);