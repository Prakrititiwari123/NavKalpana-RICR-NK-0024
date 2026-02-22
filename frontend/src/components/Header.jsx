import React, { useState, useEffect } from 'react';
import { 
  FiActivity, FiHome, FiHeart, FiCalendar, FiBarChart2,
  FiUser, FiSettings, FiBell, FiLogOut, FiMenu,
  FiX, FiSearch, FiChevronDown, FiSun, FiMoon,
  FiMessageCircle, FiUsers, FiClipboard, FiFileText,
  FiChevronRight // Added missing import
} from 'react-icons/fi';

const Header = () => {
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
        isScrolled 
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
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6  text-gray-600" />
              ) : (
                <FiMenu className="w-6 h-6  text-gray-600" />
              )}
            </button>

            <a href="#" className="flex items-center space-x-2 group">
              <div className="bg-linear-to-r from-teal-500 to-green-500 p-2 rounded-xl transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-linear-to-r from-teal-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  HealthNexus
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">Your Health Ecosystem</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                      activeTab === item.id ? 'text-teal-600' : ''
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-teal-500 to-green-500 rounded-full animate-slideIn"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 ">
            {/* Live Time */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <FiActivity className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-medium text-gray-700">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative group"
            >
              <FiSearch className="w-5 h-5 text-gray-600" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Search
              </span>
            </button>

            {/* Notifications */}
            <div className="relative notifications-menu">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative group"
              >
                <FiBell className="w-5 h-5 text-gray-600" />
                {userData.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                    {userData.notifications}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Notifications
                </span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown">
                  <div className="bg-linear-to-r from-teal-500 to-green-500 p-4 text-white">
                    <h3 className="font-semibold flex items-center">
                      <FiBell className="w-4 h-4 mr-2" />
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            notif.type === 'reminder' ? 'bg-blue-100 text-blue-600' :
                            notif.type === 'tip' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {notif.type === 'reminder' ? <FiCalendar className="w-4 h-4" /> :
                             notif.type === 'tip' ? <FiHeart className="w-4 h-4" /> :
                             <FiUser className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-teal-600 transition-colors">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative profile-menu">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 bg-linear-to-r from-teal-50 to-green-50 p-1.5 rounded-xl border-2 border-transparent hover:border-teal-200 transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-9 h-9 bg-linear-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center overflow-hidden transform group-hover:rotate-6 transition-transform duration-300">
                  {userData.photo.url ? (
                    <img src={userData.photo.url} alt={userData.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-lg">{userData.fullName.charAt(0)}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{userData.fullName.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                </div>
                <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  isProfileMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown">
                  <div className="bg-linear-to-r from-teal-500 to-green-500 p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {userData.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{userData.fullName}</p>
                        <p className="text-xs opacity-90">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <div className="px-4 py-2 bg-teal-50 rounded-lg mb-2">
                      <p className="text-xs text-teal-600 flex items-center">
                        {greetingIcon}
                        <span className="ml-2">{greeting}, {userData.fullName.split(' ')[0]}!</span>
                      </p>
                    </div>

                    {[
                      { icon: FiUser, label: 'My Profile', href: '#' },
                      { icon: FiHeart, label: 'Health Dashboard', href: '#' },
                      { icon: FiCalendar, label: 'Appointments', href: '#' },
                      { icon: FiSettings, label: 'Settings', href: '#' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={index}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300" />
                          <span className="group-hover:text-teal-600 transition-colors">{item.label}</span>
                        </a>
                      );
                    })}

                    <div className="border-t border-gray-100 my-2"></div>

                    <button className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-all duration-300 group">
                      <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div className={`mt-4 transition-all duration-500 overflow-hidden ${
          isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for workouts, nutrition plans, health articles..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-3 bg-white border-t border-gray-100 mt-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-linear-to-r from-teal-50 to-green-50 text-teal-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-teal-600' : ''
                  }`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <FiChevronRight className="w-4 h-4 ml-auto text-teal-600" />
                  )}
                </a>
              );
            })}

            <div className="border-t border-gray-100 my-2"></div>

            {/* Mobile Greeting */}
            <div className="px-4 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-linear-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{userData.fullName}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {greetingIcon}
                    <span className="ml-1">{greeting}</span>
                  </p>
                </div>
              </div>
            </div>
          </nav>
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