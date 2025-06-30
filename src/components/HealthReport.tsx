import React, { useState } from 'react';
import { FileText, Calendar, Activity, Camera, User, TrendingUp, AlertCircle } from 'lucide-react';
import { mockHealthRecords } from '../utils/healthData';

const HealthReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getFilteredRecords = () => {
    return mockHealthRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'symptom': return <Activity className="h-5 w-5 text-blue-600" />;
      case 'pulse': return <TrendingUp className="h-5 w-5 text-red-600" />;
      case 'image': return <Camera className="h-5 w-5 text-purple-600" />;
      case 'doctor': return <User className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecordSummary = (record: any) => {
    switch (record.type) {
      case 'symptom':
        return `Checked symptoms: ${record.data.symptoms.join(', ')}`;
      case 'pulse':
        return `Pulse rate: ${record.data.rate} BPM (${record.data.status})`;
      case 'image':
        return `Image analysis: ${record.data.condition || 'Medical scan uploaded'}`;
      case 'doctor':
        return `Consulted: ${record.data.name} (${record.data.specialization})`;
      default:
        return 'Health activity recorded';
    }
  };

  const filteredRecords = getFilteredRecords();

  // Generate summary statistics
  const symptomsCount = filteredRecords.filter(r => r.type === 'symptom').length;
  const pulseCount = filteredRecords.filter(r => r.type === 'pulse').length;
  const imageCount = filteredRecords.filter(r => r.type === 'image').length;
  const doctorCount = filteredRecords.filter(r => r.type === 'doctor').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FileText className="mr-3" />
            Health Report Dashboard
          </h2>
          <p className="text-indigo-100 mt-2">
            Track your health journey and medical activities
          </p>
        </div>

        <div className="p-6">
          {/* Date Filter */}
          <div className="mb-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Select Report Period
            </h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Symptom Checks</p>
                  <p className="text-2xl font-bold text-blue-900">{symptomsCount}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Pulse Readings</p>
                  <p className="text-2xl font-bold text-red-900">{pulseCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Image Scans</p>
                  <p className="text-2xl font-bold text-purple-900">{imageCount}</p>
                </div>
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Doctor Visits</p>
                  <p className="text-2xl font-bold text-green-900">{doctorCount}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Health Activity Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Health Activity Timeline - {months[selectedMonth]} {selectedYear}
            </h3>
            
            {filteredRecords.length > 0 ? (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getRecordIcon(record.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {record.type} Activity
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {getRecordSummary(record)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h4>
                <p className="text-gray-500">
                  No health activities recorded for {months[selectedMonth]} {selectedYear}.
                </p>
              </div>
            )}
          </div>

          {/* Health Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recent Trends</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Most active health monitoring this month</li>
                  <li>• Regular pulse rate monitoring detected</li>
                  <li>• Proactive symptom checking observed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Continue regular health monitoring</li>
                  <li>• Schedule routine check-up if overdue</li>
                  <li>• Maintain consistent pulse tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReport;