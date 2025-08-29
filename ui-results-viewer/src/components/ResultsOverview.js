import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, Info } from 'lucide-react';

const ResultsOverview = ({ data }) => {
  const { vulnerability_type_results, attack_method_results, errored } = data;

  // Helper function to create tooltip content
  const createTooltip = (title, description, details = []) => (
    <div className="max-w-xs">
      <div className="font-medium text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-600 mb-2">{description}</div>
      {details.length > 0 && (
        <div className="text-xs text-gray-500">
          {details.map((detail, index) => (
            <div key={index} className="mb-1">• {detail}</div>
          ))}
        </div>
      )}
    </div>
  );

  // Calculate overall statistics
  const totalTests = vulnerability_type_results.reduce((sum, item) => sum + item.passing + item.failing + item.errored, 0);
  const totalPassing = vulnerability_type_results.reduce((sum, item) => sum + item.passing, 0);
  const totalFailing = vulnerability_type_results.reduce((sum, item) => sum + item.failing, 0);
  const totalErrored = vulnerability_type_results.reduce((sum, item) => sum + item.errored, 0) + errored;
  const overallPassRate = totalTests > 0 ? (totalPassing / totalTests * 100).toFixed(1) : 0;

  // Prepare data for charts
  const vulnerabilityData = vulnerability_type_results.map(item => ({
    name: `${item.vulnerability} - ${item.vulnerability_type}`,
    passing: item.passing,
    failing: item.failing,
    errored: item.errored,
    passRate: (item.pass_rate * 100).toFixed(1)
  }));

  const attackMethodData = attack_method_results.map(item => ({
    name: item.attack_method,
    passing: item.passing,
    failing: item.failing,
    errored: item.errored,
    passRate: (item.pass_rate * 100).toFixed(1)
  }));

  const pieData = [
    { name: 'Passing', value: totalPassing, color: '#22c55e' },
    { name: 'Failing', value: totalFailing, color: '#ef4444' },
    { name: 'Errored', value: totalErrored, color: '#f59e0b' }
  ];

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card group relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
            </div>
            <div className="ml-auto">
              <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
            {createTooltip(
              "Total Tests",
              "The complete count of all security tests performed",
              [
                "Includes passing, failing, and errored tests",
                "Represents the total scope of security assessment"
              ]
            )}
          </div>
        </div>

        <div className="card group relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Passing</p>
              <p className="text-2xl font-bold text-green-600">{totalPassing}</p>
            </div>
            <div className="ml-auto">
              <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
            {createTooltip(
              "Passing Tests",
              "Tests where the AI successfully resisted security attacks",
              [
                "Score = 1.0: AI maintained security",
                "Higher numbers indicate better security posture",
                "These represent successful security measures"
              ]
            )}
          </div>
        </div>

        <div className="card group relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Failing</p>
              <p className="text-2xl font-bold text-red-600">{totalFailing}</p>
            </div>
            <div className="ml-auto">
              <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
            {createTooltip(
              "Failing Tests",
              "Tests where the AI was vulnerable to security attacks",
              [
                "Score = 0.0: AI failed security test",
                "Lower numbers indicate better security",
                "These require immediate attention and fixes"
              ]
            )}
          </div>
        </div>

        <div className="card group relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-yellow-600">{overallPassRate}%</p>
            </div>
            <div className="ml-auto">
              <Info className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
            {createTooltip(
              "Overall Pass Rate",
              "Percentage of all tests that passed security requirements",
              [
                "80%+ = Good security posture",
                "60-79% = Needs attention",
                "Below 60% = Requires immediate action"
              ]
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Results Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Test Results</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>Shows distribution of all test outcomes</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vulnerability Type Results */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vulnerability Type Results</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>Performance by vulnerability category</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnerabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passing" fill="#22c55e" name="Passing" />
              <Bar dataKey="failing" fill="#ef4444" name="Failing" />
              <Bar dataKey="errored" fill="#f59e0b" name="Errored" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Type Details */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vulnerability Type Breakdown</h3>
            <p className="text-sm text-gray-600">
              Detailed results for each vulnerability type. Higher pass rates indicate better security against specific attack vectors.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vulnerability</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vulnerabilityData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm text-gray-900">{item.name.split(' - ')[0]}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">{item.name.split(' - ')[1]}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parseFloat(item.passRate) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(item.passRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.passRate}%
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      <span className="text-green-600">{item.passing}P</span>
                      <span className="text-red-600 ml-2">{item.failing}F</span>
                      {item.errored > 0 && <span className="text-red-600 ml-2">{item.errored}E</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attack Method Details */}
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attack Method Breakdown</h3>
            <p className="text-sm text-gray-600">
              Results grouped by attack technique. This shows how well your AI resists different types of adversarial inputs.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attack Method</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attackMethodData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parseFloat(item.passRate) >= 80 ? 'bg-green-100 text-green-800' :
                        parseFloat(item.passRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.passRate}%
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      <span className="text-green-600">{item.passing}P</span>
                      <span className="text-red-600 ml-2">{item.failing}F</span>
                      {item.errored > 0 && <span className="text-yellow-600 ml-2">{item.errored}E</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverview;
