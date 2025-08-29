import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const TestCasesViewer = ({ testCases }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVulnerability, setSelectedVulnerability] = useState('all');
  const [selectedAttackMethod, setSelectedAttackMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedCases, setExpandedCases] = useState(new Set());
  const [showInputs, setShowInputs] = useState(false);

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Test Cases</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowInputs(!showInputs)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showInputs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showInputs ? 'Hide' : 'Show'} Inputs</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
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
                    <h3 className="font-medium text-gray-900">
                      {testCase.vulnerability} - {testCase.vulnerability_type}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testCase.attackMethod} • {testCase.riskCategory}
                    </p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {showInputs && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Input Prompt</h4>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testCase.input}</pre>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Response</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testCase.actualOutput}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Assessment Reason</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{testCase.reason}</p>
                      </div>
                    </div>

                    {testCase.error && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Error Details</h4>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">{testCase.error}</p>
                        </div>
                      </div>
                    )}

                    {testCase.metadata && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
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
