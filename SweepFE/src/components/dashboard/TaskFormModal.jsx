import React, { useState, useEffect } from 'react';
import { XMarkIcon, PaperClipIcon, TrashIcon } from '@heroicons/react/24/outline';
import taskAPI from '../../services/taskAPI';

const TaskFormModal = ({ isOpen, onClose, task = null, onSubmit }) => {  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    requiresExperience: false,
    complexity: 75, //easy
    monetaryCompensation: '',
    fieldId: ''
  });
  
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const complexityOptions = [
    { value: 75, label: 'Easy', tokens: '75 tokens' },
    { value: 100, label: 'Medium', tokens: '100 tokens' },
    { value: 150, label: 'Hard', tokens: '150 tokens' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchFields();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
          requiresExperience: task.requiresExperience || false,
          complexity: task.complexity || 75,
          monetaryCompensation: task.monetaryCompensation || '',
          fieldId: task.fieldId || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          deadline: '',
          requiresExperience: false,
          complexity: 75,
          monetaryCompensation: '',
          fieldId: ''
        });
      }
      setErrors({});
      setAttachments([]);
    }
  }, [isOpen, task]);

  const fetchFields = async () => {
    try {
      const fieldsData = await taskAPI.getFields();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    if (!formData.fieldId) {
      newErrors.fieldId = 'Field is required';
    }

    if (formData.monetaryCompensation && isNaN(Number(formData.monetaryCompensation))) {
      newErrors.monetaryCompensation = 'Monetary compensation must be a valid number';
    }    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //file handle
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      //file size
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          attachments: `File "${file.name}" is too large. Maximum size is 10MB.`
        }));
        return false;
      }
      
      //file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          attachments: `File type "${file.type}" is not supported.`
        }));
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setAttachments(prev => {
        const newAttachments = [...prev, ...validFiles];
        //limit
        if (newAttachments.length > 5) {
          setErrors(prev => ({
            ...prev,
            attachments: 'Maximum 5 files allowed.'
          }));
          return prev;
        }
        return newAttachments;
      });
      
      if (errors.attachments) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.attachments;
          return newErrors;
        });
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        fieldId: parseInt(formData.fieldId),
        monetaryCompensation: formData.monetaryCompensation ? parseFloat(formData.monetaryCompensation) : null
      };

      await onSubmit(taskData, attachments);
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      setErrors({ submit: error.message || 'Failed to submit task' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
 
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the task requirements and expectations"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.deadline ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
            </div>

            <div>
              <label htmlFor="fieldId" className="block text-sm font-medium text-gray-700 mb-2">
                Field *
              </label>
              <select
                id="fieldId"
                name="fieldId"
                value={formData.fieldId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fieldId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a field</option>
                {fields.map(field => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.name}
                  </option>
                ))}
              </select>
              {errors.fieldId && <p className="mt-1 text-sm text-red-600">{errors.fieldId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-2">
                Complexity *
              </label>
              <select
                id="complexity"
                name="complexity"
                value={formData.complexity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {complexityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.tokens})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="monetaryCompensation" className="block text-sm font-medium text-gray-700 mb-2">
                Monetary Compensation (optional)
              </label>
              <input
                type="number"
                id="monetaryCompensation"
                name="monetaryCompensation"
                value={formData.monetaryCompensation}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.monetaryCompensation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.monetaryCompensation && <p className="mt-1 text-sm text-red-600">{errors.monetaryCompensation}</p>}
            </div>          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Attachments (optional)
            </label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <PaperClipIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
                  browse
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: PDF, Word, Excel, PowerPoint, Text, Images (Max 10MB each, 5 files total)
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Attached Files ({attachments.length}/5):
                </p>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <PaperClipIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => 
                        removeAttachment(index)
                      }
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.attachments && (
              <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requiresExperience"
              name="requiresExperience"
              checked={formData.requiresExperience}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requiresExperience" className="ml-2 block text-sm text-gray-700">
              Requires prior experience
            </label>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
