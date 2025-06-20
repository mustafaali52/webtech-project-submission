import { useState, useEffect, useCallback } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useClerk, useUser, useSession } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../services/authAPI';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); //login function
  const { openSignIn } = useClerk(); //clerks own modal
  const { isSignedIn, user: clerkUser } = useUser(); //clerk user
  const { session } = useSession(); //clerk
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student'
  });

  //clear form
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', role: 'Student' });
      setError('');
      setShowPassword(false);
    }
  }, [isOpen, isLogin]);

  //clear clerk keys
  useEffect(() => {
    if (!isSignedIn) {
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('processed_clerk_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    }
  }, [isSignedIn]);

  const completeAuthentication = useCallback(async (data) => {
    login({
      userId: data.userId,
      email: data.email,
      role: data.role,
      hasCompletedProfile: data.hasCompletedProfile,
      token: data.token
    });

    onSuccess(data);
    onClose();

    console.log('Authentication successful:', data);
    
    //isProfileComplete
    if (!data.hasCompletedProfile) {
      console.log('User needs to complete profile, redirecting...');
      const profilePath = data.role === 0 ? '/complete-student-profile' : '/complete-employer-profile';
      navigate(profilePath);
    } else {
      // Redirect to appropriate dashboard
      const dashboardPath = data.role === 0 ? '/student-dashboard' : '/employer-dashboard';
      navigate(dashboardPath);
    }
  }, [login, onSuccess, onClose, navigate]);

  //clerk OAuth flow
  useEffect(() => {
    const handleClerkAuth = async () => {
      if (isSignedIn && clerkUser && session) {
        //no duplicate processing
        const hasProcessedThisUser = sessionStorage.getItem(`processed_clerk_${clerkUser.id}`);
        if (hasProcessedThisUser) {
          return;
        }

        setLoading(true);

        try {
          console.log(
            'Processing Clerk OAuth for user:',
            clerkUser.emailAddresses[0]?.emailAddress
          );

          //clerk session token jwt
          const clerkJwt = await session.getToken();
          if (!clerkJwt) {
            throw new Error('Could not obtain Clerk session token');
          }

          console.log('sending Clerk token to backend (/auth/clerk)…');
          //get user data from backend
          const data = await AuthAPI.authenticateWithClerk(clerkJwt);
          console.log('Backend response from /auth/clerk:', data);

          console.log('res properties:', {
            isNewUser: data.isNewUser,
            requiresRoleSelection: data.requiresRoleSelection,
            userId: data.userId,
            email: data.email,
            message: data.message
          });

          //mark user processed
          sessionStorage.setItem(`processed_clerk_${clerkUser.id}`, 'true');

          if (data.isNewUser && data.requiresRoleSelection) {
            console.log('redirecting to role selection page');

            sessionStorage.setItem('tempClerkUserData', JSON.stringify({
              email: clerkUser.emailAddresses[0]?.emailAddress,
              clerkId: clerkUser.id,
              clerkToken: clerkJwt
            }));

            //redirect to role-select
            onClose();
            navigate('/role-selection');
          } else {
            console.log(
              'Existing user, role already set; finishing login immediately'
            );
            await completeAuthentication(data);
          }
        } catch (err) {
          console.error('Clerk→backend auth flow error:', err);
          setError(err.message || 'Authentication failed. Please try again.');
          sessionStorage.removeItem(`processed_clerk_${clerkUser.id}`);
        } finally {
          setLoading(false);
        }
      }
    };

    handleClerkAuth();
  }, [isSignedIn, clerkUser, session, completeAuthentication, onClose, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleJWTAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      
      if (isLogin) {
        data = await AuthAPI.login(formData.email, formData.password);
      } else {
        data = await AuthAPI.register(formData.email, formData.password, formData.role);
      }

      if (data.success !== false) {
        await completeAuthentication(data);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log('Google auth button clicked');
    try {
      // clerk sign-in modal with Google OAuth
      console.log('Opening Clerk sign-in modal...');
      openSignIn({
        routing: 'virtual'
      });
    } catch (error) {
      console.error('Error opening Clerk sign-in:', error);
      setError('Failed to open Google sign-in. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">

        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join SWEEP'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>

              Continue with Google
            </button>
          </div>


          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>


          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleJWTAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a...
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Employer">Employer</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;