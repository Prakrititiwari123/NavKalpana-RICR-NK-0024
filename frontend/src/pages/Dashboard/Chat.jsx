import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../config/Api";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hello! I'm your FitAI Coach. How can I help with your fitness journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ['Track Progress', 'Workout Help', 'Diet Advice', 'Motivation']
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // User data (in real app, this would come from context/API)
  const userData = {
    name: 'John',
    currentWeight: 72,
    goalWeight: 68,
    habitScore: 85,
    todayCalories: 1450,
    calorieTarget: 2200,
    workoutToday: 'Chest Day',
    lastWorkout: 'Yesterday',
    streak: 7,
    protein: { current: 89, target: 150 },
    carbs: { current: 120, target: 250 },
    fat: { current: 35, target: 60 }
  };

  // Chat history
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Why am I not losing weight?', date: 'Yesterday', preview: 'Based on your data...' },
    { id: 2, title: 'Protein intake advice', date: '3 days ago', preview: 'For your weight...' },
    { id: 3, title: 'Feeling tired during workouts', date: '1 week ago', preview: 'This could be due to...' },
    { id: 4, title: 'Meal ideas for vegetarian', date: '2 weeks ago', preview: 'Here are some high-protein...' }
  ]);

  // Quick questions buttons
  const quickQuestions = [
    { id: 1, text: "📊 How's my progress?", icon: '📊' },
    { id: 2, text: "🍽️ What should I eat today?", icon: '🍽️' },
    { id: 3, text: "💪 Modify my workout", icon: '💪' },
    { id: 4, text: "😴 I'm feeling tired", icon: '😴' },
    { id: 5, text: "🥗 Meal ideas", icon: '🥗' },
    { id: 6, text: "🔥 Motivation", icon: '🔥' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Get AI response from backend
 const getAIResponse = async (userMessage) => {
  setIsTyping(true);
  
  try {
    // Add user context to the message for better responses
    const contextualMessage = `
      User Context:
      - Current Weight: ${userData.currentWeight}kg
      - Goal Weight: ${userData.goalWeight}kg
      - Habit Score: ${userData.habitScore}/100
      - Today's Calories: ${userData.todayCalories}/${userData.calorieTarget}
      - Workout Today: ${userData.workoutToday}
      - Streak: ${userData.streak} days
      - Protein: ${userData.protein.current}/${userData.protein.target}g
      - Carbs: ${userData.carbs.current}/${userData.carbs.target}g
      - Fat: ${userData.fat.current}/${userData.fat.target}g

      User Question: ${userMessage}

      Please provide a helpful fitness response based on this context. Keep it concise and actionable.
    `;

    console.log('Sending request to:', '/api/v1/ai/ask-ai'); // Debug log
    
    // FIXED: Correct endpoint path
    const { data } = await api.post("/api/v1/ai/ask-ai", {
      message: contextualMessage,
    });

    console.log('Response received:', data); // Debug log

    // Determine options based on response content
    let options = [];
    const responseLower = data.reply.toLowerCase();
    
    if (responseLower.includes('weight') || responseLower.includes('calorie')) {
      options = ['Show meal plan', 'Adjust calories', 'Cardio exercises'];
    } else if (responseLower.includes('protein') || responseLower.includes('diet') || responseLower.includes('eat')) {
      options = ['Create meal plan', 'More protein foods', 'Protein powder advice'];
    } else if (responseLower.includes('workout') || responseLower.includes('exercise')) {
      options = ['Modify workout', 'Alternative exercises', 'Form tips'];
    } else if (responseLower.includes('tired') || responseLower.includes('fatigue')) {
      options = ['Take rest day', 'Increase calories', 'Stretching routine'];
    } else if (responseLower.includes('progress')) {
      options = ['View detailed stats', 'Set new goal', 'Share progress'];
    } else if (responseLower.includes('motivation')) {
      options = ['More motivation', 'Success stories', 'Weekly challenge'];
    } else {
      options = ['Ask about workouts', 'Ask about diet', 'Check progress'];
    }

    const newMessage = {
      id: messages.length + 2,
      type: 'ai',
      text: data.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: options
    };

    setMessages(prev => [...prev, newMessage]);
  } catch (error) {
    console.error('Error getting AI response:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config // This will show the full URL that was called
    });
    
    // Fallback error message
    const errorMessage = {
      id: messages.length + 2,
      type: 'ai',
      text: `I'm having trouble connecting right now. (Error: ${error.response?.status || 'Network'})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ['Try again', 'Contact support']
    };
    
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};

  // Optional: Stream response implementation
 const getAIStreamResponse = async (userMessage) => {
  setIsTyping(true);
  
  try {
    const tempMessageId = messages.length + 2;
    setMessages(prev => [...prev, {
      id: tempMessageId,
      type: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    }]);

    const contextualMessage = `
      User Context:
      - Current Weight: ${userData.currentWeight}kg
      - Goal Weight: ${userData.goalWeight}kg
      - Habit Score: ${userData.habitScore}/100
      - Today's Calories: ${userData.todayCalories}/${userData.calorieTarget}
      - Workout Today: ${userData.workoutToday}
      - Streak: ${userData.streak} days
      - Protein: ${userData.protein.current}/${userData.protein.target}g
      - Carbs: ${userData.carbs.current}/${userData.carbs.target}g
      - Fat: ${userData.fat.current}/${userData.fat.target}g

      User Question: ${userMessage}
    `;

    const response = await fetch('http://localhost:5000/api/v1/ai/ask-ai-stream', { // FIXED: Added /api/v1/
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: contextualMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      fullText += chunk;
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId 
          ? { ...msg, text: fullText }
          : msg
      ));
    }

    setMessages(prev => prev.map(msg => 
      msg.id === tempMessageId 
        ? { 
            ...msg, 
            isStreaming: false,
            options: ['Ask another question', 'Get more details', 'Save this advice']
          }
        : msg
    ));

  } catch (error) {
    console.error('Error streaming AI response:', error);
  } finally {
    setIsTyping(false);
  }
};



  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');

    // Get AI response (you can switch between regular and stream)
    await getAIResponse(messageToSend);
    // await getAIStreamResponse(messageToSend); // Uncomment for streaming
  };

  const handleQuickQuestion = (question) => {
    // Add user message from quick question
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: question.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    getAIResponse(question.text);
  };

  const handleOptionClick = (option) => {
    setInputMessage(option);
    // Auto-submit after a short delay
    setTimeout(() => {
      handleSendMessage(new Event('submit'));
    }, 100);
  };

  const loadChatHistory = (chat) => {
    setSelectedChat(chat.id);
    setShowHistory(false);
    
    // In real app, you'd load the actual chat messages from backend
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: `👋 Continuing our conversation about "${chat.title}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 2,
        type: 'ai',
        text: chat.preview,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute left-5 top-50 md:left-10 md:top-10 p-2.5 rounded-xl bg-linear-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl z-20"
        title="Back to Dashboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex gap-6">
          {/* Chat History Sidebar */}
          {showHistory && (
            <div
              data-aos="fade-right"
              data-aos-duration="800"
              className="w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto border border-purple-100"
            >
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                Recent Chats
              </h3>
              <div className="space-y-2.5">
                {chatHistory.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => loadChatHistory(chat)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedChat === chat.id 
                        ? 'bg-linear-to-r from-purple-100 to-pink-100 shadow-md border-2 border-purple-300' 
                        : 'bg-gray-50 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-transparent'
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-800 truncate mb-1">{chat.title}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {chat.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className={`flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-purple-100 transition-all duration-500 ${
              showHistory ? '' : 'max-w-5xl mx-auto'
            }`}
          >
            {/* Context Panel (User Stats) */}
            {showContext && (
              <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center">
                      <span className="text-2xl mr-2">📊</span>
                      Your Stats
                    </h3>
                    <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <p className="text-xs opacity-90">Streak</p>
                        <p className="text-lg font-bold">{userData.streak} days</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Weight', value: `${userData.currentWeight}kg`, icon: '⚖️', color: 'from-blue-400 to-blue-600' },
                      { label: 'Habit Score', value: userData.habitScore, icon: '⭐', color: 'from-yellow-400 to-orange-500' },
                      { label: 'Calories', value: `${userData.todayCalories}/${userData.calorieTarget}`, icon: '🔥', color: 'from-red-400 to-pink-600' },
                      { label: 'Today', value: userData.workoutToday, icon: '💪', color: 'from-green-400 to-emerald-600' }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 transform hover:scale-105 transition-all duration-300 hover:bg-white/30">
                        <p className="text-xs opacity-90 mb-1 flex items-center">
                          <span className="mr-1">{stat.icon}</span>
                          {stat.label}
                        </p>
                        <p className="text-lg font-bold truncate">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Protein', current: userData.protein.current, target: userData.protein.target, icon: '💪', color: 'bg-blue-400' },
                      { label: 'Carbs', current: userData.carbs.current, target: userData.carbs.target, icon: '🍚', color: 'bg-yellow-400' },
                      { label: 'Fat', current: userData.fat.current, target: userData.fat.target, icon: '🥑', color: 'bg-green-400' }
                    ].map((macro, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-xs opacity-90 mb-1.5">{macro.icon} {macro.label}</p>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span>{macro.current}g</span>
                          <span className="opacity-75">/ {macro.target}g</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${macro.color} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className="h-[calc(100vh-320px)] overflow-y-auto p-6 space-y-4 bg-linear-to-b from-gray-50/50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                >
                  <div className={`max-w-[80%] group ${
                    message.type === 'user' 
                      ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white rounded-2xl rounded-tr-sm shadow-lg hover:shadow-xl' 
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-md hover:shadow-lg border border-gray-100'
                  } p-4 transition-all duration-300 transform hover:scale-[1.02]`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                          <span className="text-sm">🤖</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">FitAI Coach</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                        {message.isStreaming && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-purple-500 animate-pulse">Typing...</span>
                          </>
                        )}
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                    
                    {/* Options Buttons */}
                    {message.options && message.options.length > 0 && !message.isStreaming && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                              message.type === 'ai'
                                ? 'bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-200'
                                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.type === 'user' && (
                      <div className="text-right mt-2 pt-2 border-t border-white/20">
                        <span className="text-xs opacity-75">{message.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && !messages.some(m => m.isStreaming) && (
                <div className="flex justify-start animate-fadeInUp">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-md border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                        <span className="text-sm">🤖</span>
                      </div>
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2.5 h-2.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-6 py-4 bg-linear-to-r from-purple-50/50 to-pink-50/50 border-t border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Ready to help
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-4 py-2.5 bg-white hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl text-sm text-gray-700 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200 hover:border-purple-300 font-medium"
                    disabled={isTyping}
                  >
                    <span className="mr-1.5">{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-purple-100 p-5 bg-white/80 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about fitness..."
                    className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
                    disabled={isTyping}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className={`px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    !inputMessage.trim() || isTyping
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
                  }`}
                >
                  {isTyping ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  ) : (
                    <span className="flex items-center">
                      Send
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
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

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default Chat;