import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Mon', score: 65, hours: 2 },
  { name: 'Tue', score: 70, hours: 3 },
  { name: 'Wed', score: 68, hours: 2.5 },
  { name: 'Thu', score: 85, hours: 4 },
  { name: 'Fri', score: 82, hours: 3 },
  { name: 'Sat', score: 90, hours: 5 },
  { name: 'Sun', score: 95, hours: 6 },
];

export const WeeklyProgressChart = memo(() => {
  return (
    <Card className="h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" />
          Weekly Analytics
        </h2>
        <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm rounded-lg py-1 px-3 text-gray-600 dark:text-gray-300">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: 'white' }}
              cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3'}}
            />
            <Line type="monotone" name="Score" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            <Line type="monotone" name="Study Hours" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
WeeklyProgressChart.displayName = 'WeeklyProgressChart';