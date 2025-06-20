import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const TaskFilters = ({ onFiltersChange, fields = [], onRefresh, refreshing = false }) => {
  const [filters, setFilters] = useState({
    search: '',
    fieldId: '',
    complexity: '',
    requiresExperience: '',
    includeExpired: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const complexityOptions = [
    { value: '', label: 'All Complexities' },
    { value: 75, label: 'Easy' },
    { value: 100, label: 'Medium' },
    { value: 150, label: 'Hard' }
  ];

  const experienceOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'true', label: 'Experience Required' },
    { value: 'false', label: 'No Experience Required' }
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const activeFilters = {};
      
      if (filters.fieldId) activeFilters.fieldId = parseInt(filters.fieldId);
      if (filters.complexity) activeFilters.complexity = parseInt(filters.complexity);
      if (filters.requiresExperience !== '') activeFilters.requiresExperience = filters.requiresExperience === 'true';
      activeFilters.includeExpired = filters.includeExpired;
      activeFilters.search = filters.search;

      onFiltersChange(activeFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      fieldId: '',
      complexity: '',
      requiresExperience: '',
      includeExpired: false
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value.trim() !== '';
    if (key === 'includeExpired') return value === true;
    return value !== '';
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"> 

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search tasks by title or description..."
        />
      

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh tasks"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          {showAdvanced ? 'Hide Filters' : 'Show Filters'}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="fieldFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Field
              </label>
              <select
                id="fieldFilter"
                value={filters.fieldId}
                onChange={(e) => handleFilterChange('fieldId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Fields</option>
                {fields.map(field => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="complexityFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                id="complexityFilter"
                value={filters.complexity}
                onChange={(e) => handleFilterChange('complexity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {complexityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experienceFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select
                id="experienceFilter"
                value={filters.requiresExperience}
                onChange={(e) => 
                  handleFilterChange('requiresExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-6">
              <input
                id="includeExpired"
                type="checkbox"
                checked={filters.includeExpired}
                onChange={(e) => handleFilterChange('includeExpired', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeExpired" className="ml-2 block text-sm text-gray-700">
                Include expired tasks
              </label>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{filters.search}"
              </span>
            )}
            {filters.fieldId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Field: {fields.find(f => f.fieldId === parseInt(filters.fieldId))?.name}
              </span>
            )}
            {filters.complexity && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Complexity: {complexityOptions.find(c => c.value === parseInt(filters.complexity))?.label}
              </span>
            )}
            {filters.requiresExperience !== '' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {filters.requiresExperience === 'true' ? 'Experience Required' : 'No Experience Required'}
              </span>
            )}
            {filters.includeExpired && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Including Expired
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
