import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { getUserData } from '../../Services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const data = getUserData();
      setUser(data);
    } catch (err) {
      console.error('Failed to load user data', err);
    }
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center p-6 space-x-6">
            <img
              className="w-24 h-24 rounded-full object-cover"
              src={user.photo?.url || '/default-avatar.png'}
              alt="Profile"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName || 'Unnamed'}</h2>
              <p className="text-gray-500">{user.email}</p>
              {user.phone && <p className="text-gray-500">{user.phone}</p>}
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="text-gray-800">{user.dob || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-gray-800">{user.gender || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-gray-800">
                  {user.address || 'N/A'}, {user.city || 'N/A'} {user.pin || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
