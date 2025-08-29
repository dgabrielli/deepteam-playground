import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText, Loader, Calendar, Clock } from 'lucide-react';

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
      return {
        full: date.toLocaleString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    }
    return { full: filename, date: filename, time: '' };
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm relative" style={{ zIndex: 100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Assessment Results</h2>
          <p className="text-slate-600">Select a results file to analyze your AI security testing data</p>
        </div>
        {loading && (
          <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <Loader className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Processing...</span>
          </div>
        )}
      </div>
      
      <div className="dropdown-container relative" style={{ zIndex: 1000 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors duration-200">
              <FileText className="h-6 w-6 text-slate-500 group-hover:text-blue-600" />
            </div>
            <div className="text-left">
              <span className={selectedFile ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                {selectedFile ? 'Selected Results File' : 'Choose a security assessment file...'}
              </span>
              {selectedFile && (
                <div className="text-sm text-slate-600 mt-1">
                  {formatDate(selectedFile).full}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {selectedFile && (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                Active
              </div>
            )}
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
              <ChevronDown className={`h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="dropdown-list bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl max-h-80 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Available Assessment Files</h3>
              <p className="text-xs text-slate-500 mt-1">Select a file to view detailed security results</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {availableFiles.map((filename) => {
                const dateInfo = formatDate(filename);
                return (
                  <button
                    key={filename}
                    onClick={() => handleFileSelect(filename)}
                    className="w-full flex items-center space-x-4 p-4 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>{dateInfo.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{dateInfo.time}</span>
                        </div>
                      </div>
                      <div className="font-medium text-slate-900">{dateInfo.full}</div>
                      <div className="text-xs text-slate-500 font-mono">{filename}</div>
                    </div>
                    <div className="text-xs text-slate-400">
                      Click to load
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-6 p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-emerald-800">
                Currently analyzing: <span className="font-semibold">{formatDate(selectedFile).full}</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                File: {selectedFile}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSelector;
