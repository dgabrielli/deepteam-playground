import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const TestCasesViewer = ({ testCases }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVulnerability, setSelectedVulnerability] = useState('all');
  const [selectedAttackMethod, setSelectedAttackMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedCases, setExpandedCases] = useState(new Set());


  // Get unique values for filters
  const vulnerabilities = useMemo(() => 
    [...new Set(testCases.map(tc => tc.vulnerability))].sort(), [testCases]
  );
  
  const attackMethods = useMemo(() => 
    [...new Set(testCases.map(tc => tc.attackMethod))].sort(), [testCases]
  );

  // Filter test cases based on search and filters
  const filteredTestCases = useMemo(() => {
    return testCases.filter(tc => {
      const matchesSearch = searchTerm === '' || 
        tc.vulnerability.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.vulnerability_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.attackMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.riskCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.actualOutput.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVulnerability = selectedVulnerability === 'all' || tc.vulnerability === selectedVulnerability;
      const matchesAttackMethod = selectedAttackMethod === 'all' || tc.attackMethod === selectedAttackMethod;
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'pass' && tc.score === 1.0) ||
        (selectedStatus === 'fail' && tc.score === 0.0) ||
        (selectedStatus === 'error' && tc.error);

      return matchesSearch && matchesVulnerability && matchesAttackMethod && matchesStatus;
    });
  }, [testCases, searchTerm, selectedVulnerability, selectedAttackMethod, selectedStatus]);

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCases(newExpanded);
  };

  const getStatusIcon = (score, error) => {
    if (error) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (score === 1.0) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusClass = (score, error) => {
    if (error) return 'status-error';
    if (score === 1.0) return 'status-pass';
    return 'status-fail';
  };

  const getStatusText = (score, error) => {
    if (error) return 'Error';
    if (score === 1.0) return 'Pass';
    return 'Fail';
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Test Cases</h2>
        <p className="text-sm text-gray-600 mt-2">
          Browse individual test cases to understand specific vulnerabilities and AI responses. 
          Use filters to focus on areas of concern or specific attack methods.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          <strong>Search:</strong> Find specific test cases by content. <strong>Filters:</strong> Narrow down results by vulnerability type, attack method, or test status.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Vulnerability Filter */}
        <div>
          <select
            value={selectedVulnerability}
            onChange={(e) => setSelectedVulnerability(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Vulnerabilities</option>
            {vulnerabilities.map(vuln => (
              <option key={vuln} value={vuln}>{vuln}</option>
            ))}
          </select>
        </div>

        {/* Attack Method Filter */}
        <div>
          <select
            value={selectedAttackMethod}
            onChange={(e) => setSelectedAttackMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Attack Methods</option>
            {attackMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {filteredTestCases.length} of {testCases.length} test cases
          </span>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600">
              Pass: {filteredTestCases.filter(tc => tc.score === 1.0).length}
            </span>
            <span className="text-red-600">
              Fail: {filteredTestCases.filter(tc => tc.score === 0.0).length}
            </span>
            <span className="text-yellow-600">
              Error: {filteredTestCases.filter(tc => tc.error).length}
            </span>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Tip:</strong> Click on any test case header to expand and view detailed information including the input prompt, AI response, and assessment reasoning.
        </p>
      </div>
      <div className="space-y-4">
        {filteredTestCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Test Case Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center space-x-4">
                {expandedCases.has(index) ? 
                  <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                }
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testCase.score, testCase.error)}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {testCase.vulnerability}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type:</span>
                        <span className="text-gray-700">{testCase.vulnerability_type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attack:</span>
                        <span className="group relative inline-block text-gray-700">
                          {testCase.attackMethod}
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-white text-gray-800 text-xs rounded border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-xs z-10">
                            Attack technique used to test this vulnerability
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk:</span>
                        <span className="group relative inline-block text-gray-700">
                          {testCase.riskCategory}
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-white text-gray-800 text-xs rounded border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-xs z-10">
                            Broad risk classification for this test
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(testCase.score, testCase.error)}`}>
                  {getStatusText(testCase.score, testCase.error)}
                </span>
                <span className="text-sm text-gray-500">
                  Score: {testCase.score.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCases.has(index) && (
              <div className="p-4 bg-white border-t border-gray-200">
                {/* Test Case Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Test Case Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Vulnerability</div>
                      <div className="text-sm font-semibold text-gray-900">{testCase.vulnerability}</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Vulnerability Type</div>
                      <div className="text-sm font-semibold text-gray-900">{testCase.vulnerability_type}</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Risk Category</div>
                      <div className="text-sm font-semibold text-gray-900">{testCase.riskCategory}</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Attack Method</div>
                      <div className="text-sm font-semibold text-gray-900">{testCase.attackMethod}</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Score</div>
                      <div className={`text-lg font-bold ${testCase.score === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {testCase.score}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Status</div>
                      <div className={`px-3 py-1 text-sm font-bold rounded-full ${testCase.score === 1 ? 'status-pass' : 'status-fail'}`}>
                        {testCase.score === 1 ? 'PASS' : 'FAIL'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Input Prompt</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Info className="h-3 w-3" />
                          <span>The attack/input used to test the AI</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testCase.input}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">AI Response</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Info className="h-3 w-3" />
                          <span>How the AI model responded to the attack</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testCase.actualOutput}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Assessment Reason</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Info className="h-3 w-3" />
                          <span>Why this test passed or failed</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{testCase.reason}</p>
                      </div>
                    </div>

                    {testCase.error && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Error Details</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Info className="h-3 w-3" />
                            <span>Technical issues that prevented test completion</span>
                          </div>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">{testCase.error}</p>
                        </div>
                      </div>
                    )}

                    {testCase.metadata && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Metadata</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Info className="h-3 w-3" />
                            <span>Additional context and test configuration details</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(testCase.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTestCases.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test cases found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestCasesViewer;
