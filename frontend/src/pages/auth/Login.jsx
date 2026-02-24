// // Login.jsx
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   Activity,
//   ArrowRight,
//   AlertCircle,
//   CheckCircle,
//   Heart,
//   Zap,
//   Target
// } from 'lucide-react';
// import { loginUser } from '../../Services/authService';
// import { useAuth } from '../../Context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const emailInputRef = useRef(null);
//   const { login } = useAuth();

//   // State management
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState(false);
//   const [isValid, setIsValid] = useState(false);

//   // Auto-focus email field on mount
//   useEffect(() => {
//     emailInputRef.current?.focus();
//   }, []);



//   const validateForm = useCallback(() => {
//     const newErrors = {};

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     setIsValid(Object.keys(newErrors).length === 0);
//   }, [formData]);


//   // Real-time validation
//   useEffect(() => {
//     validateForm();
//   }, [formData]);



//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setLoginError(false); // Clear login error on input change
//   }, []);

//   const handleBlur = useCallback((e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Mark all fields as touched to show validation errors
//     setTouched({ email: true, password: true });

//     if (!isValid || isLoading) return;

//     setIsLoading(true);
//     setLoginError(false);

//     try {
//       setIsLoading(true);


//      await loginUser({ email: formData.email, password: formData.password, rememberMe: false })

//       const responce = localStorage.getItem("healthnexus_user");
//       login(JSON.parse(responce))
//       console.log(JSON.parse(responce))



//       setIsLoading(false);

//       // Redirect after short delay
//       setTimeout(() => {
//         // Success toast
//         toast.success("Login successful! Redirecting...", {
//           icon: "🎉",
//           duration: 3000,
//         });
//         navigate("/dashboard");
//       }, 1500);

//     } catch (error) {
//       setIsLoading(false);

//       // Show error toast
//       toast.error(
//         error.response?.data?.message || "Invalid email or password",
//         {
//           icon: "❌",
//           duration: 4000,
//         }
//       );

