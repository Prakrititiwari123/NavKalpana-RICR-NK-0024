// HealthProfile.jsx - COMPLETE FIXED VERSION
import React from 'react';

const HealthProfile = ({ onChange, values, errors }) => {
  // Handle individual field changes - this prevents infinite loops
  const handleFieldChange = (field, value) => {
    onChange({
      ...values,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Full Name Field - Already in parent, but include if needed */}
      {/* Age Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={values.age || ''}
          onChange={(e) => handleFieldChange('age', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your age"
          min="10"
          max="100"
        />
        {errors?.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
      </div>

      {/* Gender Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          value={values.gender || ''}
          onChange={(e) => handleFieldChange('gender', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors?.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
      </div>

      {/* Height Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height (cm) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={values.height || ''}
          onChange={(e) => handleFieldChange('height', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your height"
          step="0.1"
          min="50"
          max="300"
        />
        {errors?.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
      </div>

      {/* Weight Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight (kg) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={values.weight || ''}
          onChange={(e) => handleFieldChange('weight', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your weight"
          step="0.1"
          min="20"
          max="500"
        />
        {errors?.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
      </div>

      {/* Activity Level Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Level <span className="text-red-500">*</span>
        </label>
        <select
          value={values.activityLevel || ''}
          onChange={(e) => handleFieldChange('activityLevel', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select activity level</option>
          <option value="Sedentary">Sedentary (little or no exercise)</option>
          <option value="Light">Light (exercise 1-3 days/week)</option>
          <option value="Moderate">Moderate (exercise 3-5 days/week)</option>
          <option value="Active">Active (exercise 6-7 days/week)</option>
          <option value="Very Active">Very Active (intense exercise daily)</option>
        </select>
        {errors?.activityLevel && <p className="mt-1 text-sm text-red-600">{errors.activityLevel}</p>}
      </div>

      {/* BMI Display (if calculated) */}
      {values.bmi && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Your BMI</p>
          <p className="text-2xl font-bold text-blue-600">{values.bmi}</p>
          <p className="text-xs text-gray-500 mt-1">{values.bmiCategory}</p>
        </div>
      )}
    </div>
  );
};

export default HealthProfile;