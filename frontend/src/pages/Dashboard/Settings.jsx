import React, { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

const Settings = () => {
  // Profile Information State
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1990-05-15',
    biologicalSex: 'male',
    profilePicture: null,
  });

  // Body Parameters State
  const [bodyData, setBodyData] = useState({
    height: 175,
    heightUnit: 'cm',
    currentWeight: 82.5,
    goalWeight: 75,
    activityLevel: 'moderate',
    experienceLevel: 'intermediate',
  });

  // Fitness Goals State
  const [fitnessGoals, setFitnessGoals] = useState({
    primaryGoal: 'weight-loss',
    targetDate: '2026-06-01',
    weeklyWeightGoal: '0.5',
  });

  // Diet Preferences State
  const [dietPreferences, setDietPreferences] = useState({
    restrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      keto: false,
      noRestrictions: true,
    },
    allergies: '',
    foodsToAvoid: '',
    mealsPerDay: '4',
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    motivationMessages: false,
    emailSummaries: true,
    smsAlerts: false,
  });

  // Privacy & Security State
  const [privacy, setPrivacy] = useState({
    twoFactorAuth: false,
    medicalDisclaimer: true,
  });

  // App Preferences State
  const [appPreferences, setAppPreferences] = useState({
    units: 'metric',
    language: 'English',
    theme: 'light',
    weeklyReportDay: 'Monday',
  });

  // UI State
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.phone,
      profileData.dateOfBirth,
      profileData.biologicalSex,
      profileData.profilePicture,
      bodyData.height,
      bodyData.currentWeight,
      bodyData.goalWeight,
      fitnessGoals.primaryGoal,
    ];
    const filledFields = fields.filter(field => field !== null && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    setHasChanges(true);
  };

  const handleBodyDataChange = (field, value) => {
    setBodyData({ ...bodyData, [field]: value });
    setHasChanges(true);
  };

  const handleFitnessGoalsChange = (field, value) => {
    setFitnessGoals({ ...fitnessGoals, [field]: value });
    setHasChanges(true);
  };

  const handleDietRestrictionChange = (restriction) => {
    setDietPreferences({
      ...dietPreferences,
      restrictions: {
        ...dietPreferences.restrictions,
        [restriction]: !dietPreferences.restrictions[restriction],
      },
    });
    setHasChanges(true);
  };

  const handleDietPreferenceChange = (field, value) => {
    setDietPreferences({ ...dietPreferences, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationToggle = (notification) => {
    setNotifications({ ...notifications, [notification]: !notifications[notification] });
    setHasChanges(true);
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacy({ ...privacy, [setting]: !privacy[setting] });
    setHasChanges(true);
  };

  const handleAppPreferenceChange = (field, value) => {
    setAppPreferences({ ...appPreferences, [field]: value });
    setHasChanges(true);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // TODO: API call to save changes
    console.log('Saving changes...', {
      profileData,
      bodyData,
      fitnessGoals,
      dietPreferences,
      notifications,
      privacy,
      appPreferences,
    });
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleChangePassword = () => {
    alert('Change password modal to be implemented');
  };

  const handleExportData = () => {
    alert('Exporting your data...');
  };

  const handleResetProgress = () => {
    setShowResetModal(false);
    alert('Progress reset successfully');
  };

  const handleDeactivateAccount = () => {
    setShowDeactivateModal(false);
    alert('Account deactivated');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('Account deletion initiated');
  };

  return (
    <DashboardLayout>
      <div className="settings-page">
      {/* SECTION 1: PAGE HEADER */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Settings</h1>
          <div className="profile-completion">
            <span className="completion-label">Profile Completion</span>
            <div className="completion-bar">
              <div 
                className="completion-fill" 
                style={{ width: `${calculateProfileCompletion()}%` }}
              ></div>
            </div>
            <span className="completion-percentage">{calculateProfileCompletion()}%</span>
          </div>
        </div>
        <button 
          className={`btn btn-primary ${!hasChanges ? 'disabled' : ''}`}
          onClick={handleSaveChanges}
          disabled={!hasChanges}
        >
          💾 Save Changes
        </button>
      </div>

      <div className="settings-container">
        {/* SECTION 2: PROFILE INFORMATION */}
        <div className="settings-section">
          <h2>Personal Information</h2>
          
          <div className="profile-picture-section">
            <div className="current-picture">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" />
              ) : (
                <div className="placeholder-avatar">👤</div>
              )}
            </div>
            <div className="picture-actions">
              <label htmlFor="profile-upload" className="btn btn-secondary">
                📸 Upload Photo
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">JPG, PNG or GIF (MAX. 5MB)</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={profileData.biologicalSex}
                onChange={(e) => handleProfileChange('biologicalSex', e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: BODY PARAMETERS */}
        <div className="settings-section">
          <h2>Body Measurements</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Height</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={bodyData.height}
                  onChange={(e) => handleBodyDataChange('height', e.target.value)}
                  placeholder="175"
                />
                <select
                  value={bodyData.heightUnit}
                  onChange={(e) => handleBodyDataChange('heightUnit', e.target.value)}
                  className="unit-selector"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Current Weight</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  step="0.1"
                  value={bodyData.currentWeight}
                  onChange={(e) => handleBodyDataChange('currentWeight', e.target.value)}
                  placeholder="82.5"
                />
                <span className="suffix">kg</span>
              </div>
            </div>

            <div className="form-group">
              <label>Goal Weight</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  step="0.1"
                  value={bodyData.goalWeight}
                  onChange={(e) => handleBodyDataChange('goalWeight', e.target.value)}
                  placeholder="75"
                />
                <span className="suffix">kg</span>
              </div>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select
                value={bodyData.activityLevel}
                onChange={(e) => handleBodyDataChange('activityLevel', e.target.value)}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very-active">Very Active</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                value={bodyData.experienceLevel}
                onChange={(e) => handleBodyDataChange('experienceLevel', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: FITNESS GOALS */}
        <div className="settings-section">
          <h2>Your Goals</h2>
          
          <div className="form-group">
            <label>Primary Goal</label>
            <div className="radio-group">
              {[
                { value: 'weight-loss', label: '🔥 Weight Loss', icon: '🔥' },
                { value: 'muscle-gain', label: '💪 Muscle Gain', icon: '💪' },
                { value: 'body-recomp', label: '⚡ Body Recomposition', icon: '⚡' },
                { value: 'maintain', label: '✓ Maintain Weight', icon: '✓' },
                { value: 'endurance', label: '🏃 Improve Endurance', icon: '🏃' },
              ].map((goal) => (
                <label key={goal.value} className="radio-option">
                  <input
                    type="radio"
                    name="primaryGoal"
                    value={goal.value}
                    checked={fitnessGoals.primaryGoal === goal.value}
                    onChange={(e) => handleFitnessGoalsChange('primaryGoal', e.target.value)}
                  />
                  <span className="radio-label">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Target Date (Optional)</label>
              <input
                type="date"
                value={fitnessGoals.targetDate}
                onChange={(e) => handleFitnessGoalsChange('targetDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Weekly Weight Goal</label>
              <select
                value={fitnessGoals.weeklyWeightGoal}
                onChange={(e) => handleFitnessGoalsChange('weeklyWeightGoal', e.target.value)}
              >
                <option value="0.25">0.25 kg per week</option>
                <option value="0.5">0.5 kg per week</option>
                <option value="0.75">0.75 kg per week</option>
                <option value="1">1 kg per week</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: DIET PREFERENCES */}
        <div className="settings-section">
          <h2>Diet Preferences</h2>
          
          <div className="form-group">
            <label>Dietary Restrictions</label>
            <div className="checkbox-group">
              {[
                { key: 'vegetarian', label: '🥗 Vegetarian' },
                { key: 'vegan', label: '🌱 Vegan' },
                { key: 'glutenFree', label: '🌾 Gluten-free' },
                { key: 'dairyFree', label: '🥛 Dairy-free' },
                { key: 'keto', label: '🥑 Keto' },
                { key: 'noRestrictions', label: '✓ No restrictions' },
              ].map((restriction) => (
                <label key={restriction.key} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={dietPreferences.restrictions[restriction.key]}
                    onChange={() => handleDietRestrictionChange(restriction.key)}
                  />
                  <span className="checkbox-label">{restriction.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Allergies</label>
              <input
                type="text"
                value={dietPreferences.allergies}
                onChange={(e) => handleDietPreferenceChange('allergies', e.target.value)}
                placeholder="e.g., Peanuts, Shellfish"
              />
            </div>

            <div className="form-group">
              <label>Foods to Avoid</label>
              <input
                type="text"
                value={dietPreferences.foodsToAvoid}
                onChange={(e) => handleDietPreferenceChange('foodsToAvoid', e.target.value)}
                placeholder="e.g., Mushrooms, Olives"
              />
            </div>

            <div className="form-group">
              <label>Meals Per Day</label>
              <select
                value={dietPreferences.mealsPerDay}
                onChange={(e) => handleDietPreferenceChange('mealsPerDay', e.target.value)}
              >
                <option value="3">3 meals</option>
                <option value="4">4 meals</option>
                <option value="5">5 meals</option>
                <option value="6">6 meals</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 6: NOTIFICATION SETTINGS */}
        <div className="settings-section">
          <h2>Notifications</h2>
          
          <div className="toggle-list">
            {[
              { key: 'workoutReminders', label: 'Workout Reminders', description: 'Get notified when it\'s time to work out' },
              { key: 'mealReminders', label: 'Meal Reminders', description: 'Reminders for meal logging and prep' },
              { key: 'progressUpdates', label: 'Progress Updates', description: 'Weekly summary of your achievements' },
              { key: 'motivationMessages', label: 'Motivation Messages', description: 'Daily inspirational quotes and tips' },
              { key: 'emailSummaries', label: 'Email Summaries', description: 'Monthly progress reports via email' },
              { key: 'smsAlerts', label: 'SMS Alerts', description: 'Important notifications via SMS' },
            ].map((notification) => (
              <div key={notification.key} className="toggle-item">
                <div className="toggle-info">
                  <div className="toggle-label">{notification.label}</div>
                  <div className="toggle-description">{notification.description}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications[notification.key]}
                    onChange={() => handleNotificationToggle(notification.key)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: PRIVACY & SECURITY */}
        <div className="settings-section">
          <h2>Privacy & Security</h2>
          
          <div className="action-list">
            <div className="action-item">
              <div className="action-info">
                <div className="action-label">🔒 Change Password</div>
                <div className="action-description">Update your account password</div>
              </div>
              <button className="btn btn-secondary" onClick={handleChangePassword}>
                Change
              </button>
            </div>

            <div className="action-item">
              <div className="action-info">
                <div className="action-label">Two-Factor Authentication</div>
                <div className="action-description">Add an extra layer of security</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.twoFactorAuth}
                  onChange={() => handlePrivacyToggle('twoFactorAuth')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="action-item">
              <div className="action-info">
                <div className="action-label">📊 Export Data</div>
                <div className="action-description">Download all your data in JSON format</div>
              </div>
              <button className="btn btn-secondary" onClick={handleExportData}>
                Export
              </button>
            </div>

            <div className="action-item">
              <div className="action-info">
                <div className="action-label">Medical Disclaimer</div>
                <div className="action-description">I acknowledge this app is not medical advice</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.medicalDisclaimer}
                  onChange={() => handlePrivacyToggle('medicalDisclaimer')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 8: APP PREFERENCES */}
        <div className="settings-section">
          <h2>App Settings</h2>
          
          <div className="form-group">
            <label>Units</label>
            <div className="radio-group horizontal">
              <label className="radio-option">
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={appPreferences.units === 'metric'}
                  onChange={(e) => handleAppPreferenceChange('units', e.target.value)}
                />
                <span className="radio-label">Metric (kg/cm)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={appPreferences.units === 'imperial'}
                  onChange={(e) => handleAppPreferenceChange('units', e.target.value)}
                />
                <span className="radio-label">Imperial (lbs/inches)</span>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Language</label>
              <select
                value={appPreferences.language}
                onChange={(e) => handleAppPreferenceChange('language', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <div className="form-group">
              <label>Weekly Report Day</label>
              <select
                value={appPreferences.weeklyReportDay}
                onChange={(e) => handleAppPreferenceChange('weeklyReportDay', e.target.value)}
              >
                <option value="Monday">Monday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Theme</label>
            <div className="radio-group horizontal">
              {['light', 'dark', 'system'].map((theme) => (
                <label key={theme} className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={appPreferences.theme === theme}
                    onChange={(e) => handleAppPreferenceChange('theme', e.target.value)}
                  />
                  <span className="radio-label">
                    {theme === 'light' && '☀️ Light'}
                    {theme === 'dark' && '🌙 Dark'}
                    {theme === 'system' && '💻 System'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 9: DANGER ZONE */}
        <div className="settings-section danger-zone">
          <h2>⚠️ Danger Zone</h2>
          <p className="danger-warning">These actions are irreversible. Please be certain.</p>
          
          <div className="danger-actions">
            <div className="danger-item">
              <div className="danger-info">
                <div className="danger-label">Reset All Progress</div>
                <div className="danger-description">Clear all workout and diet data, start fresh</div>
              </div>
              <button 
                className="btn btn-danger-outline"
                onClick={() => setShowResetModal(true)}
              >
                Reset Progress
              </button>
            </div>

            <div className="danger-item">
              <div className="danger-info">
                <div className="danger-label">Deactivate Account</div>
                <div className="danger-description">Temporarily disable your account (reversible)</div>
              </div>
              <button 
                className="btn btn-danger-outline"
                onClick={() => setShowDeactivateModal(true)}
              >
                Deactivate
              </button>
            </div>

            <div className="danger-item">
              <div className="danger-info">
                <div className="danger-label">Delete Account</div>
                <div className="danger-description">Permanently delete your account and all data</div>
              </div>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reset All Progress?</h3>
            <p>This will permanently delete all your workout and diet data. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleResetProgress}>
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Deactivate Account?</h3>
            <p>Your account will be temporarily disabled. You can reactivate it anytime by logging in.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeactivateAccount}>
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account Permanently?</h3>
            <p>⚠️ This action is irreversible. All your data will be permanently deleted.</p>
            <p className="danger-text">Type "DELETE" to confirm:</p>
            <input type="text" className="confirm-input" placeholder="Type DELETE" />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .settings-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: #f9fafb;
          min-height: 100vh;
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

        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .profile-completion {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .completion-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .completion-bar {
          width: 150px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .completion-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          transition: width 0.6s ease;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .completion-percentage {
          font-size: 0.875rem;
          font-weight: 700;
          color: #10b981;
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

        .btn-primary:hover:not(.disabled) {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-primary.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #4f46e5;
          border: 2px solid #4f46e5;
        }

        .btn-secondary:hover {
          background: #f5f3ff;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-danger-outline {
          background: white;
          color: #ef4444;
          border: 2px solid #ef4444;
        }

        .btn-danger-outline:hover {
          background: #fef2f2;
        }

        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .settings-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .current-picture {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e5e7eb;
        }

        .current-picture img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-size: 3rem;
        }

        .picture-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .input-with-unit {
          display: flex;
          gap: 0.5rem;
        }

        .input-with-unit input {
          flex: 1;
        }

        .unit-selector {
          width: 80px;
        }

        .input-with-suffix {
          position: relative;
        }

        .input-with-suffix input {
          padding-right: 3rem;
        }

        .suffix {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-weight: 600;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .radio-group.horizontal {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-option:hover {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .radio-option input[type="radio"]:checked + .radio-label {
          color: #4f46e5;
          font-weight: 700;
        }

        .radio-label {
          font-size: 0.95rem;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkbox-option:hover {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .checkbox-option input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.95rem;
          color: #374151;
          cursor: pointer;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .toggle-item:hover {
          background: #f9fafb;
          border-color: #4f46e5;
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .toggle-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e7eb;
          transition: 0.3s;
          border-radius: 28px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #4f46e5;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .action-info {
          flex: 1;
        }

        .action-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .action-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .danger-zone {
          border: 2px solid #fecaca;
          background: #fef2f2;
        }

        .danger-warning {
          color: #991b1b;
          font-size: 0.95rem;
          margin: 0 0 1.5rem 0;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .danger-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .danger-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .danger-info {
          flex: 1;
        }

        .danger-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 0.25rem;
        }

        .danger-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease;
        }

        .modal-content h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #111827;
        }

        .modal-content p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          line-height: 1.6;
        }

        .danger-text {
          color: #991b1b;
          font-weight: 600;
        }

        .confirm-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            width: 100%;
          }

          .completion-bar {
            width: 100px;
          }

          .btn {
            width: 100%;
          }

          .settings-section {
            padding: 1.5rem;
          }

          .profile-picture-section {
            flex-direction: column;
            text-align: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .radio-group.horizontal {
            flex-direction: column;
          }
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Settings;