//       setLoginError(true);
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const leftVariants = {
//     hidden: { x: -100, opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: { type: "spring", duration: 1, bounce: 0.3 },
//     },
//   };

//   const rightVariants = {
//     hidden: { x: 100, opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: { type: "spring", duration: 1, bounce: 0.3 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 300, damping: 24 },
//     },
//   };

//   const shakeAnimation = {
//     shake: {
//       x: [0, -10, 10, -10, 10, 0],
//       transition: { duration: 0.4 },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 overflow-hidden">
//       {/* Animated Background Elements */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.15 }}
//         transition={{ duration: 1.5 }}
//         className="absolute inset-0"
//       >
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             rotate: [0, 90, 0],
//             borderRadius: ["50%", "30%", "50%"],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             rotate: [0, -90, 0],
//             borderRadius: ["50%", "30%", "50%"],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
//         />
//       </motion.div>

//       {/* Main Container */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
//       >
//         <div className="flex flex-col lg:flex-row">
//           {/* Left Side - Branding & Motivation */}
//           <motion.div
//             variants={leftVariants}
//             className="lg:w-1/2 bg-linear-to-br from-blue-600/90 to-purple-600/90 p-12 flex flex-col justify-between relative overflow-hidden"
//           >
//             {/* Animated background shapes */}
//             <motion.div
//               animate={{
//                 scale: [1, 1.2, 1],
//                 x: [0, 50, 0],
//                 y: [0, 30, 0],
//               }}
//               transition={{
//                 duration: 15,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//               className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
//             />
//             <motion.div
//               animate={{
//                 scale: [1, 1.3, 1],
//                 x: [0, -30, 0],
//                 y: [0, 50, 0],
//               }}
//               transition={{
//                 duration: 18,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//               className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
//             />

//             {/* Logo */}
//             <motion.div variants={itemVariants} className="relative z-10">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="flex items-center space-x-3"
//               >
//                 <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
//                   <Activity className="w-8 h-8 text-white" />
//                 </div>
//                 <span className="text-white text-3xl font-bold">FitAI</span>
//               </motion.div>
//             </motion.div>

//             {/* Motivational Content */}
//             <div className="relative z-10 mt-12">
//               <motion.h1
//                 variants={itemVariants}
//                 className="text-white text-4xl lg:text-5xl font-bold leading-tight"
//               >
//                 Your Journey to a{" "}
//                 <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
//                   Healthier You
//                 </span>{" "}
//                 Starts Here
//               </motion.h1>

//               <motion.p
//                 variants={itemVariants}
//                 className="text-white/80 text-lg mt-6 leading-relaxed"
//               >
//                 Experience the power of AI-driven fitness intelligence.
//                 Get personalized workouts, nutrition plans, and real-time insights
//                 tailored to your unique goals.
//               </motion.p>

//               {/* Feature List */}
//               <motion.div variants={itemVariants} className="mt-8 space-y-4">
//                 {[
//                   { icon: Heart, text: "Personalized AI Workouts" },
//                   { icon: Zap, text: "Smart Nutrition Tracking" },
//                   { icon: Target, text: "Real-time Progress Analytics" },
//                 ].map((feature, index) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ x: 10 }}
//                     className="flex items-center space-x-3"
//                   >
//                     <div className="bg-white/20 p-2 rounded-lg">
//                       <feature.icon className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-white/90">{feature.text}</span>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </div>

//             {/* Testimonial */}
//             <motion.div variants={itemVariants} className="relative z-10 mt-12">
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
//                 <p className="text-white/90 text-sm italic">
//                   "FitAI completely transformed my approach to fitness. The
//                   personalized plans and AI insights helped me achieve results I
//                   never thought possible!"
//                 </p>
//                 <div className="flex items-center mt-4">
//                   <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
//                     <span className="text-white font-bold">SJ</span>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-white font-semibold">Sarah Johnson</p>
//                     <p className="text-white/60 text-xs">
//                       Lost 30lbs in 6 months
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Right Side - Login Form */}
//           <motion.div
//             variants={rightVariants}
//             className="lg:w-1/2 bg-white p-8 lg:p-12"
//           >
//             <motion.div variants={itemVariants} className="max-w-md mx-auto">
//               {/* Header */}
//               <div className="text-center lg:text-left">
//                 <motion.h2
//                   variants={itemVariants}
//                   className="text-3xl font-bold text-gray-800"
//                 >
//                   Welcome Back!
//                 </motion.h2>
//                 <motion.p
//                   variants={itemVariants}
//                   className="text-gray-500 mt-2"
//                 >
//                   Please sign in to continue your fitness journey
//                 </motion.p>
//               </div>

//               {/* Login Form */}
//               <motion.form
//                 variants={itemVariants}
//                 onSubmit={handleSubmit}
//                 className="mt-8 space-y-6"
//               >
//                 {/* Email Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       ref={emailInputRef}
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-300 outline-none
//                         ${touched.email && errors.email
//                           ? 'border-red-300 bg-red-50 focus:border-red-500'
//                           : loginError
//                             ? 'border-red-300 bg-red-50'
//                             : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
//                         }
//                         hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
//                       placeholder="you@example.com"
//                     />
//                   </div>

//                   {/* Error Message */}
//                   <AnimatePresence>
//                     {touched.email && errors.email && (
//                       <motion.p
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="text-red-500 text-sm mt-1 flex items-center"
//                       >
//                         <AlertCircle className="w-4 h-4 mr-1" />
//                         {errors.email}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all duration-300 outline-none
//                         ${touched.password && errors.password
//                           ? 'border-red-300 bg-red-50 focus:border-red-500'
//                           : loginError
//                             ? 'border-red-300 bg-red-50'
//                             : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
//                         }
//                         hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
//                       placeholder="Enter your password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>

