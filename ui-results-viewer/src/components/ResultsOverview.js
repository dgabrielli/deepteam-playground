import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const ResultsOverview = ({ data }) => {
  const { vulnerability_type_results, attack_method_results, errored } = data;

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
    { name: 'Passing', value: totalPassing, color: '#10b981' },
    { name: 'Failing', value: totalFailing, color: '#ef4444' },
    { name: 'Errored', value: totalErrored, color: '#f59e0b' }
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  const getPassRateColor = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (numRate >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPassRateLabel = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 80) return 'Excellent';
    if (numRate >= 60) return 'Good';
    return 'Critical';
  };

  return (
    <div className="space-y-8">
      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Total Tests</p>
              <p className="text-3xl font-bold text-slate-900">{totalTests.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Security assessments performed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Passing</p>
              <p className="text-3xl font-bold text-emerald-600">{totalPassing.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">AI successfully resisted attacks</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-2xl">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Failing</p>
              <p className="text-3xl font-bold text-red-600">{totalFailing.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">AI was vulnerable to attacks</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <TrendingUp className="h-7 w-7 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">Pass Rate</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-slate-900">{overallPassRate}%</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPassRateColor(overallPassRate)}`}>
                  {getPassRateLabel(overallPassRate)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Overall security performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Results Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Overall Test Results</h3>
              <p className="text-slate-600">Distribution of all test outcomes</p>
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
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vulnerability Type Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Vulnerability Performance</h3>
              <p className="text-slate-600">Breakdown by vulnerability category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnerabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="passing" fill="#10b981" name="Passing" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failing" fill="#ef4444" name="Failing" radius={[4, 4, 0, 0]} />
              <Bar dataKey="errored" fill="#f59e0b" name="Errored" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vulnerability Type Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Vulnerability Breakdown</h3>
              <p className="text-slate-600">Detailed results by vulnerability type</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Vulnerability</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vulnerabilityData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">{item.name.split(' - ')[0]}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{item.name.split(' - ')[1]}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPassRateColor(item.passRate)}`}>
                        {item.passRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 font-medium">{item.passing}P</span>
                        <span className="text-red-600 font-medium">{item.failing}F</span>
                        {item.errored > 0 && <span className="text-amber-600 font-medium">{item.errored}E</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attack Method Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Attack Method Analysis</h3>
              <p className="text-slate-600">Results grouped by attack technique</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Attack Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attackMethodData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPassRateColor(item.passRate)}`}>
                        {item.passRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 font-medium">{item.passing}P</span>
                        <span className="text-red-600 font-medium">{item.failing}F</span>
                        {item.errored > 0 && <span className="text-amber-600 font-medium">{item.errored}E</span>}
                      </div>
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
