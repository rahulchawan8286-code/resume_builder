import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { mockCodingProblems } from '../../mocks';

export default function CodingDashboard() {
  const columns = [
    { header: 'Status', accessorKey: 'status', cell: () => <span className="text-gray-400">-</span> },
    { header: 'Title', accessorKey: 'title', cell: (row) => <Link to={`/coding/problem/${row.id}`} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{row.title}</Link> },
    { header: 'Acceptance', accessorKey: 'acceptance' },
    { header: 'Difficulty', accessorKey: 'difficulty', cell: (row) => (
      <span className={`${row.difficulty === 'Easy' ? 'text-emerald-500' : row.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>
        {row.difficulty}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Coding Practice</h1>
        <p className="text-gray-500 dark:text-gray-400">Enhance your algorithmic and data structure skills.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Set</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockCodingProblems} />
        </CardContent>
      </Card>
    </div>
  );
}