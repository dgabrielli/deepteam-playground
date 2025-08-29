import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, Filter, FileText, Shield, Zap } from 'lucide-react';

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
    if (error) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    if (score === 1.0) return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusClass = (score, error) => {
    if (error) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (score === 1.0) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getStatusText = (score, error) => {
    if (error) return 'Error';
    if (score === 1.0) return 'Pass';
    return 'Fail';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Test Case Analysis</h2>
            <p className="text-slate-600">Detailed examination of individual security test results</p>
          </div>
        </div>
        <p className="text-slate-600">
          Browse individual test cases to understand specific vulnerabilities and AI responses. 
          Use filters to focus on areas of concern or specific attack methods.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-slate-500" />
          <h3 className="text-lg font-semibold text-slate-900">Search & Filter</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          <strong>Search:</strong> Find specific test cases by content. <strong>Filters:</strong> Narrow down results by vulnerability type, attack method, or test status.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Vulnerability Filter */}
          <div>
            <select
              value={selectedVulnerability}
              onChange={(e) => setSelectedVulnerability(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
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
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
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
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Statuses</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-8 p-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Showing {filteredTestCases.length} of {testCases.length} test cases
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-700 font-medium">
                Pass: {filteredTestCases.filter(tc => tc.score === 1.0).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 font-medium">
                Fail: {filteredTestCases.filter(tc => tc.score === 0.0).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-amber-700 font-medium">
                Error: {filteredTestCases.filter(tc => tc.error).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-4 w-4 text-slate-500" />
          <p className="text-sm text-slate-600">
            <strong>Tip:</strong> Click on any test case header to expand and view detailed information including the input prompt, AI response, and assessment reasoning.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTestCases.map((testCase, index) => (
          <div key={index} className="border-2 border-slate-200/60 rounded-2xl overflow-hidden hover:border-slate-300/60 transition-all duration-200">
            {/* Test Case Header */}
            <div 
              className="flex items-center justify-between p-6 bg-slate-50/80 backdrop-blur-sm cursor-pointer hover:bg-slate-100/80 transition-all duration-200"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  {expandedCases.has(index) ? 
                    <ChevronDown className="h-5 w-5 text-slate-500" /> : 
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  }
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(testCase.score, testCase.error)}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {testCase.vulnerability}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type:</span>
                        <span className="text-slate-700 font-medium">{testCase.vulnerability_type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attack:</span>
                        <span className="group relative inline-block text-slate-700 font-medium">
                          {testCase.attackMethod}
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-slate-800 text-xs rounded-xl border border-slate-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-xs z-[60]">
                            Attack technique used to test this vulnerability
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk:</span>
                        <span className="group relative inline-block text-slate-700 font-medium">
                          {testCase.riskCategory}
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-slate-800 text-xs rounded-xl border border-slate-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-xs z-[60]">
                            Broad risk classification for this test
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusClass(testCase.score, testCase.error)}`}>
                  {getStatusText(testCase.score, testCase.error)}
                </span>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Score</div>
                  <div className={`text-lg font-bold ${testCase.score === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {testCase.score.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCases.has(index) && (
              <div className="p-6 bg-white border-t border-slate-200/60">
                {/* Test Case Summary */}
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 mb-8">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Test Case Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Vulnerability</div>
                      <div className="text-sm font-semibold text-slate-900">{testCase.vulnerability}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Vulnerability Type</div>
                      <div className="text-sm font-semibold text-slate-900">{testCase.vulnerability_type}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Risk Category</div>
                      <div className="text-sm font-semibold text-slate-900">{testCase.riskCategory}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Attack Method</div>
                      <div className="text-sm font-semibold text-slate-900">{testCase.attackMethod}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Score</div>
                      <div className={`text-xl font-bold ${testCase.score === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {testCase.score}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Status</div>
                      <div className={`px-3 py-1 text-sm font-bold rounded-full ${testCase.score === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {testCase.score === 1 ? 'PASS' : 'FAIL'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-slate-900 mb-2">Input Prompt</h4>
                        <p className="text-sm text-slate-600">The attack/input used to test the AI</p>
                      </div>
                      <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60">
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{testCase.input}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-slate-900 mb-2">AI Response</h4>
                        <p className="text-sm text-slate-600">How the AI model responded to the attack</p>
                      </div>
                      <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60">
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{testCase.actualOutput}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-slate-900 mb-2">Assessment Reason</h4>
                        <p className="text-sm text-slate-600">Why this test passed or failed</p>
                      </div>
                      <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60">
                        <p className="text-sm text-slate-700">{testCase.reason}</p>
                      </div>
                    </div>

                    {testCase.error && (
                      <div>
                        <div className="mb-3">
                          <h4 className="font-semibold text-slate-900 mb-2">Error Details</h4>
                          <p className="text-sm text-slate-600">Technical issues that prevented test completion</p>
                        </div>
                        <div className="p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl">
                          <p className="text-sm text-amber-700">{testCase.error}</p>
                        </div>
                      </div>
                    )}

                    {testCase.metadata && (
                      <div>
                        <div className="mb-3">
                          <h4 className="font-semibold text-slate-900 mb-2">Metadata</h4>
                          <p className="text-sm text-slate-600">Additional context and test configuration details</p>
                        </div>
                        <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60">
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
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
        <div className="text-center py-16">
          <Search className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h3 className="text-xl font-semibold text-slate-900 mb-3">No test cases found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for. 
            You can also try clearing all filters to see all available test cases.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestCasesViewer;
