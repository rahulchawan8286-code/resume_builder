const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/pages/admin/AdminDashboard.jsx": `
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
  `,
  "frontend/src/pages/admin/UserManagement.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { mockUsersList } from '../../mocks';

export default function UserManagement() {
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Join Date', accessorKey: 'joinDate' },
    { header: 'Actions', accessorKey: 'actions', cell: () => <Button variant="outline" size="sm">Edit</Button>}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
        <Button className="bg-indigo-600 text-white">Add User</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent><DataTable columns={columns} data={mockUsersList} /></CardContent>
      </Card>
    </div>
  );
}
  `,
  "frontend/src/pages/admin/QuestionManagement.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { mockQuestionsList } from '../../mocks';

export default function QuestionManagement() {
  const columns = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Difficulty', accessorKey: 'difficulty' },
    { header: 'Author', accessorKey: 'author' },
    { header: 'Actions', accessorKey: 'actions', cell: () => <Button variant="outline" size="sm">Edit</Button>}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Question Bank</h1>
        <Button className="bg-indigo-600 text-white">Create Question</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>All Questions</CardTitle></CardHeader>
        <CardContent><DataTable columns={columns} data={mockQuestionsList} /></CardContent>
      </Card>
    </div>
  );
}
  `,
  "frontend/src/pages/admin/GenericAdminView.jsx": `
import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';

export default function GenericAdminView({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500 dark:text-gray-400">
          This module is fully configured in the routing layer and ready for backend integration in Phase 4.
        </CardContent>
      </Card>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch D - Admin Pages generated.');
