import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText, Loader } from 'lucide-react';

const FileSelector = ({ onFileSelect, selectedFile, loading }) => {
  const [availableFiles, setAvailableFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch available files from the API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/results');
        if (response.ok) {
          const data = await response.json();
          setAvailableFiles(data.map(file => file.filename));
        } else {
          console.error('Failed to fetch results files');
        }
      } catch (error) {
        console.error('Error fetching results files:', error);
        // Fallback to known files if API is not available
        const files = [
          '20250828_202955.json',
          '20250828_202038.json', 
          '20250828_200523.json',
          '20250828_195712.json'
        ];
        setAvailableFiles(files);
      }
    };
    
    fetchFiles();
  }, []);

  const handleFileSelect = (filename) => {
    onFileSelect(filename);
    setIsOpen(false);
  };

  const formatDate = (filename) => {
    // Extract date from filename format: YYYYMMDD_HHMMSS.json
    const match = filename.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      const date = new Date(year, month - 1, day, hour, minute, second);
      return date.toLocaleString();
    }
    return filename;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Results File</h2>
        {loading && (
          <div className="flex items-center space-x-2 text-primary-600">
            <Loader className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <span className={selectedFile ? 'text-gray-900' : 'text-gray-500'}>
              {selectedFile ? formatDate(selectedFile) : 'Choose a results file...'}
            </span>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {availableFiles.map((filename) => (
              <button
                key={filename}
                onClick={() => handleFileSelect(filename)}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{formatDate(filename)}</div>
                  <div className="text-sm text-gray-500">{filename}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-primary-700">
              Currently viewing: <span className="font-medium">{selectedFile}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSelector;
