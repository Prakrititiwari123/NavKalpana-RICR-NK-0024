// GoalSettings.jsx - FIXED VERSION
import React from 'react';

const GoalSettings = ({ onChange, values, errors, maintenanceCalories }) => {
  const handleChange = (field, value) => {
    onChange({
      ...values,
      [field]: value
    });
  };

  const handleMeasurementChange = (field, value) => {
    onChange({
      ...values,
      measurements: {
        ...values.measurements,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Goal Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
        <select
          value={values.goalType || ''}
          onChange={(e) => handleChange('goalType', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Endurance">Endurance</option>
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
        <select
          value={values.experienceLevel || ''}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select experience</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Target Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
        <input
          type="number"
          value={values.targetWeight || ''}
          onChange={(e) => handleChange('targetWeight', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter target weight"
          step="0.1"
        />
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
        <input
          type="date"
          value={values.targetDate || ''}
          onChange={(e) => handleChange('targetDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Start Weight (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Weight (kg)</label>
        <input
          type="number"
          value={values.startWeight || ''}
          onChange={(e) => handleChange('startWeight', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter start weight"
          step="0.1"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty to use current weight</p>
      </div>

      {/* Maintenance Calories (display only) */}
      {maintenanceCalories && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Maintenance Calories</p>
          <p className="text-2xl font-bold text-blue-600">{maintenanceCalories} kcal/day</p>
        </div>
      )}

      {/* Measurements Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Measurements (cm)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Chest</label>
            <input
              type="number"
              value={values.measurements?.chest || ''}
              onChange={(e) => handleMeasurementChange('chest', e.target.value)}
              placeholder="95"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Waist</label>
            <input
              type="number"
              value={values.measurements?.waist || ''}
              onChange={(e) => handleMeasurementChange('waist', e.target.value)}
              placeholder="80"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hips</label>
            <input
              type="number"
              value={values.measurements?.hips || ''}
              onChange={(e) => handleMeasurementChange('hips', e.target.value)}
              placeholder="95"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Arms</label>
            <input
              type="number"
              value={values.measurements?.arms || ''}
              onChange={(e) => handleMeasurementChange('arms', e.target.value)}
              placeholder="32"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Thighs</label>
            <input
              type="number"
              value={values.measurements?.thighs || ''}
              onChange={(e) => handleMeasurementChange('thighs', e.target.value)}
              placeholder="55"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSettings;