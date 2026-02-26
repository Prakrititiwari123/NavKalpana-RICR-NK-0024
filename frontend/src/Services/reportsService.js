// Reports Data Service - Handles fetching and managing report data
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500';

export const reportsService = {
  // Weekly Report Data
  async getWeeklyReport(weekStart) {
   try {
      const response = await fetch(`${API_BASE_URL}/api/reports/weekly?weekStart=${weekStart}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for weekly report (API not connected)');
      return getWeeklyReportMock();
    }
  },

  // Monthly Report Data
  async getMonthlyReport(month, year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/monthly?month=${month}&year=${year}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for monthly report (API not connected)');
      return getMonthlyReportMock();
    }
  },

  // Multi-Week Report Data
  async getMultiWeekReport(weekCount, customStart, customEnd) {
    try {
      const params = new URLSearchParams({ weekCount, customStart, customEnd });
      const response = await fetch(`${API_BASE_URL}/api/reports/multiweek?${params}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for multi-week report (API not connected)');
      return getMultiWeekReportMock();
    }
  },

  // Yearly Report Data
  async getYearlyReport(year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/yearly?year=${year}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for yearly report (API not connected)');
      return getYearlyReportMock();
    }
  },

  // Workout History
  async getWorkoutHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/api/reports/workouts?${params}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for workout history (API not connected)');
      return getWorkoutHistoryMock();
    }
  },

  // Meal History
  async getMealHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/api/reports/meals?${params}`);
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('📊 Using mock data for meal history (API not connected)');
      return getMealHistoryMock();
    }
  },

  // Export as PDF
  async exportPDF(reportData, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/export/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData, options }),
      });
      if (!response.ok) throw new Error('API not available');
      return await response.blob();
    } catch (error) {
      console.info('📄 PDF export requires backend API (not yet implemented)');
      return null;
    }
  },

  // Export as CSV
  async exportCSV(reportData, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/export/csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData, options }),
      });
      if (!response.ok) throw new Error('API not available');
      return await response.blob();
    } catch (error) {
      console.info('📄 CSV export requires backend API (not yet implemented)');
      return null;
    }
  },

  // Send email report
  async emailReport(recipients, reportData, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, reportData, options }),
      });
      if (!response.ok) throw new Error('API not available');
      return await response.json();
    } catch (error) {
      console.info('✉️ Email sending requires backend API (not yet implemented)');
      return { success: true, message: 'Email simulation successful (backend not connected)' };
    }
  },
};

// Mock Data Functions (Fallback data when API is unavailable)
function getWeeklyReportMock() {
  return {
    period: 'This Week',
    totalWorkouts: 5,
    totalCalories: 14200,
    avgAdherence: 96,
    weightChange: -0.4,
    habitScore: 88,
    bestDay: 'Wednesday',
    worstDayAnalysis: 'Monday had lower completion due to travel',
    weekendVsWeekday: { weekend: 85, weekday: 98 },
    dayBreakdown: [
      { day: 'Mon', completion: 100, calories: 2100, workouts: 1 },
      { day: 'Tue', completion: 95, calories: 2050, workouts: 1 },
      { day: 'Wed', completion: 100, calories: 2200, workouts: 1 },
      { day: 'Thu', completion: 90, calories: 2000, workouts: 1 },
      { day: 'Fri', completion: 100, calories: 1950, workouts: 1 },
      { day: 'Sat', completion: 85, calories: 2000, workouts: 0 },
      { day: 'Sun', completion: 90, calories: 1900, workouts: 0 },
    ],
  };
}

function getMonthlyReportMock() {
  return {
    period: 'February 2026',
    totalWorkouts: 18,
    totalCalories: 112600,
    avgAdherence: 91,
    weightChange: -3.2,
    habitScore: 92,
    achievements: ['50 workouts', '1000 calories burned', 'Perfect week streak'],
    monthHighlight: 'Best month ever! 🎉',
    streakDays: 21,
  };
}

function getMultiWeekReportMock() {
  return {
    period: '4 Weeks',
    totalWorkouts: 16,
    totalCalories: 28400,
    avgAdherence: 94,
    weightChange: -2.3,
    measurements: {
      chest: -1.2,
      waist: -2.5,
      thigh: -1.8,
    },
    habitScore: 87,
  };
}

function getYearlyReportMock() {
  return {
    period: 'Year 2026',
    totalWorkouts: 234,
    totalCalories: 428500,
    avgAdherence: 88,
    weightChange: -18.5,
    habitScore: 89,
    achievements: ['1000+ workouts', '5M calories burned', '365-day streak'],
    annualGoals: [
      { name: 'Weight Loss', progress: 95 },
      { name: 'Strength Gain', progress: 87 },
      { name: 'Consistency', progress: 92 }
    ],
    seasonAnalysis: {
      spring: 85,
      summer: 92,
      fall: 88,
      winter: 80
    }
  };
}

function getWorkoutHistoryMock() {
  return [
    { id: 1, date: '2026-02-26', exercise: 'Bench Press', sets: 4, reps: 8, weight: 100, duration: 15, calories: 120 },
    { id: 2, date: '2026-02-25', exercise: 'Squats', sets: 5, reps: 5, weight: 150, duration: 20, calories: 180 },
    { id: 3, date: '2026-02-24', exercise: 'Deadlifts', sets: 3, reps: 5, weight: 180, duration: 12, calories: 150 },
    { id: 4, date: '2026-02-23', exercise: 'Rows', sets: 4, reps: 8, weight: 90, duration: 14, calories: 110 },
  ];
}

function getMealHistoryMock() {
  return [
    { id: 1, date: '2026-02-26', meal: 'Breakfast', food: 'Oatmeal + Banana', calories: 350, protein: 12, carbs: 55, fats: 8 },
    { id: 2, date: '2026-02-26', meal: 'Lunch', food: 'Chicken Rice', calories: 650, protein: 45, carbs: 70, fats: 12 },
    { id: 3, date: '2026-02-26', meal: 'Snack', food: 'Protein Bar', calories: 220, protein: 20, carbs: 25, fats: 5 },
    { id: 4, date: '2026-02-26', meal: 'Dinner', food: 'Salmon + Vegetables', calories: 550, protein: 50, carbs: 40, fats: 18 },
  ];
}

export default reportsService;
