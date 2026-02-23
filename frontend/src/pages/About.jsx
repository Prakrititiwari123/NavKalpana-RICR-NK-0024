import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTarget, FiHeart, FiTrendingUp, FiUsers, 
  FiAward, FiArrowRight, FiCheck, FiGlobe,
  FiStar, FiShield, FiBriefcase, FiCalendar
} from 'react-icons/fi';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: FiHeart,
      title: 'User First',
      description: 'Every decision we make is centered around improving our users\'s fitness journey',
      color: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: FiStar,
      title: 'Innovation',
      description: 'We continuously leverage cutting-edge AI and technology to enhance results',
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: FiShield,
      title: 'Trust & Privacy',
      description: 'Your health data is sacred and protected with military-grade encryption',
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FiTrendingUp,
      title: 'Excellence',
      description: 'We strive for the highest quality in every feature, workout, and meal plan',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50'
    }
  ];

  const team = [
    {
      name: 'Amit Sharma',
      role: 'Founder & CEO',
      bio: 'Ex-Google engineer with 10+ years in health tech',
      avatar: '👨‍💼',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Chief Fitness Officer',
      bio: 'Olympic trainer & certified nutritionist',
      avatar: '👩‍⚕️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Rajesh Singh',
      role: 'Head of AI & ML',
      bio: 'ML expert from Stanford working on personalization',
      avatar: '👨‍🔬',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Zara Khan',
      role: 'Head of Community',
      bio: 'Building the world\'s most supportive fitness community',
      avatar: '👩',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Founded NavKalpana',
      description: 'Started with a mission to democratize fitness coaching',
      icon: FiStar
    },
    {
      year: '2022',
      title: 'Crossed 10K Users',
      description: 'Strong adoption in India with 4.8-star rating',
      icon: FiUsers
    },
    {
      year: '2023',
      title: '$2M Funding Round',
      description: 'Backed by leading VCs to scale AI capabilities',
      icon: FiTrendingUp
    },
    {
      year: '2024',
      title: '100K+ Active Users',
      description: 'Expanding globally with 50+ languages',
      icon: FiGlobe
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
                  Our Story
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slideDown animation-delay-200">
                Transforming Fitness Through AI & Community
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-slideDown animation-delay-400">
                Healthnexus is on a mission to make world-class fitness coaching accessible, affordable, and personalized for everyone on the planet.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We believe everyone deserves access to world-class fitness coaching, personalized nutrition guidance, and a supportive community - regardless of their income or location.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  NavKalpana democratizes fitness by combining AI-powered personalization, expert coaching, and community support into one affordable platform.
                </p>
                <div className="flex items-center gap-3 mt-8">
                  <FiTarget className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600 font-semibold">Helping 1M users achieve their goals</span>
                </div>
              </div>

              {/* Right */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  A world where technology empowers everyone to become the healthiest version of themselves, transcending language, geography, and economic barriers.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We envision Healthnexus as the global standard for personalized, AI-driven fitness coaching - trusted by millions worldwide.
                </p>
                <div className="flex items-center gap-3 mt-8">
                  <FiGlobe className="w-6 h-6 text-purple-600" />
                  <span className="text-purple-600 font-semibold">Present in 50+ countries by 2025</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                Principles that guide every decision we make
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`${value.bgColor} rounded-2xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-700">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const IconComponent = milestone.icon;
                  return (
                    <div
                      key={index}
                      className={`flex gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Content */}
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                        <div className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                          <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                          <IconComponent className="w-7 h-7" />
                        </div>
                      </div>

                      {/* Spacer for desktop layout */}
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600">
                Passionate experts dedicated to your fitness success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Avatar */}
                  <div className={`h-32 bg-gradient-to-br ${member.color} flex items-center justify-center text-6xl`}>
                    {member.avatar}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm font-semibold text-blue-600 mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '100K+', label: 'Active Users', icon: FiUsers },
                { number: '1M+', label: 'Workouts Completed', icon: FiAward },
                { number: '50+', label: 'Countries & Languages', icon: FiGlobe },
                { number: '4.8★', label: 'Average Rating', icon: FiTrendingUp }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl px-8 sm:px-12 md:px-16 py-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Join Our Mission
              </h2>

              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Be part of the fitness revolution. Transform your body, mind, and life with NavKalpana.
              </p>

              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden inline-flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Today <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <p className="text-white text-sm mt-6 opacity-90">
                Free trial. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;