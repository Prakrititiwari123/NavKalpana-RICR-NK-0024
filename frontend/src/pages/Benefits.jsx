import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, FiHeart, FiAward, FiTarget, 
  FiClock, FiUsers, FiArrowRight, FiCheck, FiBarChart2,
  FiHeadphones, FiZap, FiShield
} from 'react-icons/fi';

const Benefits = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      id: 1,
      icon: FiTrendingUp,
      title: 'Faster Results',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      description: 'See measurable progress in just 4 weeks with AI-optimized workout plans'
    },
    {
      id: 2,
      icon: FiHeart,
      title: 'Better Health',
      color: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-50',
      description: 'Improve cardiovascular health, strength, and overall fitness safely'
    },
    {
      id: 3,
      icon: FiAward,
      title: 'Stay Motivated',
      color: 'from-purple-600 to-indigo-600',
      bgColor: 'bg-purple-50',
      description: 'Earn badges, streak rewards, and celebrate milestones daily'
    },
    {
      id: 4,
      icon: FiTarget,
      title: 'Achieve Goals',
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
      description: 'Set smart goals and track progress with 99% accuracy'
    },
    {
      id: 5,
      icon: FiHeadphones,
      title: 'Personalized Guidance',
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50',
      description: 'Get AI coaching tailored to your unique body and fitness level'
    },
    {
      id: 6,
      icon: FiClock,
      title: 'Save Time',
      color: 'from-slate-600 to-gray-600',
      bgColor: 'bg-slate-50',
      description: 'No more research needed - structured workouts ready to go'
    },
    {
      id: 7,
      icon: FiUsers,
      title: 'Community Support',
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-50',
      description: 'Connect with thousands of users on the same fitness journey'
    },
    {
      id: 8,
      icon: FiZap,
      title: 'Build Habits',
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'bg-yellow-50',
      description: 'Develop consistent fitness habits with daily tracking and reminders'
    }
  ];

  const stats = [
    {
      number: '92%',
      label: 'User Success Rate',
      description: 'Users achieve their fitness goals within 6 months'
    },
    {
      number: '45 mins/day',
      label: 'Average Workout',
      description: 'Effective workouts designed for busy schedules'
    },
    {
      number: '4.8★',
      label: 'User Rating',
      description: 'Highest rated fitness coaching platform'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      text: 'NavKalpana completely transformed my fitness journey. Lost 15 kgs in 3 months!',
      avatar: '👩',
      color: 'from-pink-500 to-red-500'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Busy Professional',
      text: 'Finally found a fitness app that fits my schedule. The AI guidance is incredible.',
      avatar: '👨',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Priya Singh',
      role: 'Beginner',
      text: 'I was scared to start but NavKalpana made it so easy and encouraging.',
      avatar: '👩‍🦰',
      color: 'from-purple-500 to-pink-500'
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
                <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                  Real Benefits
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slideDown animation-delay-200">
                Transform Your Life With HealthNexus
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-slideDown animation-delay-400">
                More than just a fitness app - it's your personal AI coach, nutritionist, and accountability partner combined.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFITS GRID */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={benefit.id}
                    className="group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`${benefit.bgColor} rounded-2xl p-6 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer`}>
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {benefit.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Proven Results
              </h2>
              <p className="text-lg text-gray-600">
                Real data from real users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white mb-4 mx-auto">
                    <FiBarChart2 className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold text-gray-900 mb-2">{stat.number}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{stat.label}</h3>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY USERS LOVE IT SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Users Love Healthnexus
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Science-Backed',
                  description: 'All workouts and meal plans are based on latest fitness science and research'
                },
                {
                  title: 'Flexible & Adaptable',
                  description: 'Plans adjust based on your performance, schedule changes, and feedback'
                },
                {
                  title: 'Privacy First',
                  description: 'Your health data is encrypted and never shared with third parties'
                },
                {
                  title: 'Affordable',
                  description: 'Premium features at a fraction of personal trainer costs'
                },
                {
                  title: 'Always Available',
                  description: '24/7 access to your coach, meals plans, and support community'
                },
                {
                  title: 'Results Guaranteed',
                  description: 'See progress or get full refund within 60 days'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-600">
                        <FiCheck className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Quote */}
                  <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.text}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 rounded-3xl px-8 sm:px-12 md:px-16 py-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience These Benefits?
              </h2>

              <p className="text-lg sm:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Join 100K+ users already transforming their lives with NavKalpana
              </p>

              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-white text-green-600 rounded-xl font-bold text-lg hover:text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden inline-flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Transformation <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <p className="text-white text-sm mt-6 opacity-90">
                30-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Benefits;