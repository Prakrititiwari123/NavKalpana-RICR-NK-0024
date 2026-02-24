import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FiRefreshCw, FiPlus, FiMinus, FiCheck, FiArrowDown, FiUsers, FiShield, FiTrendingUp as FiStats
} from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  // Features data for landing page
  const features = [
    {
      id: 1,
      icon: <FiActivity className="w-8 h-8" />,
      title: 'Activity Tracking',
      description: 'Monitor your daily workouts, exercises, and fitness progress in real-time',
      color: 'blue'
    },
    {
      id: 2,
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Health Monitoring',
      description: 'Track vital signs, heart rate, blood pressure, and other health metrics',
      color: 'red'
    },
    {
      id: 3,
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Progress Analytics',
      description: 'Visualize your health journey with detailed charts and statistics',
      color: 'green'
    },
    {
      id: 4,
      icon: <FiCalendar className="w-8 h-8" />,
      title: 'Medical Records',
      description: 'Keep all your medical history, appointments, and documents organized',
      color: 'purple'
    },
    {
      id: 5,
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Smart Goals',
      description: 'Set and achieve personalized health and fitness goals',
      color: 'orange'
    },
    {
      id: 6,
      icon: <FiShield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with advanced security',
      color: 'indigo'
    }
  ];

  // Stats for social proof
  const stats = [
    { number: '100K+', label: 'Active Users', icon: <FiUsers className="w-6 h-6" /> },
    { number: '1M+', label: 'Health Records', icon: <FiClipboard className="w-6 h-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <FiShield className="w-6 h-6" /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 right-1/2 w-96 h-96 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fadeInLeft">
                <div className="inline-block mb-6 animate-slideDown">
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    Your Health Companion
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slideDown animation-delay-200">
                  Your Complete Health Dashboard
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-slideDown animation-delay-400">
                  Track your fitness, monitor your health vitals, manage medical records, and achieve your wellness goals all in one intuitive platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slideDown animation-delay-600">
                  <button 
                    onClick={() => navigate('/register')}
                    className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>

                {/* Social Proof */}
                <div className="mt-12 flex items-center gap-8 animate-slideDown animation-delay-800">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">50K+</p>
                    <p className="text-gray-600 text-sm">Active Users</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">100K+</p>
                    <p className="text-gray-600 text-sm">Records Tracked</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">4.9★</p>
                    <p className="text-gray-600 text-sm">User Rating</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Animated Hero Image */}
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="space-y-6">
                    {/* Mock Dashboard */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-white/80">Heart Rate</span>
                        <FiHeart className="w-5 h-5 text-red-400 animate-pulse" />
                      </div>
                      <p className="text-4xl font-bold text-white">72 bpm</p>
                      <p className="text-white/60 text-sm mt-2">Normal Range</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <span className="text-xs font-semibold text-white/80">Steps</span>
                        <p className="text-2xl font-bold text-white mt-2">8,543</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <span className="text-xs font-semibold text-white/80">Calories</span>
                        <p className="text-2xl font-bold text-white mt-2">520</p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <span className="text-sm font-semibold text-white/80">Daily Progress</span>
                      <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-400 h-full w-3/4 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-white text-sm mt-2">75% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent via-blue-50/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600">Everything you need to manage your health in one place</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.id}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                >
                  <div className={`h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer ${
                    activeFeature === feature.id ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      feature.color === 'red' ? 'bg-red-100 text-red-600' :
                      feature.color === 'green' ? 'bg-green-100 text-green-600' :
                      feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      feature.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-semibold">Learn more</span>
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
            <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
                <p className="text-xl text-white/90 mb-8">Join thousands of users already tracking their wellness journey</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/register')}
                    className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Create Free Account <FiArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center animate-fadeInUp"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4 group hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</p>
                  <p className="text-gray-600 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Wellness Journey Today</h2>
            <p className="text-lg text-gray-600 mb-8">No credit card required. Free access to all basic features</p>
            
            <button 
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started Now <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
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
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
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

export default Home;