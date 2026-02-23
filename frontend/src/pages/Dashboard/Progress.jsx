import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

const Progress = () => {
  // Mock data for weight tracking
  const [weightData] = useState([
    { week: 'Week 1', weight: 85 },
    { week: 'Week 2', weight: 84.5 },
    { week: 'Week 3', weight: 84 },
    { week: 'Week 4', weight: 83.5 },
    { week: 'Week 5', weight: 83 },
    { week: 'Week 6', weight: 82.5 },
    { week: 'Week 7', weight: 82 },
    { week: 'Week 8', weight: 81.5 },
  ]);

  // Mock data for body measurements  
  const [measurementsData] = useState([
    { week: 'Week 1', chest: 95, waist: 85, hips: 98, arms: 35, thighs: 58 },
    { week: 'Week 4', chest: 94, waist: 83, hips: 96, arms: 34.5, thighs: 57 },
    { week: 'Week 8', chest: 93, waist: 81, hips: 94, arms: 34, thighs: 56 },
  ]);

  // Mock data for workout adherence
  const [workoutData] = useState([
    { week: 'W1', completion: 85 },
    { week: 'W2', completion: 90 },
    { week: 'W3', completion: 75 },
    { week: 'W4', completion: 95 },
    { week: 'W5', completion: 80 },
    { week: 'W6', completion: 88 },
    { week: 'W7', completion: 92 },
    { week: 'W8', completion: 87 },
  ]);

  // Mock data for diet adherence
  const [dietData] = useState([
    { week: 'W1', adherence: 78 },
    { week: 'W2', adherence: 82 },
    { week: 'W3', adherence: 88 },
    { week: 'W4', adherence: 85 },
    { week: 'W5', adherence: 90 },
    { week: 'W6', adherence: 86 },
    { week: 'W7', adherence: 91 },
    { week: 'W8', adherence: 89 },
  ]);

  // Mock data for habit score
  const [habitScoreData] = useState([
    { week: 'W1', score: 65 },
    { week: 'W2', score: 70 },
    { week: 'W3', score: 72 },
    { week: 'W4', score: 78 },
    { week: 'W5', score: 75 },
    { week: 'W6', score: 81 },
    { week: 'W7', score: 85 },
    { week: 'W8', score: 87 },
  ]);

  // Current statistics
  const stats = {
    currentWeight: 81.5,
    startWeight: 85,
    goalWeight: 75,
    weightChange: -3.5,
    currentMeasurements: {
      chest: { current: 93, change: -2 },
      waist: { current: 81, change: -4 },
      hips: { current: 94, change: -4 },
      arms: { current: 34, change: -1 },
      thighs: { current: 56, change: -2 },
    },
    workoutStats: {
      monthlyAverage: 86.5,
      totalCompleted: 42,
      missed: 6,
      bestStreak: 12,
    },
    dietStats: {
      monthlyAverage: 86.1,
      daysFollowed: 52,
      daysDeviated: 8,
      avgCalories: 2150,
    },
    habitScore: {
      current: 87,
      monthlyAverage: 76.6,
      streak: 8,
      dropOffRisk: 'Low',
    },
    goalForecast: {
      weeksToGoal: 11,
      estimatedDate: 'May 2026',
      confidence: 'High',
      weeklyRate: 0.44,
    },
  };

  const handleAddMeasurement = () => {
    // TODO: Open modal for adding new measurement
    alert('Add New Measurement - Modal to be implemented');
  };

  const handleExportData = () => {
    // TODO: Export data as CSV/PDF
    alert('Export Data - Functionality to be implemented');
  };

  const handleAddWeight = () => {
    // TODO: Open modal for adding weight
    alert('Add Weight - Modal to be implemented');
  };

  const handleUpdateMeasurements = () => {
    // TODO: Open modal for updating measurements
    alert('Update Measurements - Modal to be implemented');
  };

  return (
    <DashboardLayout>
      <div className="progress-page">
      {/* SECTION 1: PAGE HEADER */}
      <div className="page-header">
        <h1 className="page-title">Your Progress Journey</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleAddMeasurement}>
            Add New Measurement
          </button>
          <button className="btn btn-primary" onClick={handleExportData}>
            Export Data
          </button>
        </div>
      </div>

      {/* SECTION 2: WEIGHT TRACKING */}
      <div className="progress-section weight-tracking">
        <div className="section-header">
          <h2>Weight Progress</h2>
          <button className="btn btn-sm btn-primary" onClick={handleAddWeight}>
            Add Weight
          </button>
        </div>
        
        <div className="weight-stats">
          <div className="stat-card">
            <span className="stat-label">Current Weight</span>
            <span className="stat-value">{stats.currentWeight} kg</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Starting Weight</span>
            <span className="stat-value">{stats.startWeight} kg</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Goal Weight</span>
            <span className="stat-value">{stats.goalWeight} kg</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Weight Change</span>
            <span className={`stat-value ${stats.weightChange < 0 ? 'loss' : 'gain'}`}>
              {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} kg
            </span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[70, 90]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={2} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: BODY MEASUREMENTS */}
      <div className="progress-section body-measurements">
        <div className="section-header">
          <h2>Body Measurements</h2>
          <button className="btn btn-sm btn-primary" onClick={handleUpdateMeasurements}>
            Update Measurements
          </button>
        </div>

        <div className="measurements-grid">
          {Object.entries(stats.currentMeasurements).map(([key, data]) => (
            <div key={key} className="measurement-card">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <div className="measurement-value">{data.current} cm</div>
              <div className={`measurement-change ${data.change < 0 ? 'positive' : 'negative'}`}>
                {data.change > 0 ? '+' : ''}{data.change} cm since start
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={measurementsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="chest" stroke="#ef4444" strokeWidth={2} name="Chest (cm)" />
              <Line type="monotone" dataKey="waist" stroke="#f59e0b" strokeWidth={2} name="Waist (cm)" />
              <Line type="monotone" dataKey="hips" stroke="#10b981" strokeWidth={2} name="Hips (cm)" />
              <Line type="monotone" dataKey="arms" stroke="#3b82f6" strokeWidth={2} name="Arms (cm)" />
              <Line type="monotone" dataKey="thighs" stroke="#8b5cf6" strokeWidth={2} name="Thighs (cm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 4: WORKOUT COMPLETION */}
      <div className="progress-section workout-adherence">
        <h2>Workout Adherence</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Monthly Average</span>
            <span className="stat-value">{stats.workoutStats.monthlyAverage}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Workouts</span>
            <span className="stat-value">{stats.workoutStats.totalCompleted}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Missed Workouts</span>
            <span className="stat-value">{stats.workoutStats.missed}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Best Streak</span>
            <span className="stat-value">{stats.workoutStats.bestStreak} days</span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completion" fill="#10b981" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 5: DIET ADHERENCE */}
      <div className="progress-section diet-adherence">
        <h2>Diet Adherence</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Monthly Average</span>
            <span className="stat-value">{stats.dietStats.monthlyAverage}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Days Followed</span>
            <span className="stat-value">{stats.dietStats.daysFollowed}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Days Deviated</span>
            <span className="stat-value">{stats.dietStats.daysDeviated}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Calories Average</span>
            <span className="stat-value">{stats.dietStats.avgCalories} kcal/day</span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dietData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="adherence" fill="#f59e0b" name="Adherence %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 6: HABIT SCORE HISTORY */}
      <div className="progress-section habit-intelligence">
        <h2>Habit Intelligence</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Current Score</span>
            <span className="stat-value">{stats.habitScore.current}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Monthly Average</span>
            <span className="stat-value">{stats.habitScore.monthlyAverage}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{stats.habitScore.streak} days</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Drop-off Risk</span>
            <span className={`stat-value risk-${stats.habitScore.dropOffRisk.toLowerCase()}`}>
              {stats.habitScore.dropOffRisk}
            </span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={habitScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} name="Habit Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 7: GOAL TIMELINE FORECAST */}
      <div className="progress-section goal-forecast">
        <h2>Goal Prediction</h2>
        
        <div className="forecast-container">
          <div className="forecast-card">
            <div className="forecast-item">
              <span className="forecast-label">Estimated Weeks to Goal</span>
              <span className="forecast-value">{stats.goalForecast.weeksToGoal} weeks</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-label">Estimated Completion Date</span>
              <span className="forecast-value">{stats.goalForecast.estimatedDate}</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-label">Confidence Level</span>
              <span className={`forecast-value confidence-${stats.goalForecast.confidence.toLowerCase()}`}>
                {stats.goalForecast.confidence}
              </span>
            </div>
            <div className="forecast-item">
              <span className="forecast-label">Weekly Change Rate</span>
              <span className="forecast-value">{stats.goalForecast.weeklyRate} kg/week</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .progress-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f9fafb;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
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

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .progress-section {
          background: white;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .progress-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          margin: 0;
        }

        .weight-stats,
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #f9fafb;
          padding: 1.25rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
        }

        .stat-value.loss {
          color: #10b981;
        }

        .stat-value.gain {
          color: #ef4444;
        }

        .stat-value.risk-low {
          color: #10b981;
        }

        .stat-value.risk-medium {
          color: #f59e0b;
        }

        .stat-value.risk-high {
          color: #ef4444;
        }

        .chart-container {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #fafafa;
          border-radius: 8px;
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .measurement-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          border-radius: 10px;
          color: white;
          text-align: center;
        }

        .measurement-card h3 {
          font-size: 0.95rem;
          margin: 0 0 0.75rem 0;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.9;
        }

        .measurement-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .measurement-change {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .measurement-change.positive {
          color: #bbf7d0;
        }

        .measurement-change.negative {
          color: #fecaca;
        }

        .forecast-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 2rem;
          color: white;
        }

        .forecast-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .forecast-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .forecast-label {
          font-size: 0.95rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .forecast-value {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .forecast-value.confidence-high {
          color: #bbf7d0;
        }

        .forecast-value.confidence-medium {
          color: #fde68a;
        }

        .forecast-value.confidence-low {
          color: #fecaca;
        }

        @media (max-width: 768px) {
          .progress-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .progress-section {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .measurement-value {
            font-size: 1.5rem;
          }

          .forecast-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Progress;