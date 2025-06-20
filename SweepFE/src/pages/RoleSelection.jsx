import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authAPI from '../services/authAPI';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clerkUserData, setClerkUserData] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const tempUserData = sessionStorage.getItem('tempClerkUserData');
    
    if (!tempUserData) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(tempUserData);
      setClerkUserData(userData);
    } catch (error) {
      console.error('Failed to parse temp user data:', error);
      navigate('/', { replace: true });
    }
  }, [navigate]);  
  
  const handleRoleSelection = async () => {
    if (selectedRole === null || selectedRole === undefined) {
      setError('Please select a role to continue');
      return;
    }

    if (!clerkUserData) {
      setError('User data not found. Please try signing in again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await authAPI.completeClerkRegistration(
        clerkUserData.email,
        clerkUserData.clerkId,
        clerkUserData.clerkToken,
        selectedRole
      );

      login({
        userId: response.userId,
        email: response.email,
        role: response.role,
        token: response.token,
        hasCompletedProfile: response.hasCompletedProfile
      });      
      
      sessionStorage.removeItem('tempClerkUserData');      
      
      if (!response.hasCompletedProfile) {
        const profilePath = response.role === 0 ? '/complete-student-profile' : '/complete-employer-profile';
        navigate(profilePath, { replace: true });
      } else {
        const dashboardPath = response.role === 0 ? '/student-dashboard' : '/employer-dashboard';
        navigate(dashboardPath, { replace: true });
      }
    } catch (error) {
      console.error('Role selection error:', error);
      setError(error.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!clerkUserData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to SWEEP!
        </h2>        
        <p className="mt-2 text-center text-sm text-gray-600">
          Please select your role to complete your registration
        </p>
        {clerkUserData && (
          <p className="mt-1 text-center text-sm text-gray-500">
            Registering as: {clerkUserData.email}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">
                Choose your role:
              </h3>

              <div
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedRole === 0
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedRole(0)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={0}
                    checked={selectedRole === 0}
                    onChange={() => setSelectedRole(0)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">
                      Student
                    </div>
                    <div className="text-sm text-gray-500">
                      Find and complete tasks to earn tokens and gain experience
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedRole === 1
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedRole(1)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={1}
                    checked={selectedRole === 1}
                    onChange={() => setSelectedRole(1)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">
                      Employer
                    </div>
                    <div className="text-sm text-gray-500">
                      Post tasks and hire talented students for your projects
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleRoleSelection}
                disabled={selectedRole === null || selectedRole === undefined || isSubmitting}                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedRole === null || selectedRole === undefined || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Completing Registration...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              You can always change your role settings later in your profile.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
