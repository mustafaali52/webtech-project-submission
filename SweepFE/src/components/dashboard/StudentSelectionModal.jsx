import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, UserIcon, AcademicCapIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import taskAssignmentAPI from '../../services/taskAssignmentAPI';

const StudentSelectionModal = ({ isOpen, onClose, task, onAssignSuccess }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assigning, setAssigning] = useState(false);  const [searchTerm, setSearchTerm] = useState('');

  const fetchAvailableStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const availableStudents = await taskAssignmentAPI.getAvailableStudents(
        task?.fieldId,
        task?.requiresExperience
      );
      
      setStudents(availableStudents);
    } catch (err) {
      console.error('Error fetching available students:', err);
      setError(err.message || 'Failed to fetch available students');
    } finally {
      setLoading(false);
    }
  }, [task?.fieldId, task?.requiresExperience]);

  useEffect(() => {
    if (isOpen && task) {
      console.log('StudentSelectionModal opened for task:', task.title);
      fetchAvailableStudents();
    }
  }, [isOpen, task, fetchAvailableStudents]);

  const handleAssignTask = async () => {
    if (!selectedStudent) return;

    try {
      setAssigning(true);
      setError('');

      await taskAssignmentAPI.assignTask(task.jobTaskId, selectedStudent.studentId);
      
      //success callback
      if (onAssignSuccess) {
        onAssignSuccess(task, selectedStudent);
      }
      
      handleClose();
    } catch (err) {
      console.error('Error assigning task:', err);
      setError(err.message || 'Failed to assign task');
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setSearchTerm('');
    setError('');
    onClose();
  };

  const getComplexityBadge = (complexity) => {
    const complexityMap = {
      75: { label: 'Easy', color: 'bg-green-100 text-green-800' },
      100: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      150: { label: 'Hard', color: 'bg-red-100 text-red-800' }
    };
    
    const complexityInfo = complexityMap[complexity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${complexityInfo.color}`}>
        {complexityInfo.label}
      </span>
    );
  };

  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        ></div>        
 
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        

        <div 
          className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>                
                <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                  Assign Task to Student
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Select a student to assign "{task?.title}" to
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{task?.title}</h4>
                {getComplexityBadge(task?.complexity)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Field: {task?.fieldName}</span>
                <span>Deadline: {new Date(task?.deadline).toLocaleDateString()}</span>
                {task?.requiresExperience && (
                  <span className="text-blue-600 font-medium">Experience Required</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students by name, university, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 mt-2">Loading available students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No students available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? 'No students match your search criteria.' 
                      : 'No students meet the requirements for this task.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.studentId}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedStudent?.studentId === student.studentId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{student.studentName}</h4>
                            <div className="flex items-center text-yellow-500">
                              <StarIcon className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{student.cgpa}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <AcademicCapIcon className="h-4 w-4 mr-2" />
                              <span>{student.university}</span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2" />
                              <span>
                                Graduation: {student.graduationYear} • 
                                Experience: {student.priorExperienceYears} year{student.priorExperienceYears !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-2" />
                              <span>{student.field}</span>
                            </div>
                            <p className="text-gray-500 break-all">{student.email}</p>
                          </div>
                        </div>
                        
                        {selectedStudent?.studentId === student.studentId && (
                          <div className="ml-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAssignTask}
              disabled={!selectedStudent || assigning}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </>
              ) : (
                'Assign Task'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectionModal;
