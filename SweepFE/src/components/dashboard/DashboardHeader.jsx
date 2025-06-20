import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClerk } from '@clerk/clerk-react';
import { 
  UserCircleIcon,
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const DashboardHeader = ({ 
  userType, 
  profile, 
  profileLoading, 
  onNewTask = null,
  showTokens = false 
}) => {
  const { user, logout } = useAuth();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Clerk signOut error:', error);
    }
    await logout();
  };

  const getDisplayName = () => {
    if (profileLoading) return 'Loading...';
    if (!profile) return 'Welcome';
    
    return userType === 'student' 
      ? profile.studentName 
      : profile.employerName || 'Employer';
  };

  const getDashboardTitle = () => {
    return userType === 'student' ? 'Student Dashboard' : 'Employer Dashboard';
  };

  const getBrandLetter = () => {
    return userType === 'student' ? 'S' : 'E';
  };

  return (
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{getBrandLetter()}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SWEEP</h1>
                <p className="text-xs text-gray-500">{getDashboardTitle()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {showTokens && !profileLoading && profile && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
                <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">
                  {profile.tokenBalance} Tokens
                </span>
              </div>
            )}

            {userType === 'employer' && onNewTask && (
              <button
                onClick={onNewTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Task
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
