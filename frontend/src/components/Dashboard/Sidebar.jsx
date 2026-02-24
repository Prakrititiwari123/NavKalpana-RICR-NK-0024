import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { IoRestaurant } from 'react-icons/io5';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      label: 'Analytics',
      icon: FiBarChart2,
      path: '/analytics',
      color: 'text-blue-600'
    },
    {
      id: 2,
      label: 'Chat',
      icon: FiMessageSquare,
      path: '/chat',
      color: 'text-purple-600'
    },
    {
      id: 3,
      label: 'Progress',
      icon: FiTrendingUp,
      path: '/progress',
      color: 'text-green-600'
    },
    {
      id: 4,
      label: 'Diet',
      icon: IoRestaurant,
      path: '/diet',
      color: 'text-orange-600'
    },
    {
      id: 5,
      label: 'Workout',
      icon: GiWeightLiftingUp,
      path: '/workout',
      color: 'text-indigo-600'
    },
    {
      id: 6,
      label: 'Settings',
      icon: FiSettings,
      path: '/settings',
      color: 'text-red-600'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Hamburger Button - positioned below navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-gray-900" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* Sidebar - Fixed positioning starting below navbar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-linear-to-b from-white to-gray-50 shadow-lg lg:shadow-xl border-r border-gray-200 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-64 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Menu */}
        <nav className="p-5 mt-5 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  active
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? 'text-white' : item.color
                  } transition-colors group-hover:scale-110 duration-300`}
                />
                <span className="font-semibold text-sm">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer - Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-linear-to-t from-white to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 group"
          >
            <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
