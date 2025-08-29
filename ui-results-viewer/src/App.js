import React, { useState, useEffect } from 'react';
import FileSelector from './components/FileSelector';
import ResultsOverview from './components/ResultsOverview';
import TestCasesViewer from './components/TestCasesViewer';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadResultsFile = async (filename) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch from the backend server
      const response = await fetch(`http://localhost:3001/results/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResultsData(data);
      setSelectedFile(filename);
    } catch (err) {
      setError(err.message);
      console.error('Error loading results file:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                DeepTeam Results Viewer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success-500" />
                <span className="text-sm text-gray-600">Security Testing Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Selection */}
        <div className="mb-8">
          <FileSelector 
            onFileSelect={loadResultsFile}
            selectedFile={selectedFile}
            loading={loading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-danger-500" />
              <span className="text-danger-700 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Results Display */}
        {resultsData && !loading && (
          <div className="space-y-8">
            {/* Overview Section */}
            <ResultsOverview data={resultsData.overview} />
            
            {/* Test Cases Section */}
            <TestCasesViewer testCases={resultsData.test_cases} />
          </div>
        )}

        {/* Welcome State */}
        {!resultsData && !loading && !error && (
          <div className="text-center py-16">
            <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to DeepTeam Results Viewer
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Select a results file from the dropdown above to view detailed security testing results, 
              vulnerability assessments, and test case analysis.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
