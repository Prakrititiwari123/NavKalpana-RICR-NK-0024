import React, { useState, useMemo } from 'react';
import { Camera, Upload, Trash2, ChevronLeft, ChevronRight, Lock, Unlock, Calendar } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';

const ProgressPhotos = ({ photos = [], onUpload, onDelete }) => {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState({ before: null, after: null });
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Get user data from auth context
  const userProfile = user?.healthData?.profile || {};
  const userVitals = user?.healthData?.vitals || {};

  // Sort photos by date (newest first) - only real data
  const sortedPhotos = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    return [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [photos]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          url: reader.result,
          filename: file.name,
          size: file.size,
          type: file.type,
          date: new Date().toISOString()
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support camera access');
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create canvas to capture photo
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Wait for video to be ready
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Convert to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        
        onUpload({
          url: imageData,
          filename: `camera_${new Date().toISOString()}.jpg`,
          size: imageData.length,
          type: 'image/jpeg',
          date: new Date().toISOString()
        });
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const selectForComparison = (photo, position) => {
    if (!photo) return;
    setComparePhotos((prev) => ({ ...prev, [position]: photo }));
  };

  const nextPhoto = () => {
    if (sortedPhotos.length > 0 && timelineIndex < sortedPhotos.length - 1) {
      setTimelineIndex(timelineIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (sortedPhotos.length > 0 && timelineIndex > 0) {
      setTimelineIndex(timelineIndex - 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate time difference between two photos
  const getTimeDifference = (date1, date2) => {
    if (!date1 || !date2) return null;
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const hasPhotos = sortedPhotos.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Progress Photos</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              title={privacyMode ? 'Photos are private' : 'Photos are public'}
            >
              {privacyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {privacyMode ? 'Private' : 'Public'}
            </button>
            <button
              onClick={handleCameraCapture}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
            <label className={`flex items-center gap-2 px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading ? 'Uploading...' : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
          {userProfile?.age && <span>Age: {userProfile.age}</span>}
          {userProfile?.gender && <span>Gender: {userProfile.gender}</span>}
          {userVitals?.height && <span>Height: {userVitals.height} cm</span>}
          {userVitals?.currentWeight && <span>Current Weight: {userVitals.currentWeight} kg</span>}
        </div>
      </div>

      {/* Comparison Mode Toggle - Only show if there are at least 2 photos */}
      {hasPhotos && sortedPhotos.length >= 2 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Comparison Mode</span>
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                comparisonMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {comparisonMode ? 'Exit Comparison' : 'Compare Photos'}
            </button>
          </div>
        </div>
      )}

      {/* Comparison View - Only show when in comparison mode and photos exist */}
      {comparisonMode && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Before & After Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Photo */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Before</h4>
              {comparePhotos.before ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4">
                  <img
                    src={comparePhotos.before.url}
                    alt="Before"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = ''; // Clear broken image
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => selectForComparison(null, 'before')}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold text-sm">
                      {formatShortDate(comparePhotos.before.date)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-3/4 flex flex-col items-center justify-center p-4 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Click "Before" on a photo below</p>
                </div>
              )}
            </div>

            {/* After Photo */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">After</h4>
              {comparePhotos.after ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4">
                  <img
                    src={comparePhotos.after.url}
                    alt="After"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => selectForComparison(null, 'after')}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold text-sm">
                      {formatShortDate(comparePhotos.after.date)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-3/4 flex flex-col items-center justify-center p-4 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Click "After" on a photo below</p>
                </div>
              )}
            </div>
          </div>

          {/* Time Difference */}
          {comparePhotos.before && comparePhotos.after && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center">
              <Calendar className="w-4 h-4 inline mr-2 text-purple-600" />
              <span className="text-purple-700 font-medium">
                Progress over {getTimeDifference(comparePhotos.before.date, comparePhotos.after.date)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Timeline Slider - Only show if photos exist */}
      {hasPhotos && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Timeline</h3>
            <span className="text-sm text-gray-600">
              Photo {timelineIndex + 1} of {sortedPhotos.length}
            </span>
          </div>

          {/* Main Photo Display */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4 max-w-md mx-auto">
              <img
                src={sortedPhotos[timelineIndex]?.url}
                alt={`Progress ${timelineIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '';
                  e.target.alt = 'Image failed to load';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold text-lg">
                  {formatDate(sortedPhotos[timelineIndex]?.date)}
                </p>
                {sortedPhotos[timelineIndex]?.note && (
                  <p className="text-white text-sm opacity-90">
                    {sortedPhotos[timelineIndex].note}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Buttons - Only show if more than one photo */}
            {sortedPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={timelineIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={timelineIndex === sortedPhotos.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Timeline Dots */}
          {sortedPhotos.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
              {sortedPhotos.map((photo, index) => (
                <button
                  key={photo.id || index}
                  onClick={() => setTimelineIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === timelineIndex ? 'bg-purple-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={formatShortDate(photo.date)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo Grid - Only show if photos exist */}
      {hasPhotos ? (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            All Photos ({sortedPhotos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedPhotos.map((photo, index) => (
              <div key={photo.id || index} className="relative group">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={photo.url}
                    alt={`Progress ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPhoto(photo)}
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this photo?')) {
                          onDelete(photo.id);
                        }
                      }}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">
                      {formatShortDate(photo.date)}
                    </p>
                  </div>
                </div>

                {/* Comparison Select Buttons - Only show in comparison mode */}
                {comparisonMode && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => selectForComparison(photo, 'before')}
                      className={`flex-1 py-1 px-2 text-xs font-semibold rounded transition-colors ${
                        comparePhotos.before?.id === photo.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => selectForComparison(photo, 'after')}
                      className={`flex-1 py-1 px-2 text-xs font-semibold rounded transition-colors ${
                        comparePhotos.after?.id === photo.id
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      After
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State - Only show when no photos */
        <div className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-300 p-12 text-center">
          <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Photos Yet</h3>
          <p className="text-gray-600 mb-4">
            Start documenting your transformation! Upload or take progress photos.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleCameraCapture}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Privacy & Security</h4>
            <p className="text-sm text-blue-700">
              Your progress photos are stored securely. {privacyMode ? 'They are private and only visible to you.' : 'They are visible to others when you share.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;