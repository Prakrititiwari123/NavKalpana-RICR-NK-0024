import React, { useState, useEffect } from 'react';
import { 
  FiHeart, FiMail, FiPhone, FiMapPin, 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin,
  FiYoutube, FiGithub, FiArrowRight, FiActivity,
  FiChevronUp, FiStar, FiAward, FiGlobe
} from 'react-icons/fi';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const currentYear = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'About Us', href: '#', icon: '🏥' },
    { name: 'Features', href: '#', icon: '⚕️' },
    { name: 'How It Works', href: '#', icon: '🔄' },
    { name: 'Pricing', href: '#', icon: '💰' },
    { name: 'FAQs', href: '#', icon: '❓' },
    { name: 'Contact', href: '#', icon: '📞' }
  ];

  const resources = [
    { name: 'Health Blog', href: '#', icon: '📝' },
    { name: 'Wellness Guides', href: '#', icon: '📚' },
    { name: 'Nutrition Tips', href: '#', icon: '🥗' },
    { name: 'Success Stories', href: '#', icon: '🌟' },
    { name: 'Community', href: '#', icon: '👥' },
    { name: 'Support Center', href: '#', icon: '🎯' }
  ];

  const legal = [
    { name: 'Terms of Service', href: '#', icon: '📜' },
    { name: 'Privacy Policy', href: '#', icon: '🔒' },
    { name: 'Cookie Policy', href: '#', icon: '🍪' },
    { name: 'Medical Disclaimer', href: '#', icon: '⚕️' },
    { name: 'HIPAA Compliance', href: '#', icon: '🛡️' }
  ];

  const socialLinks = [
    { icon: FiFacebook, href: '#', color: 'hover:text-blue-600', name: 'Facebook', delay: '0s' },
    { icon: FiTwitter, href: '#', color: 'hover:text-blue-400', name: 'Twitter', delay: '0.1s' },
    { icon: FiInstagram, href: '#', color: 'hover:text-pink-600', name: 'Instagram', delay: '0.2s' },
    { icon: FiLinkedin, href: '#', color: 'hover:text-blue-700', name: 'LinkedIn', delay: '0.3s' },
    { icon: FiYoutube, href: '#', color: 'hover:text-red-600', name: 'YouTube', delay: '0.4s' },
    { icon: FiGithub, href: '#', color: 'hover:text-gray-900', name: 'GitHub', delay: '0.5s' }
  ];

  const achievements = [
    { number: '500K+', label: 'Active Users', icon: '👥' },
    { number: '10K+', label: 'Health Plans', icon: '📋' },
    { number: '98%', label: 'Satisfaction', icon: '⭐' },
    { number: '24/7', label: 'Support', icon: '🆘' }
  ];

  return (
    <footer className="bg-linear-to-b from-white to-gray-50 border-t border-gray-200 mt-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-linear-to-r from-teal-500 to-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-500 z-50 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        } hover:scale-110 active:scale-95`}
      >
        <FiChevronUp className="w-5 h-5 animate-bounce-subtle" />
      </button>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Achievements Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-500 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-2xl mb-2 block animate-bounce-subtle">{item.icon}</span>
              <p className="text-xl font-bold bg-linear-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                {item.number}
              </p>
              <p className="text-xs text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 animate-fadeInLeft">
            <div className="flex items-center space-x-2 mb-4 group cursor-pointer" onClick={scrollToTop}>
              <div className="bg-linear-to-r from-teal-500 to-green-500 p-2 rounded-lg transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                <FiActivity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-teal-600 to-green-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                HealthNexus
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed animate-fadeIn animation-delay-200">
              Your integrated health ecosystem. Connecting you with personalized wellness plans, 
              AI-powered insights, and a community focused on holistic healthcare.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 text-sm group hover:text-teal-600 transition-colors duration-300">
                <FiMapPin className="w-4 h-4 mr-2 text-teal-600 group-hover:animate-bounce" />
                <span>123 Health Avenue, Medical District, NY 10001</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm group hover:text-teal-600 transition-colors duration-300">
                <FiPhone className="w-4 h-4 mr-2 text-teal-600 group-hover:animate-shake" />
                <span>+1 (555) 789-0123</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm group hover:text-teal-600 transition-colors duration-300">
                <FiMail className="w-4 h-4 mr-2 text-teal-600 group-hover:animate-bounce" />
                <span>care@healthnexus.com</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex space-x-2">
              <div className="bg-teal-50 p-2 rounded-lg animate-pulse-slow">
                <FiStar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-green-50 p-2 rounded-lg animate-pulse-slow animation-delay-500">
                <FiAward className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-blue-50 p-2 rounded-lg animate-pulse-slow animation-delay-1000">
                <FiGlobe className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-teal-600 text-sm transition-all duration-300 flex items-center group"
                    onMouseEnter={() => setHoveredLink(`quick-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="mr-2 transform group-hover:scale-125 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <FiArrowRight className={`w-3 h-3 mr-2 transform transition-all duration-300 ${
                      hoveredLink === `quick-${index}` ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 text-sm transition-all duration-300 flex items-center group"
                    onMouseEnter={() => setHoveredLink(`resource-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="mr-2 transform group-hover:scale-125 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <FiArrowRight className={`w-3 h-3 mr-2 transform transition-all duration-300 ${
                      hoveredLink === `resource-${index}` ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              Legal
            </h3>
            <ul className="space-y-2">
              {legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-purple-600 text-sm transition-all duration-300 flex items-center group"
                    onMouseEnter={() => setHoveredLink(`legal-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="mr-2 transform group-hover:scale-125 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <FiArrowRight className={`w-3 h-3 mr-2 transform transition-all duration-300 ${
                      hoveredLink === `legal-${index}` ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fadeInRight" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              Stay Healthy
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to get weekly health tips, wellness guides, and exclusive updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all duration-300 group-hover:shadow-lg"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-teal-500 to-green-500 text-white p-2 rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Success Message */}
              {isSubscribed && (
                <div className="bg-green-100 text-green-700 text-xs p-2 rounded-lg animate-slideIn">
                  ✓ Thanks for subscribing! Check your email.
                </div>
              )}
              
              <p className="text-xs text-gray-500 flex items-center">
                <FiHeart className="w-3 h-3 mr-1 text-red-500 animate-pulse" />
                We care about your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Social Links & Awards */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Icons with Staggered Animation */}
            <div className="flex space-x-3 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-all duration-300 hover:scale-125 hover:-translate-y-1 animate-fadeIn`}
                  style={{ animationDelay: social.delay }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* Copyright with Animation */}
            <div className="text-sm text-gray-500 flex items-center">
              <span>© {currentYear} HealthNexus.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center group">
                <span>Made with</span>
                <FiHeart className="w-4 h-4 text-red-500 mx-1 animate-heartbeat group-hover:scale-125 transition-transform" />
                <span>for better health</span>
              </span>
            </div>

            {/* App Store Badges with Hover Effects */}
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-xl group">
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>App Store</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-xl group">
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186 18.217 12 3.608 1.814z"/>
                </svg>
                <span>Google Play</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex flex-wrap justify-center gap-4 mb-2 md:mb-0">
              <a href="#" className="hover:text-teal-600 transition-colors relative group">
                Sitemap
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors relative group">
                Accessibility
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors relative group">
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors relative group">
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-teal-600 transition-colors relative group">
                HIPAA
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>Version 2.5.0</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Last updated: February 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Banner - Enhanced */}
      <div className="bg-linear-to-r from-teal-50 via-green-50 to-emerald-50 border-t-2 border-teal-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="flex items-start space-x-3">
            <div className="bg-teal-500 p-1 rounded-full animate-pulse shrink-0 mt-0.5">
              <span className="text-white text-xs">⚕️</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">
              <span className="font-semibold">Medical Disclaimer:</span> HealthNexus provides health and wellness guidance only. 
              The information on this platform is for informational purposes only and is not intended to replace professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have 
              regarding a medical condition. By using HealthNexus, you acknowledge that you have read and understood this disclaimer.
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-pattern {
          background-image: linear-linear(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-linear(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;