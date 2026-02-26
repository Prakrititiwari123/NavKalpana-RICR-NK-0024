import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Scale, Camera, CheckSquare, History } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import WeightTracker from './tracking/WeightTracker.jsx';
import MeasurementTracker from './tracking/MeasurementTracker.jsx';
import ProgressPhotos from './tracking/ProgressPhotos.jsx';
import AdherenceLog from './tracking/AdherenceLog.jsx';
import HistoryView from './tracking/HistoryView.jsx';
import toast from 'react-hot-toast';
import {
  getProgress,
  addWeightLog,
  deleteWeightLog,
  updateMeasurements,
  // updateAdherence
} from '../../Services/profileService.js';

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sortByDateDesc = (logs) =>
  [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const Tracking = () => {
  const [activeTab, setActiveTab] = useState('weight');
  const [loading, setLoading] = useState(true);
  
  // State for all tracking data
  const [weightLogs, setWeightLogs] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [goal, setGoal] = useState({
    targetWeight: 75,
    startWeight: 0,
    targetDate: null
  });

  const tabs = [
    { id: 'weight', label: 'Weight', icon: Scale },
    { id: 'measurements', label: 'Measurements', icon: TrendingUp },
    { id: 'photos', label: 'Progress Photos', icon: Camera },
    { id: 'adherence', label: 'Adherence', icon: CheckSquare },
    { id: 'history', label: 'History', icon: History },
  ];

  // Load data on mount
  const loadTrackingData = useCallback(async () => {
    setLoading(true);
    try {
      const progressData = await getProgress();
      
      if (progressData) {
        // Format weight logs
        const formattedWeightLogs = sortByDateDesc(
          (Array.isArray(progressData.weightLogs) ? progressData.weightLogs : [])
            .map(log => {
              const date = toDate(log?.date);
              const weight = toNumber(log?.weight);
              if (!date || weight === null) return null;

              return {
                id: log?._id || log?.id || `${date.getTime()}-${weight}`,
                date,
                weight,
                note: log?.note || '',
                change: toNumber(log?.change) || 0,
              };
            })
            .filter(Boolean)
        );

        // Format measurements
        const formattedMeasurements = progressData.measurements ? [{
          id: 'current',
          date: new Date(),
          ...progressData.measurements
        }] : [];

        // Format photos
        const formattedPhotos = (progressData.progressPhotos || []).map(photo => ({
          id: photo._id,
          date: new Date(photo.date),
          url: photo.photoUrl,
          note: photo.note
        }));

        // Format adherence logs (if they exist in array format)
        const formattedAdherence = progressData.adherenceHistory || [];

        setWeightLogs(formattedWeightLogs);
        setMeasurements(formattedMeasurements);
        setPhotos(formattedPhotos);
        setAdherenceLogs(formattedAdherence);
        
        // Set goal from progress data
        if (progressData.goal) {
          setGoal({
            targetWeight: progressData.goal.targetWeight || 75,
            startWeight: progressData.goal.startWeight || 0,
            targetDate: progressData.goal.targetDate ? new Date(progressData.goal.targetDate) : null
          });
        }
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
      toast.error('Failed to load tracking data');
      
      // Set mock data for demonstration
      setMockData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrackingData();
  }, [loadTrackingData]);

  const setMockData = () => {
    setWeightLogs([
      { id: 1, date: new Date(Date.now() - 7*24*60*60*1000), weight: 85.5, note: 'Morning weight' },
      { id: 2, date: new Date(Date.now() - 5*24*60*60*1000), weight: 84.8, note: 'After workout' },
      { id: 3, date: new Date(Date.now() - 3*24*60*60*1000), weight: 84.2, note: 'Morning weight' },
      { id: 4, date: new Date(), weight: 83.5, note: 'Current weight' },
    ]);

    setMeasurements([
      { 
        id: 1, 
        date: new Date(Date.now() - 30*24*60*60*1000), 
        chest: 95, 
        waist: 80, 
        hips: 95, 
        arms: 32, 
        thighs: 55 
      },
      { 
        id: 2, 
        date: new Date(), 
        chest: 94, 
        waist: 78, 
        hips: 94, 
        arms: 33, 
        thighs: 54 
      },
    ]);

    setPhotos([
      { id: 1, date: new Date(Date.now() - 30*24*60*60*1000), url: 'https://via.placeholder.com/300', note: 'Before' },
      { id: 2, date: new Date(), url: 'https://via.placeholder.com/300', note: 'Current' },
    ]);

    setAdherenceLogs([
      { id: 1, date: new Date(Date.now() - 7*24*60*60*1000), diet: 85, workout: 90, sleep: 80, notes: 'Good week' },
      { id: 2, date: new Date(), diet: 90, workout: 85, sleep: 95, notes: 'Feeling great' },
    ]);
  };

  // Handle weight submission
  const handleWeightSubmit = async (entry) => {
    try {
      const newWeightLog = await addWeightLog({
        date: entry.date || new Date(),
        weight: parseFloat(entry.weight),
        note: entry.note || ''
      });

      const normalizedDate = toDate(newWeightLog?.date) || new Date();
      const normalizedWeight = toNumber(newWeightLog?.weight);
      if (normalizedWeight === null) {
        throw new Error('Invalid weight log response from server');
      }

      setWeightLogs((prev) =>
        sortByDateDesc([
          {
            id: newWeightLog?._id || newWeightLog?.id || Date.now(),
            date: normalizedDate,
            weight: normalizedWeight,
            note: newWeightLog?.note || '',
            change: toNumber(newWeightLog?.change) || 0,
          },
          ...prev,
        ])
      );

      toast.success('Weight logged successfully!');
    } catch (error) {
      console.error('Error adding weight:', error);
      toast.error(error.message || 'Failed to log weight');
    }
  };

  // Handle weight delete
  const handleWeightDelete = async (id) => {
    try {
      await deleteWeightLog(id);
      setWeightLogs((prev) => prev.filter((log) => log.id !== id));
      toast.success('Weight log removed');
    } catch (error) {
      toast.error(error.message || 'Failed to remove weight log');
    }
  };

  // Handle measurement submission
  const handleMeasurementSubmit = async (entry) => {
    try {
      // Update measurements in backend
      await updateMeasurements({
        chest: parseFloat(entry.chest) || 0,
        waist: parseFloat(entry.waist) || 0,
        hips: parseFloat(entry.hips) || 0,
        arms: parseFloat(entry.arms) || 0,
        thighs: parseFloat(entry.thighs) || 0
      });

      const newMeasurement = {
        id: Date.now(),
        date: new Date(),
        chest: parseFloat(entry.chest),
        waist: parseFloat(entry.waist),
        hips: parseFloat(entry.hips),
        arms: parseFloat(entry.arms),
        thighs: parseFloat(entry.thighs)
      };

      setMeasurements((prev) => [newMeasurement, ...prev]);
      toast.success('Measurements saved successfully!');
    } catch (error) {
      console.error('Error saving measurements:', error);
      toast.error(error.message || 'Failed to save measurements');
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (photo) => {
    // This would need a file upload endpoint
    const newPhoto = {
      id: Date.now(),
      date: new Date(),
      url: photo.url || URL.createObjectURL(photo.file),
      note: photo.note || ''
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    toast.success('Photo uploaded successfully!');
  };

  // Handle photo delete
  const handlePhotoDelete = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    toast.success('Photo removed');
  };

  // Handle adherence submission
  // const handleAdherenceSubmit = async (entry) => {
  //   try {
  //     await updateAdherence({
  //       dietAdherence: entry.diet || 0,
  //       workoutAdherence: entry.workout || 0,
  //       sleepAdherence: entry.sleep || 0
  //     });

  //     const newAdherence = {
  //       id: Date.now(),
  //       date: entry.date || new Date(),
  //       diet: entry.diet,
  //       workout: entry.workout,
  //       sleep: entry.sleep,
  //       notes: entry.notes || ''
  //     };

  //     setAdherenceLogs((prev) => [newAdherence, ...prev]);
  //     toast.success('Adherence logged successfully!');
  //   } catch (error) {
  //     console.error('Error logging adherence:', error);
  //     toast.error(error.message || 'Failed to log adherence');
  //   }
  // };

  // Handle export
  const handleExport = (type) => {
    const data = getAllData();
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === 'weight' || type === 'all') {
      csvContent += "Date,Weight (kg),Note,Change\n";
      data.weight.forEach(log => {
        csvContent += `${log.date.toLocaleDateString()},${log.weight},"${log.note || ''}",${log.change || 0}\n`;
      });
    }
    
    if (type === 'measurements' || type === 'all') {
      csvContent += "\nDate,Chest (cm),Waist (cm),Hips (cm),Arms (cm),Thighs (cm)\n";
      data.measurements.forEach(m => {
        csvContent += `${m.date.toLocaleDateString()},${m.chest},${m.waist},${m.hips},${m.arms},${m.thighs}\n`;
      });
    }
    
    if (type === 'adherence' || type === 'all') {
      csvContent += "\nDate,Diet (%),Workout (%),Sleep (%),Notes\n";
      data.adherence.forEach(a => {
        csvContent += `${a.date.toLocaleDateString()},${a.diet},${a.workout},${a.sleep},"${a.notes || ''}"\n`;
      });
    }

    // Download CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tracking_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${type} data exported successfully!`);
  };

  const getAllData = () => {
    return {
      weight: weightLogs,
      measurements,
      photos,
      adherence: adherenceLogs,
    };
  };

  const sortedWeightLogs = useMemo(() => sortByDateDesc(weightLogs), [weightLogs]);

  // Calculate progress towards goal
  const calculateProgress = () => {
    if (sortedWeightLogs.length === 0) return 0;
    const currentWeight = toNumber(sortedWeightLogs[0]?.weight);
    const fallbackStart = toNumber(sortedWeightLogs[sortedWeightLogs.length - 1]?.weight);
    const startWeight = toNumber(goal.startWeight) ?? fallbackStart;
    const targetWeight = toNumber(goal.targetWeight);

    if (currentWeight === null || startWeight === null || targetWeight === null) return 0;
    
    const totalChange = startWeight - targetWeight;
    const currentChange = startWeight - currentWeight;
    
    if (totalChange === 0) return 0;
    const rawProgress = (currentChange / totalChange) * 100;
    return Math.max(0, Math.min(Math.round(rawProgress), 100));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const progressPercentage = calculateProgress();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Progress Tracking
              </h1>
            </div>
            <p className="text-gray-600">
              Monitor your weight, measurements, photos, and adherence to reach your goals.
            </p>
            
            {/* Goal Progress Bar */}
            {goal.targetWeight && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-700">Goal Progress</span>
                  <span className="text-sm font-bold text-purple-700">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Start: {goal.startWeight || sortedWeightLogs[sortedWeightLogs.length - 1]?.weight || 0} kg</span>
                  <span>Current: {sortedWeightLogs[0]?.weight || 0} kg</span>
                  <span>Goal: {goal.targetWeight} kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'weight' && (
                <WeightTracker
                  logs={weightLogs}
                  goal={goal.targetWeight}
                  onSubmit={handleWeightSubmit}
                  onDelete={handleWeightDelete}
                />
              )}

              {activeTab === 'measurements' && (
                <MeasurementTracker
                  measurements={measurements}
                  photos={photos}
                  onSubmit={handleMeasurementSubmit}
                />
              )}

              {activeTab === 'photos' && (
                <ProgressPhotos
                  photos={photos}
                  onUpload={handlePhotoUpload}
                  onDelete={handlePhotoDelete}
                />
              )}

              {activeTab === 'adherence' && (
                <AdherenceLog
                  logs={adherenceLogs}
                  // onSubmit={handleAdherenceSubmit}
                  date={new Date()}
                />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  data={getAllData()}
                  type="all"
                  onExport={handleExport}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tracking;
