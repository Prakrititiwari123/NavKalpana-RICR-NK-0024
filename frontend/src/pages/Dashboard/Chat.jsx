import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello John! How can I help with your fitness journey today?",
      timestamp: new Date(Date.now() - 5000),
      reactions: { thumbsUp: 0, thumbsDown: 0 },
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Chat history
  const chatHistory = [
    { id: 1, title: "Why am I not losing weight?", date: "Yesterday", time: "2:30 PM" },
    { id: 2, title: "Should I increase protein?", date: "3 days ago", time: "10:15 AM" },
    { id: 3, title: "Feeling tired during workouts", date: "1 week ago", time: "5:45 PM" },
  ];

  // Quick question options
  const quickQuestions = [
    "How's my progress?",
    "What should I eat today?",
    "Modify my workout",
    "I'm feeling tired",
    "Meal ideas",
    "Motivation",
  ];

  // User context stats
  const userContext = {
    todayCalories: { consumed: 1850, target: 2100 },
    workoutToday: "Upper Body Strength",
    habitScore: 87,
    lastLogged: "2 hours ago",
  };

  // Sample conversation for demo
  const sampleConversation = [
    {
      id: 2,
      type: 'user',
      text: "Why am I not losing weight even though I'm working out?",
      timestamp: new Date(Date.now() - 4000),
    },
    {
      id: 3,
      type: 'ai',
      text: `Based on your data:
• You've lost 0.1 kg this week
• Your calorie deficit is only 150 kcal/day
• Workout adherence: 85%
• Diet adherence: 60%

Recommendation: Try increasing your deficit by 150 kcal by reducing carbs slightly. Also, your diet adherence dropped last week. Can you tell me what happened?`,
      timestamp: new Date(Date.now() - 3000),
      reactions: { thumbsUp: 0, thumbsDown: 0 },
    },
    {
      id: 4,
      type: 'user',
      text: "I ate out a few times",
      timestamp: new Date(Date.now() - 2000),
    },
    {
      id: 5,
      type: 'ai',
      text: `That's completely normal! Here's how to handle restaurant meals:
1. Choose grilled over fried
2. Ask for dressings on side
3. Watch portion sizes

Want me to suggest some healthy restaurant options?`,
      timestamp: new Date(Date.now() - 1000),
      reactions: { thumbsUp: 0, thumbsDown: 0 },
    },
  ];

  useEffect(() => {
    // Load sample conversation after a delay
    const timer = setTimeout(() => {
      setMessages([...messages, ...sampleConversation]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with typing indicator
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        text: "I understand your question. Based on your current data and progress, let me provide you with personalized insights and recommendations...",
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 2000);
  };

  const handleQuickQuestion = (question) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: question,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setIsTyping(true);

    // Simulate AI response based on question with typing indicator
    setTimeout(() => {
      setIsTyping(false);
      let response = "";
      if (question === "How's my progress?") {
        response = `Great question! Here's your progress summary:
• Weight: Lost 2.5 kg in 8 weeks
• Workout adherence: 86.5%
• Diet adherence: 86.1%
• Habit score: ${userContext.habitScore}

You're doing fantastic! Keep up the great work! 💪`;
      } else if (question === "What should I eat today?") {
        response = `Based on your remaining calories (${userContext.todayCalories.target - userContext.todayCalories.consumed} kcal), here are some meal ideas:

Lunch: Grilled chicken breast with quinoa and vegetables (450 kcal)
Snack: Greek yogurt with berries (150 kcal)
Dinner: Baked salmon with sweet potato (500 kcal)

This keeps you on track with your macros! 🥗`;
      } else if (question === "Motivation") {
        response = `You've come so far! 🌟

Remember why you started:
• You've already lost 2.5 kg
• Your consistency has improved 15%
• You're 88% likely to reach your goal

Every workout counts. Every healthy meal matters. You're not just changing your body - you're building discipline, resilience, and a better version of yourself.

Keep pushing! I believe in you! 💪🔥`;
      } else if (question === "I'm feeling tired") {
        response = `I notice you're feeling tired. Let's identify why:

📊 Checking your data:
• Sleep last night: 6.5 hours (below your 7-8h target)
• Today's workout intensity: High
• Calories consumed: Below target by 250 kcal

💡 Recommendations:
1. Prioritize 7-8 hours of sleep tonight
2. Consider a rest day or light activity
3. Ensure you're eating enough - add a nutrient-dense snack
4. Stay hydrated (aim for 2-3L water)

Your body needs recovery to grow stronger! Listen to it. 💙`;
      } else {
        response = `I'm here to help with "${question}". Let me analyze your data and provide personalized recommendations...`;
      }

      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        text: response,
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        text: "Hello! Starting a new conversation. How can I assist you today?",
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      },
    ]);
  };

  const handleLoadHistory = (historyItem) => {
    // Load a previous conversation
    alert(`Loading conversation: ${historyItem.title}`);
    setShowHistory(false);
  };

  const handleReaction = (messageId, reactionType) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId && msg.reactions) {
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reactionType]: msg.reactions[reactionType] + 1
          }
        };
      }
      return msg;
    }));
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification (you can add a toast library)
    alert('Message copied to clipboard!');
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("This is a voice message transcription example");
      }, 3000);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      {/* SECTION 1: PAGE HEADER */}
      <div className="chat-header">
        <div className="header-left">
          <div className="ai-avatar">
            <div className="avatar-icon">🤖</div>
            <div className="status-indicator"></div>
          </div>
          <div className="header-info">
            <h1 className="header-title">Healthnexus Coach</h1>
            <span className="status-text">● Online</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowHistory(!showHistory)}>
            📋 History
          </button>
          <button className="btn btn-primary" onClick={handleNewChat}>
            ➕ New Chat
          </button>
        </div>
      </div>

      <div className="chat-container">
        {/* SECTION 2: CHAT HISTORY (Sidebar) */}
        {showHistory && (
          <div className="chat-history-sidebar">
            <h3>Recent Conversations</h3>
            <div className="history-list">
              {chatHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => handleLoadHistory(item)}
                >
                  <div className="history-title">{item.title}</div>
                  <div className="history-meta">
                    {item.date} • {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: MAIN CHAT WINDOW */}
        <div className="chat-main">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`message-wrapper ${message.type} ${index === messages.length - 1 ? 'latest' : ''}`}
                onMouseEnter={() => setHoveredMessage(message.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                {message.type === 'ai' && (
                  <div className="message-avatar pulse">🤖</div>
                )}
                <div className={`message-bubble ${message.type}`}>
                  <div className="message-text">{message.text}</div>
                  <div className="message-footer">
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                    {message.type === 'ai' && hoveredMessage === message.id && (
                      <div className="message-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleCopyMessage(message.text)}
                          title="Copy message"
                        >
                          📋
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => handleReaction(message.id, 'thumbsUp')}
                          title="Helpful"
                        >
                          👍 {message.reactions?.thumbsUp > 0 && message.reactions.thumbsUp}
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => handleReaction(message.id, 'thumbsDown')}
                          title="Not helpful"
                        >
                          👎 {message.reactions?.thumbsDown > 0 && message.reactions.thumbsDown}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="message-avatar user">👤</div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-wrapper ai typing-indicator">
                <div className="message-avatar pulse">🤖</div>
                <div className="message-bubble ai">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* SECTION 4: QUICK QUESTIONS */}
          <div className="quick-questions">
            <div className="quick-questions-label">Quick Questions:</div>
            <div className="quick-questions-buttons">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <button 
              type="button" 
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceInput}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? '🔴' : '🎤'}
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder={isRecording ? "Listening..." : "Ask me anything about your fitness journey..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isRecording}
            />
            <button type="submit" className="send-button" disabled={!inputMessage.trim()}>
              ➤
            </button>
          </form>
        </div>

        {/* SECTION 5: CONTEXT PANEL */}
        <div className={`context-panel ${!showContextPanel ? 'collapsed' : ''}`}>
          <div className="context-header">
            <h3>Your Stats</h3>
            <button 
              className="toggle-panel-btn"
              onClick={() => setShowContextPanel(!showContextPanel)}
              title={showContextPanel ? "Collapse panel" : "Expand panel"}
            >
              {showContextPanel ? '→' : '←'}
            </button>
          </div>
          
          {showContextPanel && (
            <>
              <div className="context-card animate-in">
                <div className="context-icon">🍽️</div>
                <div className="context-info">
                  <div className="context-label">Today's Calories</div>
                  <div className="context-value">
                    {userContext.todayCalories.consumed} / {userContext.todayCalories.target}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min((userContext.todayCalories.consumed / userContext.todayCalories.target) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="context-card animate-in" style={{animationDelay: '0.1s'}}>
                <div className="context-icon">🏋️</div>
                <div className="context-info">
                  <div className="context-label">Workout Today</div>
                  <div className="context-value small">{userContext.workoutToday}</div>
                </div>
              </div>

              <div className="context-card animate-in" style={{animationDelay: '0.2s'}}>
                <div className="context-icon">⭐</div>
                <div className="context-info">
                  <div className="context-label">Habit Score</div>
                  <div className="context-value score">{userContext.habitScore}</div>
                </div>
              </div>

              <div className="context-card animate-in" style={{animationDelay: '0.3s'}}>
                <div className="context-icon">🕒</div>
                <div className="context-info">
                  <div className="context-label">Last Logged</div>
                  <div className="context-value small">{userContext.lastLogged}</div>
                </div>
              </div>

              <div className="ai-insights animate-in" style={{animationDelay: '0.4s'}}>
                <h4>💡 AI Insights</h4>
                <ul>
                  <li>You're 88% likely to reach your goal by May 2026</li>
                  <li>Your workout consistency improved 15% this month</li>
                  <li>Consider adding more protein at breakfast</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .chat-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }

        .chat-header {
          background: white;
          padding: 1.25rem 2rem;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ai-avatar {
          position: relative;
        }

        .avatar-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid white;
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .status-text {
          font-size: 0.875rem;
          color: #10b981;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #4f46e5;
          border: 2px solid #4f46e5;
        }

        .btn-secondary:hover {
          background: #f5f3ff;
        }

        .chat-container {
          flex: 1;
          display: grid;
          grid-template-columns: ${showHistory ? '280px 1fr 320px' : '1fr 320px'};
          gap: 0;
          overflow: hidden;
        }

        .chat-history-sidebar {
          background: white;
          border-right: 2px solid #e5e7eb;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .chat-history-sidebar h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1rem 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .history-item {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid #e5e7eb;
        }

        .history-item:hover {
          background: #f3f4f6;
          border-color: #4f46e5;
          transform: translateX(4px);
        }

        .history-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .history-meta {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .chat-main {
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .message-wrapper.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .message-avatar.user {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
        }

        .message-bubble {
          max-width: 70%;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          position: relative;
        }

        .message-bubble.ai {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
        }

        .message-text {
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-line;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          gap: 0.5rem;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .message-actions {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          animation: fadeIn 0.3s ease-in;
        }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn:hover {
          background: rgba(79, 70, 229, 0.1);
          transform: scale(1.1);
        }

        /* Typing Indicator Animation */
        .typing-indicator {
          animation: slideInLeft 0.3s ease-out;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 0.5rem 0;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #4f46e5;
          border-radius: 50%;
          animation: typingDot 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* Pulse Animation for Avatar */
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(102, 126, 234, 0);
          }
        }

        /* Message Entry Animation */
        .message-wrapper.latest {
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .quick-questions {
          padding: 1rem 2rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .quick-questions-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .quick-questions-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-question-btn {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .quick-question-btn:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
          transform: translateY(-1px);
        }

        .chat-input-form {
          padding: 1.5rem 2rem;
          background: white;
          border-top: 2px solid #e5e7eb;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .voice-button {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-button:hover {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .voice-button.recording {
          background: #fee2e2;
          border-color: #ef4444;
          animation: recordingPulse 1.5s ease-in-out infinite;
        }

        @keyframes recordingPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
          }
        }

        .chat-input {
          flex: 1;
          padding: 0.875rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .chat-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .chat-input:disabled {
          background: #f9fafb;
          color: #6b7280;
        }

        .send-button {
          width: 48px;
          height: 48px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          background: #4338ca;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .context-panel {
          background: white;
          border-left: 2px solid #e5e7eb;
          padding: 1.5rem;
          overflow-y: auto;
          transition: all 0.3s ease;
          position: relative;
        }

        .context-panel.collapsed {
          width: 60px;
          padding: 1.5rem 0.5rem;
        }

        .context-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .context-panel h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .toggle-panel-btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .toggle-panel-btn:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
          transform: scale(1.1);
        }

        .context-card {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .context-card:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #4f46e5;
        }

        .animate-in {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .context-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .context-info {
          flex: 1;
        }

        .context-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .context-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }

        .context-value.small {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .context-value.score {
          font-size: 2rem;
          color: #10b981;
        }

        .progress-bar {
          margin-top: 0.5rem;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          transition: width 0.6s ease-out;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .ai-insights {
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 10px;
          border: 1px solid #fbbf24;
          transition: all 0.2s;
        }

        .ai-insights:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }

        .ai-insights h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 0.75rem 0;
        }

        .ai-insights ul {
          margin: 0;
          padding-left: 1.25rem;
          list-style: none;
        }

        .ai-insights li {
          font-size: 0.875rem;
          color: #78350f;
          margin-bottom: 0.5rem;
          position: relative;
          line-height: 1.5;
        }

        .ai-insights li::before {
          content: '✓';
          position: absolute;
          left: -1.25rem;
          color: #10b981;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .chat-container {
            grid-template-columns: 1fr;
          }

          .context-panel,
          .chat-history-sidebar {
            display: none;
          }

          .context-panel.collapsed {
            display: block;
          }

          .message-bubble {
            max-width: 85%;
          }
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 1rem;
          }

          .header-title {
            font-size: 1.25rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .messages-container {
            padding: 1rem;
          }

          .quick-questions {
            padding: 1rem;
          }

          .chat-input-form {
            padding: 1rem;
          }

          .message-bubble {
            max-width: 90%;
          }

          .voice-button, .send-button {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;