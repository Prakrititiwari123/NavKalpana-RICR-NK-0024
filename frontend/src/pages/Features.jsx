import { useNavigate } from 'react-router-dom';
import { 
  FiActivity, FiCoffee, FiTrendingUp, FiZap, 
  FiMessageSquare, FiSmartphone, FiArrowRight, FiCheck
} from 'react-icons/fi';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      icon: FiActivity,
      title: 'AI Workout Generator',
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
      highlights: [
        'Daily personalized workouts',
        'Based on your level (Beginner/Intermediate)',
        'Adjusts as you progress',
        'Exercise videos & form guidance'
      ]
    },
    {
      id: 2,
      icon: FiCoffee,
      title: 'Smart Meal Planner',
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50',
      highlights: [
        'Calories calculated for your goal',
        'Macro split (Protein/Carbs/Fats)',
        'Diet preferences (Veg/Non-veg/Vegan)',
        'Meal reminders'
      ]
    },
    {
      id: 3,
      icon: FiTrendingUp,
      title: 'Progress Tracker',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      highlights: [
        'Weight tracking graph',
        'Body measurements (Chest, Waist, Arms)',
        'Workout completion %',
        'Diet adherence %'
      ]
    },
    {
      id: 4,
      icon: FiZap,
      title: 'Habit Score',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      highlights: [
        'Daily habit tracking',
        'Streak counter',
        'Motivation messages',
        'Consistency rewards'
      ]
    },
    {
      id: 5,
      icon: FiMessageSquare,
      title: 'AI Chat Assistant',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-50',
      highlights: [
        'Ask fitness questions',
        'Get instant answers',
        'Workout modifications',
        'Diet suggestions'
      ]
    },
    {
      id: 6,
      icon: FiSmartphone,
      title: 'Mobile Friendly',
      color: 'from-gray-600 to-slate-600',
      bgColor: 'bg-gray-50',
      highlights: [
        'Works on phone, tablet, laptop',
        'Easy to use anywhere',
        'No app download needed',
        'Sync across all devices'
      ]
    }
  ];

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
        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6 animate-slideDown">
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                  Powerful Features
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slideDown animation-delay-200">
                Everything You Need to Transform Your Fitness
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-slideDown animation-delay-400">
                Harness the power of AI-driven insights, personalized guidance, and comprehensive tracking to achieve your fitness goals faster than ever before.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`${feature.bgColor} rounded-2xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer`}>
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {feature.title}
                      </h3>

                      {/* Highlights */}
                      <ul className="space-y-4">
                        {feature.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className={`yshrink-0 w-5 h-5 rounded-full bg-linear-to-br ${feature.color} text-white flex items-center justify-center mt-0.5`}>
                              <FiCheck className="w-3 h-3" />
                            </div>
                            <span className="text-gray-700">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DETAILED FEATURES SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose NavKalpana?
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive tools designed for your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left - Features List */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="yshrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
                      <FiCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI-Powered Personalization</h3>
                    <p className="text-gray-600 mt-2">Get recommendations tailored to your fitness level, goals, and preferences</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="yshrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-600">
                      <FiCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Real-Time Progress Monitoring</h3>
                    <p className="text-gray-600 mt-2">Track your improvements with detailed analytics and visual progress graphs</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="yshrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 text-purple-600">
                      <FiCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">24/7 AI Support</h3>
                    <p className="text-gray-600 mt-2">Get instant answers to your fitness and nutrition questions anytime</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="yshrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-100 text-orange-600">
                      <FiCheck className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Seamless Experience</h3>
                    <p className="text-gray-600 mt-2">Access your dashboard across all devices with automatic synchronization</p>
                  </div>
                </div>
              </div>

              {/* Right - Stats */}
              <div className="grid grid-cols-1 gap-6">
                <div className="group bg-linear-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-5xl font-bold mb-2">1000+</p>
                  <p className="text-xl opacity-90">Workout Programs</p>
                  <p className="text-sm opacity-75 mt-2">Updated regularly based on fitness science</p>
                </div>

                <div className="group bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-5xl font-bold mb-2">5000+</p>
                  <p className="text-xl opacity-90">Meal Plans</p>
                  <p className="text-sm opacity-75 mt-2">Customized for different diets and goals</p>
                </div>

                <div className="group bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <p className="text-5xl font-bold mb-2">100K+</p>
                  <p className="text-xl opacity-90">Happy Users</p>
                  <p className="text-sm opacity-75 mt-2">Achieving their fitness goals daily</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-blue-600 via-cyan-600 to-purple-600 rounded-3xl px-8 sm:px-12 md:px-16 py-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Fitness Journey?
              </h2>

              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are achieving their goals with NavKalpana's AI-powered fitness platform.
              </p>

              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden inline-flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <p className="text-white text-sm mt-6 opacity-90">
                No credit card required. Start your free trial today.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE COMPARISON */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Complete Fitness Ecosystem
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need in one platform
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Personalized Workouts', value: '✓', color: 'blue' },
                { label: 'Smart Nutrition Plans', value: '✓', color: 'orange' },
                { label: 'Progress Analytics', value: '✓', color: 'green' },
                { label: 'Habit Tracking', value: '✓', color: 'purple' },
                { label: '24/7 AI Assistant', value: '✓', color: 'indigo' },
                { label: 'Mobile App Access', value: '✓', color: 'gray' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`yshrink-0 w-12 h-12 rounded-full bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center text-xl font-bold`}>
                    {item.value}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features;