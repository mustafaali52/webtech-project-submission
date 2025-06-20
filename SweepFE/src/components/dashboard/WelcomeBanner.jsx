import React from 'react';
import { CurrencyDollarIcon, BriefcaseIcon, CalendarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const WelcomeBanner = ({ userType, profile, profileLoading }) => {
  if (profileLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded-lg w-64 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-96"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                <div className="h-4 bg-white/20 rounded w-16 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const renderStudentContent = () => (
    <>
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {profile.studentName}! 👋
        </h2>
        <p className="text-blue-100 text-lg">
          {profile.university} • {profile.fieldName} • Class of {profile.graduationYear}
        </p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-blue-100">
              {profile.priorExperienceYears} year{profile.priorExperienceYears !== 1 ? 's' : ''} experience
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-4 w-4 text-yellow-300" />
            <span className="text-blue-100">
              {profile.tokenBalance || 0} tokens earned lifetime
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-blue-100 text-sm font-medium mb-1">Current CGPA</p>
          <p className="text-3xl font-bold">{profile.cgpa}</p>
          <p className="text-blue-200 text-xs mt-1">Out of 4.0</p>
        </div>
      </div>
    </>
  );

  const renderEmployerContent = () => (
    <>
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {profile.employerName}! 👋
        </h2>
        <p className="text-blue-100 text-lg">
          {profile.organization}
        </p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-4 w-4 text-blue-300" />
            <span className="text-blue-100">
              Employer Dashboard
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BuildingOffice2Icon className="h-4 w-4 text-blue-300" />
            <span className="text-blue-100">
              {profile.organization}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-blue-100 text-sm font-medium mb-1">Organization</p>
          <p className="text-xl font-bold text-center">{profile.organization}</p>
          <p className="text-blue-200 text-xs mt-1">Verified Employer</p>
        </div>
      </div>
    </>
  );

  const gradientClasses = userType === 'student' 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
    : 'bg-gradient-to-r from-purple-600 to-indigo-600';

  return (
    <div className={`${gradientClasses} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          {userType === 'student' ? renderStudentContent() : renderEmployerContent()}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
