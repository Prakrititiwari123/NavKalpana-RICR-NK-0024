import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiActivity, FiHome, FiHeart, FiCalendar, FiBarChart2,
  FiUser, FiSettings, FiBell, FiLogOut, FiMenu,
  FiX, FiSearch, FiChevronDown, FiSun, FiMoon,
  FiMessageCircle, FiUsers, FiClipboard, FiFileText,
  FiChevronRight, FiArrowRight // Added missing import
} from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/' || location.pathname === '/features' || location.pathname === '/benefits' || location.pathname === '/about';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user data

  
  const userData = {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    photo: {
      url: ''
    },
    role: 'Premium Member',
    notifications: 3
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, href: '#' },
    { id: 'health', label: 'Health Metrics', icon: FiHeart, href: '#' },
    { id: 'workouts', label: 'Workouts', icon: FiActivity, href: '#' },
    { id: 'nutrition', label: 'Nutrition', icon: FiClipboard, href: '#' },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, href: '#' },
    { id: 'reports', label: 'Reports', icon: FiFileText, href: '#' },
    { id: 'community', label: 'Community', icon: FiUsers, href: '#' }
  ];

  // Notifications data
  const notifications = [
    { id: 1, title: 'Workout Reminder', message: 'Your workout starts in 30 minutes', time: '5 min ago', type: 'reminder' },
    { id: 2, title: 'Health Tip', message: 'Stay hydrated! Drink water regularly', time: '1 hour ago', type: 'tip' },
    { id: 3, title: 'Appointment', message: 'Check-up with Dr. Smith tomorrow', time: '2 hours ago', type: 'appointment' }
  ];

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setGreetingIcon(<FiSun className="w-4 h-4 text-yellow-500" />);
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
      setGreetingIcon(<FiSun className="w-4 h-4 text-orange-500" />);
    } else {
      setGreeting('Good Evening');
      setGreetingIcon(<FiMoon className="w-4 h-4 text-indigo-500" />);
    }
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileMenuOpen && !e.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
      if (isNotificationsOpen && !e.target.closest('.notifications-menu')) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen, isNotificationsOpen]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isLandingPage 
          ? isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white/50 backdrop-blur-sm py-4'
          : isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-white/80 backdrop-blur-sm shadow-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 ${
                isLandingPage ? 'block' : 'hidden'
              }`}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-600" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-600" />
              )}
            </button>

            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 group"
            >
              <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-2 rounded-xl transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  HealthNexus
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">Your Health Companion</span>
              </div>
            </button>
          </div>

          {/* Landing Page Navigation */}
          {isLandingPage && !isAuthPage && (
            <nav className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 rounded-xl hidden text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/features')}
                className={`px-4 py-2 rounded-xl text-sm font-medium  hidden transition-all duration-300 ${
                  location.pathname === '/features'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => navigate('/benefits')}
                className={`px-4 py-2 rounded-xl text-sm hidden font-medium transition-all duration-300 ${
                  location.pathname === '/benefits'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`px-4 py-2 rounded-xl text-sm font-medium hidden transition-all duration-300 ${
                  location.pathname === '/about'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                About
              </button>
            </nav>
          )}

          {/* Dashboard Navigation */}
          {!isLandingPage && !isAuthPage && isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FiHome },
                { id: 'health', label: 'Health', icon: FiHeart },
                { id: 'workouts', label: 'Workouts', icon: FiActivity },
                { id: 'nutrition', label: 'Nutrition', icon: FiClipboard },
                { id: 'appointments', label: 'Appointments', icon: FiCalendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href="#"
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeTab === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                        activeTab === item.id ? 'text-blue-600' : ''
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {activeTab === item.id && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full animate-slideIn"></span>
                    )}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Landing Page CTA Buttons */}
            {isLandingPage && !isAuthPage && !isAuthenticated && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:block px-6 py-2 text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  Get Started
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Auth Page Back Button */}
            {isAuthPage && (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
              >
                Back Home
              </button>
            )}

            {/* Dashboard Actions */}
            {!isLandingPage && !isAuthPage && isAuthenticated && (
              <>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative group hidden md:block"
                >
                  <FiSearch className="w-5 h-5 text-gray-600" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Search
                  </span>
                </button>

                <div className="relative notifications-menu">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative group"
                  >
                    <FiBell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                      3
                    </span>
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown z-50">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-4 text-white">
                        <h3 className="font-semibold flex items-center">
                          <FiBell className="w-4 h-4 mr-2" />
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors">
                          <p className="text-sm font-medium text-gray-800">Workout Reminder</p>
                          <p className="text-xs text-gray-500 mt-1">Your workout starts in 30 minutes</p>
                          <p className="text-xs text-gray-400 mt-1">5 min ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative profile-menu">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-linear-to-r from-blue-50 to-indigo-50 p-1.5 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-9 h-9 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center overflow-hidden">
                      <span className="text-white font-semibold text-lg">A</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-800">Alex</p>
                      <p className="text-xs text-gray-500">Member</p>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown z-50">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-4 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            A
                          </div>
                          <div>
                            <p className="font-semibold">Alex Johnson</p>
                            <p className="text-xs opacity-90">alex@email.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <a href="#" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group">
                          <FiUser className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                          <span className="group-hover:text-blue-600 transition-colors">My Profile</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group">
                          <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                          <span className="group-hover:text-blue-600 transition-colors">Settings</span>
                        </a>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-all duration-300 group">
                          <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 50%;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;