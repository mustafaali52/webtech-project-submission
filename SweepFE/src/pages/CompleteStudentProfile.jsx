import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthAPI from '../services/authAPI';

const CompleteStudentProfile = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    university: '',
    cgpa: '',
    graduationYear: new Date().getFullYear(),
    priorExperienceYears: 0,
    fieldId: ''
  });
  
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    
    if (user.role !== 0) {
      navigate('/', { replace: true });
      return;
    }

    if (user.hasCompletedProfile) {
      navigate('/student-dashboard', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsData = await AuthAPI.getFields();
        setFields(fieldsData);
        if (fieldsData.length > 0) {
          setFormData(prev => ({ ...prev, fieldId: fieldsData[0].fieldId }));
        }
      } catch (error) {
        console.error('Failed to fetch fields:', error);
        setError('Failed to load available fields. Please refresh the page.');
      }
    };

    fetchFields();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cgpa' ? parseFloat(value) || '' : 
               name === 'graduationYear' || name === 'priorExperienceYears' || name === 'fieldId' ? 
               parseInt(value) || '' : value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.cgpa < 0 || formData.cgpa > 4.0) {
        setError('CGPA must be between 0.0 and 4.0');
        setLoading(false);
        return;
      }

      const currentYear = new Date().getFullYear();
      if (formData.graduationYear < currentYear || formData.graduationYear > currentYear + 10) {
        setError(`Graduation year must be between ${currentYear} and ${currentYear + 10}`);
        setLoading(false);
        return;
      }

      await AuthAPI.createStudentProfile({
        studentName: formData.studentName,
        university: formData.university,
        cgpa: parseFloat(formData.cgpa),
        graduationYear: parseInt(formData.graduationYear),
        priorExperienceYears: parseInt(formData.priorExperienceYears),
        fieldId: parseInt(formData.fieldId)
      });

      updateProfile({ hasCompletedProfile: true });

      navigate('/student-dashboard', { replace: true });
    } catch (error) {
      console.error('Profile creation error:', error);
      setError(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 0) {
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
          Complete Your Student Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about yourself to get started with SWEEP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                University
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your university name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CGPA
              </label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleInputChange}
                required
                min="0"
                max="4.0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3.75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                required
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prior Experience (Years)
              </label>
              <input
                type="number"
                name="priorExperienceYears"
                value={formData.priorExperienceYears}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field of Interest
              </label>
              <select
                name="fieldId"
                value={formData.fieldId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a field</option>
                {fields.map(field => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteStudentProfile;
