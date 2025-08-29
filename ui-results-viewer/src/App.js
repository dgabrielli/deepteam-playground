import React, { useState, useEffect } from 'react';
import FileSelector from './components/FileSelector';
import ResultsOverview from './components/ResultsOverview';
import TestCasesViewer from './components/TestCasesViewer';
import HelpSection from './components/HelpSection';
import { Shield, AlertTriangle, CheckCircle, XCircle, HelpCircle, Sparkles } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Close help modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };

    if (showHelp) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showHelp]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  DeepTeam Security
                </h1>
                <p className="text-sm text-slate-600 font-medium">AI Security Assessment Results</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Security Testing</span>
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:bg-white/80 hover:border-slate-300/60 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{showHelp ? 'Hide' : 'Help'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* File Selection */}
        <div className="mb-10">
          <FileSelector 
            onFileSelect={loadResultsFile}
            selectedFile={selectedFile}
            loading={loading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Results</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="ml-6">
              <p className="text-lg font-medium text-slate-700">Analyzing security results...</p>
              <p className="text-sm text-slate-500">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {resultsData && !loading && (
          <div className="space-y-10">
            {/* Overview Section */}
            <ResultsOverview data={resultsData.overview} />
            
            {/* Test Cases Section */}
            <TestCasesViewer testCases={resultsData.test_cases} />
          </div>
        )}

        {/* Welcome State */}
        {!resultsData && !loading && !error && (
          <div className="text-center py-24">
            <div className="relative mx-auto w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-3xl">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome to DeepTeam Security
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Select a results file above to view comprehensive AI security testing results, 
              vulnerability assessments, and detailed test case analysis.
            </p>
            {!showHelp && (
              <div className="mt-10">
                <button
                  onClick={() => setShowHelp(true)}
                  className="inline-flex items-center space-x-3 px-6 py-3 text-base font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>View Security Guide</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowHelp(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Security Results Guide</h2>
                  <p className="text-slate-600 mt-1">Understanding your AI security assessment data</p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <HelpSection />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
