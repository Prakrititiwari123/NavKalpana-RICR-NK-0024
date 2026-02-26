import React, { useState, useMemo } from 'react';
import { History, Download, Printer, Search, Calendar, Filter, X, Check, Clock, TrendingUp, TrendingDown, Scale, Camera, CheckSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const HistoryView = ({ data = {}, type = 'all', onExport }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterType, setFilterType] = useState(type);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const { weight = [], measurements = [], photos = [], adherence = [] } = data;

  // Get user info for context
  const userProfile = user?.healthData?.profile || {};
  const userGoals = user?.healthData?.goals || {};

  // Combine all entries with proper formatting
  const allEntries = useMemo(() => {
    const entries = [];

    // Weight entries
    weight.forEach((entry) => {
      entries.push({
        id: entry.id || `weight-${entry.date}`,
        type: 'weight',
        date: new Date(entry.date),
        title: 'Weight Log',
        description: `${entry.weight.toFixed(1)} kg`,
        icon: '⚖️',
        color: 'purple',
        metadata: {
          weight: entry.weight,
          change: entry.change,
          note: entry.note,
        },
      });
    });

    // Measurement entries
    measurements.forEach((entry) => {
      const measurementsList = [];
      if (entry.chest) measurementsList.push(`Chest: ${entry.chest}cm`);
      if (entry.waist) measurementsList.push(`Waist: ${entry.waist}cm`);
      if (entry.hips) measurementsList.push(`Hips: ${entry.hips}cm`);
      if (entry.arms) measurementsList.push(`Arms: ${entry.arms}cm`);
      if (entry.thighs) measurementsList.push(`Thighs: ${entry.thighs}cm`);

      entries.push({
        id: entry.id || `measurement-${entry.date}`,
        type: 'measurement',
        date: new Date(entry.date),
        title: 'Body Measurements',
        description: measurementsList.join(' • ') || 'Measurements updated',
        icon: '📏',
        color: 'blue',
        metadata: {
          chest: entry.chest,
          waist: entry.waist,
          hips: entry.hips,
          arms: entry.arms,
          thighs: entry.thighs,
        },
      });
    });

    // Photo entries
    photos.forEach((entry) => {
      entries.push({
        id: entry.id || `photo-${entry.date}`,
        type: 'photo',
        date: new Date(entry.date),
        title: 'Progress Photo',
        description: entry.note || 'Progress photo added',
        icon: '📸',
        color: 'pink',
        metadata: {
          url: entry.url,
          note: entry.note,
          filename: entry.filename,
        },
      });
    });

    // Adherence entries
    adherence.forEach((entry) => {
      const checks = [];
      if (entry.workoutCompleted) checks.push('Workout');
      if (entry.dietFollowed) checks.push('Diet');
      if (entry.waterIntake) checks.push('Water');

      entries.push({
        id: entry.id || `adherence-${entry.date}`,
        type: 'adherence',
        date: new Date(entry.date),
        title: 'Daily Check-in',
        description: checks.length > 0 ? `Completed: ${checks.join(', ')}` : 'No goals met',
        icon: '✅',
        color: 'green',
        metadata: {
          workoutCompleted: entry.workoutCompleted,
          dietFollowed: entry.dietFollowed,
          waterIntake: entry.waterIntake,
          sleepQuality: entry.sleepQuality,
          mood: entry.mood,
          energy: entry.energy,
          notes: entry.notes,
          adherenceScore: entry.adherenceScore,
        },
      });
    });

    // Sort by date
    return entries.sort((a, b) => b.date - a.date);
  }, [weight, measurements, photos, adherence]);

  // Filter and search entries
  const filteredEntries = useMemo(() => {
    return allEntries
      .filter((entry) => {
        // Filter by type
        if (filterType !== 'all' && entry.type !== filterType) return false;

        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            entry.title.toLowerCase().includes(searchLower) ||
            entry.description.toLowerCase().includes(searchLower) ||
            (entry.metadata?.note && entry.metadata.note.toLowerCase().includes(searchLower))
          );
        }

        // Filter by date range
        if (dateRange.start) {
          const startDate = new Date(dateRange.start);
          startDate.setHours(0, 0, 0, 0);
          if (entry.date < startDate) return false;
        }
        if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          if (entry.date > endDate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        return sortOrder === 'desc' ? b.date - a.date : a.date - b.date;
      });
  }, [allEntries, filterType, searchTerm, dateRange, sortOrder]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const recentEntries = allEntries.filter(e => e.date >= thirtyDaysAgo);
    
    return {
      totalEntries: allEntries.length,
      recentEntries: recentEntries.length,
      weight: weight.length,
      measurements: measurements.length,
      photos: photos.length,
      adherence: adherence.length,
      avgAdherence: adherence.length > 0 
        ? Math.round(adherence.reduce((sum, a) => sum + (a.adherenceScore || 0), 0) / adherence.length)
        : 0,
    };
  }, [allEntries, weight, measurements, photos, adherence]);

  // Export functions
  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Title', 'Description', 'Details'];
    const rows = filteredEntries.map((entry) => {
      const details = JSON.stringify(entry.metadata).replace(/,/g, ';');
      return [
        entry.date.toISOString().split('T')[0],
        entry.type,
        entry.title,
        entry.description,
        details,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    if (onExport) onExport('csv', filteredEntries.length);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Progress History - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #6b46c1; }
            .entry { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .date { color: #666; font-size: 0.9em; }
            .type { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; }
            .type-weight { background: #f3e8ff; color: #6b46c1; }
            .type-measurement { background: #dbeafe; color: #1e40af; }
            .type-photo { background: #fce7f3; color: #9d174d; }
            .type-adherence { background: #dcfce7; color: #166534; }
          </style>
        </head>
        <body>
          <h1>Progress History</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Total Entries: ${filteredEntries.length}</p>
          ${filteredEntries.map(entry => `
            <div class="entry">
              <div class="date">${entry.date.toLocaleString()}</div>
              <span class="type type-${entry.type}">${entry.type}</span>
              <h3>${entry.title}</h3>
              <p>${entry.description}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();

    if (onExport) onExport('print', filteredEntries.length);
  };

  const getTypeStyles = (color) => {
    const styles = {
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      green: 'bg-green-100 text-green-700 border-green-200',
    };
    return styles[color] || styles.purple;
  };

 

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType(type);
    setDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = searchTerm || filterType !== type || dateRange.start || dateRange.end;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Progress History</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* User context */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {userProfile?.age && <span>Age: {userProfile.age}</span>}
          {userProfile?.gender && <span>Gender: {userProfile.gender}</span>}
          {userGoals?.primaryGoal && (
            <span className="capitalize">Goal: {userGoals.primaryGoal}</span>
          )}
          {summaryStats.avgAdherence > 0 && (
            <span>Avg Adherence: {summaryStats.avgAdherence}%</span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{summaryStats.totalEntries}</p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-purple-600 mb-1">Weight</p>
          <p className="text-2xl font-bold text-purple-700">{summaryStats.weight}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-blue-600 mb-1">Measurements</p>
          <p className="text-2xl font-bold text-blue-700">{summaryStats.measurements}</p>
        </div>
        <div className="bg-pink-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-pink-600 mb-1">Photos</p>
          <p className="text-2xl font-bold text-pink-700">{summaryStats.photos}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-green-600 mb-1">Check-ins</p>
          <p className="text-2xl font-bold text-green-700">{summaryStats.adherence}</p>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-orange-600 mb-1">Last 30 Days</p>
          <p className="text-2xl font-bold text-orange-700">{summaryStats.recentEntries}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
          >
            <Clock className="w-4 h-4" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="weight">Weight Logs</option>
              <option value="measurement">Measurements</option>
              <option value="photo">Progress Photos</option>
              <option value="adherence">Daily Check-ins</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                placeholder="Start date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
          </h3>
          {filteredEntries.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing {filteredEntries.length} of {allEntries.length} total
            </span>
          )}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id || index}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  getTypeStyles(entry.color)
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-white`}>
                        {entry.type}
                      </span>
                      <span className="text-xs opacity-75">
                        {entry.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{entry.title}</h4>
                    <p className="text-sm mb-2">{entry.description}</p>
                    
                    {/* Additional details based on type */}
                    {entry.type === 'weight' && entry.metadata.change && (
                      <div className="flex items-center gap-1 text-xs">
                        {entry.metadata.change < 0 ? (
                          <TrendingDown className="w-3 h-3 text-green-600" />
                        ) : entry.metadata.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-red-600" />
                        ) : null}
                        <span className={entry.metadata.change < 0 ? 'text-green-600' : 'text-red-600'}>
                          {entry.metadata.change > 0 ? '+' : ''}{entry.metadata.change?.toFixed(1)} kg change
                        </span>
                      </div>
                    )}

                    {entry.type === 'adherence' && entry.metadata.notes && (
                      <p className="text-xs italic mt-1">"{entry.metadata.notes}"</p>
                    )}

                    {entry.type === 'adherence' && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {entry.metadata.workoutCompleted && (
                          <span className="flex items-center gap-1 text-xs">
                            <Check className="w-3 h-3 text-green-600" />
                            Workout
                          </span>
                        )}
                        {entry.metadata.dietFollowed && (
                          <span className="flex items-center gap-1 text-xs">
                            <Check className="w-3 h-3 text-green-600" />
                            Diet
                          </span>
                        )}
                        {entry.metadata.waterIntake && (
                          <span className="flex items-center gap-1 text-xs">
                            <Check className="w-3 h-3 text-green-600" />
                            Water
                          </span>
                        )}
                        {entry.metadata.sleepQuality > 0 && (
                          <span className="flex items-center gap-1 text-xs">
                            Sleep: {entry.metadata.sleepQuality}/5
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No entries found</p>
            <p className="text-gray-400 text-sm">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Start tracking your progress to see your history here'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;