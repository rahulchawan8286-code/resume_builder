import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useCodingStore } from '../../store/codingStore';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ErrorState } from '../../components/ui/ErrorState';

export default function SubmissionHistory() {
  const { history, fetchHistory, isLoading, error } = useCodingStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const columns = [
    { header: 'Time Submitted', accessorKey: 'createdAt', cell: (row) => new Date(row.createdAt).toLocaleString() },
    { header: 'Problem', accessorKey: 'problem', cell: (row) => <Link to={`/coding/problem/${row.problem?._id}`} className="hover:text-indigo-600 transition-colors">{row.problem?.title || 'Unknown'}</Link> },
    { header: 'Status', accessorKey: 'status', cell: (row) => (
      <span className={`font-medium ${
        row.status === 'Accepted' ? 'text-emerald-500' : 
        row.status === 'Pending' ? 'text-blue-500' : 'text-red-500'
      }`}>
        {row.status === 'Pending' ? 'Submitted (Unverified)' : row.status}
      </span>
    )},
    { header: 'Language', accessorKey: 'language', cell: (row) => <span className="capitalize">{row.language}</span> }
  ];

  if (error && !history.length) {
    return <ErrorState message={error} onRetry={fetchHistory} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild className="p-0 hover:bg-transparent"><Link to="/coding"><ChevronLeft size={20} /> Back to Problems</Link></Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Submission History</h1>
        <p className="text-gray-500 dark:text-gray-400">Review your past code submissions and results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !history.length ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <DataTable columns={columns} data={history} emptyMessage="No submissions yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}