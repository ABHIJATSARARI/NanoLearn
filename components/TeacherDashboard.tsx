import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { LessonHistoryItem } from '../types';

interface TeacherDashboardProps {
  history: LessonHistoryItem[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ history }) => {
  // Process real data
  const chartData = history.map(item => ({
    name: item.topic.length > 15 ? item.topic.substring(0, 12) + '...' : item.topic,
    fullName: item.topic,
    score: Math.round((item.score / item.maxScore) * 100)
  }));

  // Calculate aggregate stats
  const avgMastery = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length) 
    : 0;

  const strugglingCount = chartData.filter(d => d.score < 60).length;

  // Generate action items based on real low scores
  const actionItems = history.filter(h => (h.score / h.maxScore) < 0.6).slice(0, 3);

  return (
    <div className="h-full flex flex-col pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Class Insights</h1>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-full">
          <Users size={20} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase mb-1">Avg Mastery</div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                {avgMastery}% <TrendingUp size={16} className={`${avgMastery >= 70 ? 'text-green-500' : 'text-orange-500'} ml-2`} />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase mb-1">Struggling</div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                {strugglingCount} <Users size={16} className="text-slate-400 dark:text-slate-500 ml-2" />
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 h-[320px] transition-colors">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Student Performance</h3>
        {chartData.length > 0 ? (
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="score" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 60 ? '#f87171' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <BookOpen size={48} className="mb-2 opacity-20" />
            <p className="text-sm">No quiz data available yet.</p>
          </div>
        )}
      </div>

      {/* Action Items */}
      <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Suggested Actions</h3>
      <div className="space-y-3">
        {actionItems.length > 0 ? (
          actionItems.map((item, idx) => (
            <div key={idx} className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 rounded-2xl flex items-start">
                <AlertTriangle className="text-red-500 dark:text-red-400 mr-3 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-red-800 dark:text-red-200">Review {item.topic}</h4>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                       Score: {Math.round((item.score / item.maxScore) * 100)}%. Consider assigning a remedial micro-lesson.
                    </p>
                </div>
            </div>
          ))
        ) : (
           <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 p-4 rounded-2xl flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
                <TrendingUp size={16} className="text-green-600 dark:text-green-300" />
              </div>
              <div>
                 <h4 className="font-bold text-green-800 dark:text-green-200">All Caught Up!</h4>
                 <p className="text-xs text-green-600 dark:text-green-300 mt-1">Class performance is stable.</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};