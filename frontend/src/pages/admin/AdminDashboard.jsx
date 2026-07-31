import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { mockAdminStats } from '../../mocks';
import { Users, FileText, Bot, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const stats = mockAdminStats;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Platform overview and statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><Users /></div>
            <div><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold dark:text-white">{stats.totalUsers}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><Activity /></div>
            <div><p className="text-sm text-gray-500">Active Users</p><p className="text-2xl font-bold dark:text-white">{stats.activeUsers}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg"><FileText /></div>
            <div><p className="text-sm text-gray-500">Tests Taken</p><p className="text-2xl font-bold dark:text-white">{stats.totalTests}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Bot /></div>
            <div><p className="text-sm text-gray-500">AI Tokens Used</p><p className="text-2xl font-bold dark:text-white">{stats.aiUsage}</p></div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <span className="font-medium dark:text-white">API Server Status</span>
            <span className="text-emerald-500 font-bold">{stats.systemHealth}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}