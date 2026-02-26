import React, { useState, useMemo } from 'react';
import { Ruler, TrendingDown, TrendingUp, Camera, Calendar, User, Target } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';

const MeasurementTracker = ({ measurements = [], photos = [], onSubmit }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    hips: '',
    thighs: '',
    arms: '',
    calves: '',
  });

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userProfile = userHealthData.profile || {};
  const userVitals = userHealthData.vitals || {};
  const userGoals = userHealthData.goals || {};

  // Sort measurements by date (newest first)
  const sortedMeasurements = useMemo(() => {
    return [...measurements].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [measurements]);

  const latestMeasurement = useMemo(() => {
    if (sortedMeasurements.length === 0) return null;
    return sortedMeasurements[0];
  }, [sortedMeasurements]);

  const previousMeasurement = useMemo(() => {
    if (sortedMeasurements.length < 2) return null;
    return sortedMeasurements[1];
  }, [sortedMeasurements]);

  // Calculate changes
  const calculateChange = (current, previous) => {
    if (!previous || !current) return null;
    const change = current - previous;
    const percentage = previous !== 0 ? ((change / previous) * 100).toFixed(1) : '0';
    return { change: change.toFixed(1), percentage };
  };

  // Calculate overall progress
  const calculateOverallProgress = useMemo(() => {
    if (!latestMeasurement || !previousMeasurement) return null;
    
    const parts = ['chest', 'waist', 'hips', 'thighs', 'arms', 'calves'];
    let totalChange = 0;
    let validParts = 0;

    parts.forEach(part => {
      const current = latestMeasurement[part];
      const previous = previousMeasurement[part];
      if (current && previous) {
        totalChange += (current - previous);
        validParts++;
      }
    });

    if (validParts === 0) return null;
    return {
      average: (totalChange / validParts).toFixed(1),
      total: totalChange.toFixed(1),
      parts: validParts
    };
  }, [latestMeasurement, previousMeasurement]);

  // Calculate BMI from user data
  const calculateBMI = () => {
    if (userVitals?.height && userVitals?.currentWeight) {
      const heightInMeters = userVitals.height / 100;
      const bmi = (userVitals.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasValues = Object.values(formData).some((val) => val !== '');
    if (hasValues) {
      const measurement = Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = value ? parseFloat(value) : null;
        return acc;
      }, {});
      onSubmit(measurement);
      setFormData({
        chest: '',
        waist: '',
        hips: '',
        thighs: '',
        arms: '',
        calves: '',
      });
      setShowForm(false);
    }
  };

  const bodyParts = [
    { key: 'chest', label: 'Chest', icon: '💪', description: 'Around the fullest part' },
    { key: 'waist', label: 'Waist', icon: '⚡', description: 'At navel level' },
    { key: 'hips', label: 'Hips', icon: '🔥', description: 'Widest part' },
    { key: 'thighs', label: 'Thighs', icon: '🦵', description: 'Largest part' },
    { key: 'arms', label: 'Arms', icon: '💪', description: 'Flexed or relaxed' },
    { key: 'calves', label: 'Calves', icon: '🦿', description: 'Largest part' },
  ];

  // Get recommended measurements based on user profile
  const getRecommendedMeasurements = useMemo(() => {
    const gender = userProfile?.gender;
    const height = userVitals?.height;
    
    if (!height) return null;

    // Very rough estimates - these should come from actual health standards
    const recommendations = {};
    
    if (gender === 'male') {
      recommendations.chest = height * 0.55;
      recommendations.waist = height * 0.45;
      recommendations.hips = height * 0.52;
      recommendations.thighs = height * 0.3;
      recommendations.arms = height * 0.18;
    } else if (gender === 'female') {
      recommendations.chest = height * 0.52;
      recommendations.waist = height * 0.38;
      recommendations.hips = height * 0.55;
      recommendations.thighs = height * 0.32;
      recommendations.arms = height * 0.16;
    }

    return recommendations;
  }, [userProfile?.gender, userVitals?.height]);

  return (
    <div className="space-y-6">
      {/* User Info Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Age / Gender</p>
              <p className="font-semibold text-gray-800">
                {userProfile?.age || '-'} yrs / {userProfile?.gender || 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Ruler className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-semibold text-gray-800">
                {userVitals?.height || '-'} cm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-semibold text-gray-800 capitalize">
                {userGoals?.primaryGoal || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Body Measurements</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Measurement'}
          </button>
        </div>
        {calculateBMI() && (
          <p className="text-sm text-gray-500 mt-2">
            Your BMI: <span className="font-bold text-purple-600">{calculateBMI()}</span>
          </p>
        )}
      </div>

      {/* Add Measurement Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">New Measurement Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bodyParts.map((part) => (
                <div key={part.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {part.icon} {part.label} (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData[part.key]}
                    onChange={(e) => handleInputChange(part.key, e.target.value)}
                    placeholder={getRecommendedMeasurements?.[part.key]?.toFixed(1) || "0.0"}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  {getRecommendedMeasurements?.[part.key] && (
                    <p className="text-xs text-gray-400 mt-1">
                      Recommended: {getRecommendedMeasurements[part.key].toFixed(1)} cm
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Measurements
            </button>
          </form>
        </div>
      )}

      {/* Overall Progress Summary */}
      {calculateOverallProgress && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500">Average Change</p>
              <p className={`text-2xl font-bold ${calculateOverallProgress.average < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {calculateOverallProgress.average > 0 ? '+' : ''}{calculateOverallProgress.average} cm
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Change</p>
              <p className={`text-2xl font-bold ${calculateOverallProgress.total < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {calculateOverallProgress.total > 0 ? '+' : ''}{calculateOverallProgress.total} cm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bodyParts.map((part) => {
          const current = latestMeasurement?.[part.key];
          const previous = previousMeasurement?.[part.key];
          const change = calculateChange(current, previous);
          const recommended = getRecommendedMeasurements?.[part.key];

          return (
            <div key={part.key} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{part.icon}</span>
                  <span className="font-semibold text-gray-700">{part.label}</span>
                </div>
                {change && (
                  change.change < 0 ? (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  ) : change.change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  ) : null
                )}
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {current ? `${current.toFixed(1)} cm` : '-'}
              </p>
              {change && change.change !== 0 && (
                <p className={`text-sm font-semibold ${change.change < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {change.change > 0 ? '+' : ''}{change.change} cm ({change.percentage}%)
                </p>
              )}
              {recommended && !current && (
                <p className="text-xs text-gray-400 mt-2">
                  Target: {recommended.toFixed(1)} cm
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Before/After Comparison */}
      {latestMeasurement && previousMeasurement && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Before vs After Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Body Part</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    {previousMeasurement.date ? new Date(previousMeasurement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Before'}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    {latestMeasurement.date ? new Date(latestMeasurement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Current'}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Change</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">%</th>
                </tr>
              </thead>
              <tbody>
                {bodyParts.map((part) => {
                  const current = latestMeasurement[part.key];
                  const before = previousMeasurement[part.key];
                  const change = calculateChange(current, before);

                  return (
                    <tr key={part.key} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {part.icon} {part.label}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {before ? `${before.toFixed(1)} cm` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-800">
                        {current ? `${current.toFixed(1)} cm` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {change ? (
                          <span className={`font-semibold ${change.change < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                            {change.change > 0 ? '+' : ''}{change.change} cm
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {change ? (
                          <span className={`font-semibold ${change.change < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                            {change.percentage}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress Photos Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Progress Photos</h3>
        </div>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.slice(0, 4).map((photo, index) => (
              <div key={photo.id || index} className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square group">
                <img
                  src={photo.url || '/api/placeholder/300/300'}
                  alt={`Progress ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs font-semibold">
                    {new Date(photo.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {index === 0 && (
                  <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    Latest
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No progress photos yet. Switch to the Photos tab to add some!</p>
        )}
      </div>

      {/* Empty State */}
      {measurements.length === 0 && (
        <div className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-300 p-12 text-center">
          <Ruler className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Measurements Yet</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your body measurements to see your transformation over time!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add First Measurement
          </button>
        </div>
      )}
    </div>
  );
};

export default MeasurementTracker;