// Login.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Heart,
  Zap,
  Target,
} from "lucide-react";
import { loginUser } from "../../Services/authService";

// Memoized Background Component with responsive sizes
const BackgroundElements = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="animate-slow-spin absolute -top-20 -left-20 md:top-20 md:left-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-2xl will-change-transform" />
    <div className="animate-slower-spin absolute -bottom-20 -right-20 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-300/10 rounded-full blur-2xl will-change-transform" />
    <style jsx>{`
      @keyframes slow-spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes slower-spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(-180deg) scale(1.15); }
        100% { transform: rotate(-360deg) scale(1); }
      }
      .animate-slow-spin {
        animation: slow-spin 20s linear infinite;
      }
      .animate-slower-spin {
        animation: slower-spin 25s linear infinite;
      }
    `}</style>
  </div>
));

BackgroundElements.displayName = "BackgroundElements";

// Memoized Feature Item
const FeatureItem = React.memo(({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 md:space-x-3 group">
    <div className="bg-white/20 p-1.5 md:p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
    </div>
    <span className="text-white/80 md:text-white/90 text-sm md:text-base">{text}</span>
  </div>
));

FeatureItem.displayName = "FeatureItem";

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const formRef = useRef(null);

  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  // Memoized validation function
  const validateFormData = useCallback((data) => {
    const newErrors = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  }, []);

  // Memoized validity check
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Debounced validation
  const debouncedValidate = useCallback(
    debounce((data) => {
      const newErrors = validateFormData(data);
      setErrors(newErrors);
    }, 300),
    [validateFormData],
  );

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Real-time validation with debounce
  useEffect(() => {
    debouncedValidate(formData);
    return () => {
      debouncedValidate.cancel();
    };
  }, [formData, debouncedValidate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      // Immediate validation on blur
      const newErrors = validateFormData(formData);
      setErrors(newErrors);
    },
    [formData, validateFormData],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({ email: true, password: true });

    // Final validation before submit
    const finalErrors = validateFormData(formData);
    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0 || isLoading) return;

    setIsLoading(true);
    setLoginError(false);

    try {
      await loginUser({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe,
      });

      const storedUser = localStorage.getItem("healthnexus_user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user) {
        toast.success("Login successful! Redirecting...", {
          icon: "🎉",
          duration: 3000,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password",
        {
          icon: "❌",
          duration: 4000,
        },
      );
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized features list
  const features = useMemo(
    () => [
      { icon: Heart, text: "Personalized AI Workouts" },
      { icon: Zap, text: "Smart Nutrition Tracking" },
      { icon: Target, text: "Real-time Progress Analytics" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      <BackgroundElements />

      {/* Main Container */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="w-full max-w-4xl lg:max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row min-h-150 lg:min-h-175">
          {/* Left Side - Branding & Motivation - Hidden on mobile, shown on lg screens */}
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600/90 to-purple-600/90 p-6 xl:p-12 flex-col justify-between relative overflow-hidden"
          >
            {/* Logo */}
            <div className="relative z-10">
              <div className="flex items-center space-x-2 xl:space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="bg-white/20 p-2 xl:p-3 rounded-xl xl:rounded-2xl backdrop-blur-sm">
                  <Activity className="w-6 xl:w-8 h-6 xl:h-8 text-white" />
                </div>
                <span className="text-white text-2xl xl:text-3xl font-bold">HealthNexus</span>
              </div>
            </div>

            {/* Motivational Content */}
            <div className="relative z-10 mt-8 xl:mt-12">
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-white text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight"
              >
                Your Journey to a{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
                  Healthier You
                </span>{" "}
                Starts Here
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-white/80 text-base xl:text-lg mt-4 xl:mt-6 leading-relaxed"
              >
                Experience the power of AI-driven fitness intelligence. Get
                personalized workouts, nutrition plans, and real-time insights
                tailored to your unique goals.
              </p>

              {/* Feature List */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-6 xl:mt-8 space-y-3 xl:space-y-4"
              >
                {features.map((feature, index) => (
                  <FeatureItem
                    key={index}
                    icon={feature.icon}
                    text={feature.text}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="relative z-10 mt-8 xl:mt-12"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xl:p-6 border border-white/20">
                <p className="text-white/90 text-xs xl:text-sm italic">
                  "HealthNexus completely transformed my approach to fitness. The
                  personalized plans and AI insights helped me achieve results I
                  never thought possible!"
                </p>
                <div className="flex items-center mt-3 xl:mt-4">
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-linear-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm xl:text-base">SJ</span>
                  </div>
                  <div className="ml-2 xl:ml-3">
                    <p className="text-white font-semibold text-sm xl:text-base">Sarah Johnson</p>
                    <p className="text-white/60 text-xs">
                      Lost 30lbs in 6 months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form - Full width on mobile, half on lg+ */}
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            className="w-full lg:w-1/2 bg-white p-6 sm:p-8 lg:p-10 xl:p-12"
          >
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center lg:text-left">
                <h2
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="text-2xl sm:text-3xl font-bold text-gray-800"
                >
                  Welcome Back!
                </h2>
                <p
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2"
                >
                  Please sign in to continue your fitness journey
                </p>
              </div>

              {/* Login Form */}
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
              >
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 outline-none will-change-transform text-sm sm:text-base
                        ${
                          touched.email && errors.email
                            ? "border-red-300 bg-red-50 focus:border-red-500"
                            : loginError
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                        }
                        hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Error Message - Simple conditional rendering */}
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 outline-none will-change-transform text-sm sm:text-base
                        ${
                          touched.password && errors.password
                            ? "border-red-300 bg-red-50 focus:border-red-500"
                            : loginError
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                        }
                        hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {touched.password && errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 shrink-0" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Login Error Message */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-red-600">
                      Invalid email or password. Please try again.
                    </p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      disabled={isLoading}
                    />
                    <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center sm:justify-start"
                    disabled={isLoading}
                  >
                    Forgot password?
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 relative overflow-hidden text-sm sm:text-base
                    ${
                      !isValid || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 will-change-transform"
                        viewBox="0 0 24 24"
                      >
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
                    </span>
                  )}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-xs sm:text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors relative group"
                    disabled={isLoading}
                  >
                    Sign up for free
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                  </button>
                </p>

                {/* Demo Credentials - Mobile Optimized */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1.5 sm:mb-2 flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 shrink-0" />
                    <span>Demo Credentials:</span>
                  </p>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Email:</span> 
                      <span className="break-all">demo@HealthNexus.com</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Password:</span> 
                      <span>demo123</span>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Brand Bar - Shows only on mobile below lg screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-linear-to-r from-blue-600 to-purple-600 p-3 text-white text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-4 h-4" />
          <span className="font-semibold">HealthNexus</span>
          <span className="text-white/70">•</span>
          <span className="text-white/90 text-xs">AI-Powered Fitness</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);