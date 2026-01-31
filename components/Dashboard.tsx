import React, { useState, useEffect } from 'react';
import { ScanService } from '../services/mockDatabase';
import { Scan, Classification } from '../types';
import { Activity, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filter, setFilter] = useState<'All' | 'Bacterial' | 'Viral' | 'Flagged'>('All');

  useEffect(() => {
    setScans(ScanService.getAll());
  }, []);

  const totalScans = scans.length;
  const flaggedCases = scans.filter(s => s.result.isFlaggedFalseNegative).length;
  const bacterialCases = scans.filter(s => s.result.classification === Classification.Bacterial).length;
  const viralCases = scans.filter(s => s.result.classification === Classification.Viral).length;
  const normalCases = scans.filter(s => s.result.classification === Classification.Normal).length;

  const filteredScans = scans.filter(s => {
    if (filter === 'All') return true;
    if (filter === 'Flagged') return s.result.isFlaggedFalseNegative;
    return s.result.classification === filter;
  });

  const chartData = [
    { name: 'Normal', value: normalCases, color: '#22c55e' },
    { name: 'Bacterial', value: bacterialCases, color: '#f97316' },
    { name: 'Viral', value: viralCases, color: '#eab308' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Scans</p>
            <p className="text-3xl font-bold text-slate-800">{totalScans}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Flagged Cases</p>
            <p className="text-3xl font-bold text-red-600">{flaggedCases}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Bacterial</p>
            <p className="text-3xl font-bold text-orange-500">{bacterialCases}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 rounded-full">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Viral</p>
            <p className="text-3xl font-bold text-yellow-500">{viralCases}</p>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-500 rounded-full">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-800">Recent Scans</h2>
             <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
               {(['All', 'Bacterial', 'Viral', 'Flagged'] as const).map((f) => (
                 <button
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                     filter === f 
                       ? 'bg-white text-slate-800 shadow-sm' 
                       : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   {f}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Classification</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredScans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No scans found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{scan.patientName}</div>
                        <div className="text-xs text-slate-500">ID: {scan.patientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(scan.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                           scan.result.classification === Classification.Normal 
                             ? 'bg-green-100 text-green-800' 
                             : scan.result.classification === Classification.Bacterial 
                               ? 'bg-orange-100 text-orange-800' 
                               : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {scan.result.classification}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {(scan.result.confidenceScore * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {scan.result.isFlaggedFalseNegative ? (
                          <div className="flex items-center text-red-600 space-x-1" title="Potential False Negative">
                             <AlertTriangle className="w-4 h-4" />
                             <span className="text-xs font-bold">FLAGGED</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400 space-x-1">
                             <CheckCircle className="w-4 h-4" />
                             <span className="text-xs">Verified</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Column */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Case Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-500">
            <p><strong>Insight:</strong> Bacterial pneumonia cases are currently trending slightly higher than seasonal averages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;