//                   {/* Error Message */}
//                   <AnimatePresence>
//                     {touched.password && errors.password && (
//                       <motion.p
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="text-red-500 text-sm mt-1 flex items-center"
//                       >
//                         <AlertCircle className="w-4 h-4 mr-1" />
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Login Error Message */}
//                 <AnimatePresence>
//                   {loginError && (
//                     <motion.div
//                       variants={shakeAnimation}
//                       animate="shake"
//                       initial={{ opacity: 0 }}
//                       exit={{ opacity: 0 }}
//                       className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
//                     >
//                       <AlertCircle className="w-5 h-5 text-red-500" />
//                       <p className="text-sm text-red-600">
//                         Invalid email or password. Please try again.
//                       </p>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center space-x-2 cursor-pointer group">
//                     <input
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
//                     />
//                     <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
//                       Remember me
//                     </span>
//                   </label>

//                   <motion.button
//                     whileHover={{ x: 3 }}
//                     type="button"
//                     onClick={() => navigate("/forgot-password")}
//                     className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center"
//                   >
//                     Forgot password?
//                     <ArrowRight className="w-4 h-4 ml-1" />
//                   </motion.button>
//                 </div>

//                 {/* Login Button */}
//                 <motion.button
//                   whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
//                   whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
//                   type="submit"
//                   disabled={!isValid || isLoading}
//                   className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden
//                     ${
//                       !isValid || isLoading
//                         ? "bg-gray-300 cursor-not-allowed"
//                         : "bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-lg"
//                     }`}
//                 >
//                   {isLoading ? (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center justify-center"
//                     >
//                       <svg
//                         className="animate-spin h-5 w-5 mr-3"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Signing in...
//                     </motion.div>
//                   ) : (
//                     <span className="flex items-center justify-center">
//                       Sign In
//                       <ArrowRight className="w-5 h-5 ml-2" />
//                     </span>
//                   )}
//                 </motion.button>

//                 {/* Sign Up Link */}
//                 <motion.p
//                   variants={itemVariants}
//                   className="text-center text-sm text-gray-600"
//                 >
//                   Don't have an account?{" "}
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     type="button"
//                     onClick={() => navigate("/register")}
//                     className="font-semibold text-blue-600 hover:text-blue-700 transition-colors relative group"
//                   >
//                     Sign up for free
//                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
//                   </motion.button>
//                 </motion.p>

//                 {/* Demo Credentials */}
//                 <motion.div
//                   variants={itemVariants}
//                   className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
//                 >
//                   <p className="text-xs text-gray-500 mb-2 flex items-center">
//                     <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
//                     Demo Credentials:
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     Email: demo@fitai.com
//                     <br />
//                     Password: demo123
//                   </p>
//                 </motion.div>
//               </motion.form>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

