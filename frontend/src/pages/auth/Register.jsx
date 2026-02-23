// Register.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion , AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Eye, EyeOff, Calendar, 
  Users, Ruler, Weight, Activity, Target,
  AlertCircle, CheckCircle, Heart, FileText
} from 'lucide-react';
import { validateForm, calculateBMI, getPasswordStrength } from '../../Utils/Validations';
import { registerUser } from '../../Services/authService';
import api from "../../config/Api"

const Register = () => {
  const navigate = useNavigate();
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
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength indicator
  const passwordStrength = useMemo(() => 
    getPasswordStrength(formData.password), [formData.password]
  );

  // BMI Calculation
  const bmi = useMemo(() => 
    calculateBMI(formData.weight, formData.height), [formData.weight, formData.height]
  );

  // Real-time validation
  useEffect(() => {
    const validation = validateForm(formData);
    setErrors(validation.errors);
    setIsValid(validation.isValid);
  }, [formData]);

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Call service layer
      const response = await api.post("/auth/register",formData);
      // Show success animation
      setIsSuccess(true);
      toast.success('Account created successfully!');
      
      // Redirect after animation
      setTimeout(() => {
        navigate('/login', { state: { user: response.user } });
      }, 2000);
      
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', duration: 0.8, bounce: 0.3 }
    }
  };

  const successVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', duration: 1, bounce: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-4000" />
      </motion.div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-linear-to-r from-green-400 to-blue-500 z-50 flex items-center justify-center"
          >
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <CheckCircle className="w-24 h-24 text-white mx-auto mb-4" />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white"
              >
                Welcome to FitAI!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 mt-2"
              >
                Redirecting to your dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:w-1/3 bg-linear-to-br from-blue-600/50 to-purple-600/50 p-8 flex flex-col justify-between"
          >
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 mb-8"
              >
                <Activity className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold text-white">FitAI</span>
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Start Your Fitness Journey
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-sm leading-relaxed"
              >
                Join thousands of users who are transforming their lives with AI-powered fitness intelligence.
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mt-8"
            >
              {[
                'Personalized AI Workouts',
                'Smart Nutrition Tracking',
                'Real-time Progress Analytics',
                'Expert Community Support'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span className="text-white/90 text-sm">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-white/10 rounded-lg"
            >
              <p className="text-white/90 text-sm italic">
                "FitAI completely transformed my approach to fitness. The personalized plans are incredible!"
              </p>
              <p className="text-white/70 text-xs mt-2">â€” Sarah Johnson, Lost 30lbs</p>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-2/3 p-8 bg-white/95 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Basic Information
                </h3>

                {/* Full Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Full Name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                        touched.fullName && errors.fullName
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                    />
                  </div>
                  {touched.fullName && errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email Address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                        touched.email && errors.email
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password with strength indicator */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition-all ${
                        touched.password && errors.password
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <motion.div
                            key={level}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: level * 0.1 }}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.level
                                ? passwordStrength.level === 1
                                  ? 'bg-red-500'
                                  : passwordStrength.level === 2
                                  ? 'bg-yellow-500'
                                  : passwordStrength.level === 3
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-gray-600">
                        {passwordStrength.message}
                      </p>
                    </motion.div>
                  )}
                  
                  {touched.password && errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm Password"
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition-all ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Health Profile Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-blue-500" />
                  Health Profile
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Age"
                        className={`w-full pl-9 pr-3 py-3 border rounded-lg focus:ring-2 transition-all ${
                          touched.age && errors.age
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                        }`}
                      />
                    </div>
                    {touched.age && errors.age && (
                      <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                    )}
                  </div>

                  {/* Biological Sex */}
                  <div>
                    <select
                      name="biologicalSex"
                      value={formData.biologicalSex}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 transition-all ${
                        touched.biologicalSex && errors.biologicalSex
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                      }`}
                    >
                      <option value="">Sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {touched.biologicalSex && errors.biologicalSex && (
                      <p className="text-red-500 text-xs mt-1">{errors.biologicalSex}</p>
                    )}
                  </div>

                  {/* Height */}
                  <div>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Height (cm)"
                        className={`w-full pl-9 pr-3 py-3 border rounded-lg focus:ring-2 transition-all ${
                          touched.height && errors.height
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                        }`}
                      />
                    </div>
                    {touched.height && errors.height && (
                      <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Weight (kg)"
                        className={`w-full pl-9 pr-3 py-3 border rounded-lg focus:ring-2 transition-all ${
                          touched.weight && errors.weight
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                        }`}
                      />
                    </div>
                    {touched.weight && errors.weight && (
                      <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                    )}
                  </div>
                </div>

                {/* BMI Preview */}
                {bmi && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-50 p-3 rounded-lg"
                  >
                    <p className="text-sm text-gray-600">
                      Your BMI: <span className="font-bold text-blue-600">{bmi.value}</span> 
                      {' - '}
                      <span className={`font-semibold ${
                        bmi.category === 'Normal' ? 'text-green-600' :
                        bmi.category === 'Overweight' ? 'text-yellow-600' :
                        bmi.category === 'Obese' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {bmi.category}
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* Activity Level */}
                <div>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.activityLevel && errors.activityLevel
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="very">Very Active (6-7 days/week)</option>
                    <option value="extra">Extra Active (athlete/physical job)</option>
                  </select>
                  {touched.activityLevel && errors.activityLevel && (
                    <p className="text-red-500 text-xs mt-1">{errors.activityLevel}</p>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.experienceLevel && errors.experienceLevel
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="advanced">Advanced (3+ years)</option>
                  </select>
                  {touched.experienceLevel && errors.experienceLevel && (
                    <p className="text-red-500 text-xs mt-1">{errors.experienceLevel}</p>
                  )}
                </div>

                {/* Primary Goal */}
                <div>
                  <select
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      touched.primaryGoal && errors.primaryGoal
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                  >
                    <option value="">Select Primary Goal</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                  </select>
                  {touched.primaryGoal && errors.primaryGoal && (
                    <p className="text-red-500 text-xs mt-1">{errors.primaryGoal}</p>
                  )}
                </div>
              </motion.div>

              {/* Legal Section */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="medicalDisclaimer"
                    checked={formData.medicalDisclaimer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-600">
                    I confirm that I have consulted with a healthcare professional before starting any fitness program
                  </label>
                </div>
                {touched.medicalDisclaimer && errors.medicalDisclaimer && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.medicalDisclaimer}
                  </p>
                )}

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the Terms & Conditions and Privacy Policy
                  </label>
                </div>
                {touched.termsAccepted && errors.termsAccepted && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.termsAccepted}
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all relative overflow-hidden ${
                  !isValid || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center"
                  >
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account...
                  </motion.div>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              {/* Login Link */}
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-gray-600"
              >
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;
