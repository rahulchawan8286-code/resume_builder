import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { mockSubmissions } from '../../mocks';

export default function SubmissionHistory() {
  const columns = [
    { header: 'Time Submitted', accessorKey: 'date', cell: (row) => new Date(row.date).toLocaleString() },
    { header: 'Problem', accessorKey: 'problemTitle' },
    { header: 'Status', accessorKey: 'status', cell: (row) => (
      <span className={`font-medium ${row.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
        {row.status}
      </span>
    )},
    { header: 'Runtime', accessorKey: 'runtime' },
    { header: 'Memory', accessorKey: 'memory' },
    { header: 'Language', accessorKey: 'language' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Submission History</h1>
        <p className="text-gray-500 dark:text-gray-400">Review your past code submissions and results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockSubmissions} />
        </CardContent>
      </Card>
    </div>
  );
}