// Login.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  Target
} from 'lucide-react';
import { loginUser } from '../../Services/authService';
import { useAuth } from '../../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const { login } = useAuth();

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
  const [isValid, setIsValid] = useState(false);

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);



  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);


  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData]);



  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError(false); // Clear login error on input change
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({ email: true, password: true });

    if (!isValid || isLoading) return;

    setIsLoading(true);
    setLoginError(false);

    try {
      setIsLoading(true);


     await loginUser({ email: formData.email, password: formData.password, rememberMe: false })

      const responce = localStorage.getItem("healthnexus_user");
      login(JSON.parse(responce))
      console.log(JSON.parse(responce))



      setIsLoading(false);

      // Redirect after short delay
      setTimeout(() => {
        // Success toast
        toast.success("Login successful! Redirecting...", {
          icon: "🎉",
          duration: 3000,
        });
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      setIsLoading(false);

      // Show error toast
      toast.error(
        error.response?.data?.message || "Invalid email or password",
        {
          icon: "❌",
          duration: 4000,
        }
      );

      setLoginError(true);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const leftVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, bounce: 0.3 },
    },
  };

  const rightVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, bounce: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 overflow-x-hidden"> {/* Responsive padding */}
      
      {/* Animated Background Elements - Responsive sizes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-purple-300 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Branding & Motivation */}
          <motion.div
            variants={leftVariants}
            className="lg:w-1/2 bg-gradient-to-br from-blue-600/90 to-purple-600/90 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Animated background shapes - Responsive */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-0 left-0 w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 bg-purple-500/20 rounded-full blur-3xl"
            />

            {/* Logo */}
            <motion.div variants={itemVariants} className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <div className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">FitAI</span>
              </motion.div>
            </motion.div>

            {/* Motivational Content */}
            <div className="relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
              <motion.h1
                variants={itemVariants}
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                Your Journey to a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Healthier You
                </span>{" "}
                Starts Here
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-white/80 text-sm sm:text-base md:text-lg mt-4 sm:mt-5 md:mt-6 leading-relaxed"
              >
                Experience the power of AI-driven fitness intelligence.
                Get personalized workouts, nutrition plans, and real-time insights
                tailored to your unique goals.
              </motion.p>

              {/* Feature List */}
              <motion.div variants={itemVariants} className="mt-6 sm:mt-7 md:mt-8 space-y-3 sm:space-y-4">
                {[
                  { icon: Heart, text: "Personalized AI Workouts" },
                  { icon: Zap, text: "Smart Nutrition Tracking" },
                  { icon: Target, text: "Real-time Progress Analytics" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                      <feature.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-white/80 sm:text-white/90 text-xs sm:text-sm md:text-base">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div variants={itemVariants} className="relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
                <p className="text-white/80 sm:text-white/90 text-xs sm:text-sm italic">
                  "FitAI completely transformed my approach to fitness. The
                  personalized plans and AI insights helped me achieve results I
                  never thought possible!"
                </p>
                <div className="flex items-center mt-3 sm:mt-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">SJ</span>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-white font-semibold text-xs sm:text-sm">Sarah Johnson</p>
                    <p className="text-white/60 text-xs">
                      Lost 30lbs in 6 months
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={rightVariants}
            className="lg:w-1/2 bg-white p-6 sm:p-8 md:p-10 lg:p-12"
          >
            <motion.div variants={itemVariants} className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center lg:text-left">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl sm:text-3xl font-bold text-gray-800"
                >
                  Welcome Back!
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2"
                >
                  Please sign in to continue your fitness journey
                </motion.p>
              </div>

              {/* Login Form */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="mt-6 sm:mt-7 md:mt-8 space-y-4 sm:space-y-5 md:space-y-6"
              >
                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none text-sm sm:text-base
                        ${touched.email && errors.email
                          ? 'border-red-300 bg-red-50 focus:border-red-500'
                          : loginError
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
                        }
                        hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {touched.email && errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                      className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none text-sm sm:text-base
                        ${touched.password && errors.password
                          ? 'border-red-300 bg-red-50 focus:border-red-500'
                          : loginError
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
                        }
                        hover:border-blue-300 focus:ring-4 focus:ring-blue-100`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {touched.password && errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Login Error Message */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      variants={shakeAnimation}
                      animate="shake"
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      <p className="text-xs sm:text-sm text-red-600">
                        Invalid email or password. Please try again.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ x: 3 }}
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center"
                  >
                    Forgot password?
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </motion.button>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
                  whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden text-sm sm:text-base
                    ${
                      !isValid || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg"
                    }`}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
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
                      Signing in...
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    </span>
                  )}
                </motion.button>

                {/* Sign Up Link */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-xs sm:text-sm text-gray-600"
                >
                  Don't have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors relative group"
                  >
                    Sign up for free
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                  </motion.button>
                </motion.p>

                {/* Demo Credentials */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-xs text-gray-500 mb-1.5 sm:mb-2 flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                    Demo Credentials:
                  </p>
                  <p className="text-xs text-gray-600 break-words">
                    Email: demo@fitai.com
                    <br />
                    Password: demo123
                  </p>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;