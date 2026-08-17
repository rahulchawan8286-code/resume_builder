import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useCodingStore } from '../../store/codingStore';
import { Search, Loader2 } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';

export default function CodingDashboard() {
  const { problems, progress, filters, setFilters, fetchProblems, fetchProgress, isLoading, error } = useCodingStore();

  useEffect(() => {
    fetchProblems();
    fetchProgress();
  }, [fetchProblems, fetchProgress]);

  const handleSearchChange = (e) => setFilters({ search: e.target.value });
  const handleDifficultyChange = (e) => setFilters({ difficulty: e.target.value });
  const handleTopicChange = (e) => setFilters({ topic: e.target.value });

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: (row) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          row.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
          row.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {row.status === 'Accepted' ? 'Solved' : row.status === 'Pending' ? 'Submitted' : 'Unsolved'}
        </span>
      )
    },
    { header: 'Title', accessorKey: 'title', cell: (row) => <Link to={`/coding/problem/${row._id}`} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{row.title}</Link> },
    { header: 'Topics', accessorKey: 'tags', cell: (row) => <div className="flex gap-1 flex-wrap">{row.tags?.map(t => <span key={t} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">{t}</span>)}</div> },
    { header: 'Difficulty', accessorKey: 'difficulty', cell: (row) => (
      <span className={`${row.difficulty === 'Easy' ? 'text-emerald-500' : row.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>
        {row.difficulty}
      </span>
    )},
  ];

  if (error && !problems.length) {
    return <ErrorState message={error} onRetry={() => { fetchProblems(); fetchProgress(); }} />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Coding Practice</h1>
          <p className="text-gray-500 dark:text-gray-400">Enhance your algorithmic and data structure skills.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/coding/history" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Submission History
          </Link>
        </div>
      </div>

      {/* Progress Summary */}
      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 flex flex-col justify-center items-center">
            <span className="text-sm text-gray-500">Attempted</span>
            <span className="text-2xl font-bold">{progress.attempted}</span>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center border-emerald-100 dark:border-emerald-900/30">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Solved</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{progress.solved}</span>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center border-amber-100 dark:border-amber-900/30">
            <span className="text-sm text-amber-600 dark:text-amber-400">Medium</span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{progress.mediumSolved}</span>
          </Card>
          <Card className="p-4 flex flex-col justify-center items-center border-red-100 dark:border-red-900/30">
            <span className="text-sm text-red-600 dark:text-red-400">Hard</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{progress.hardSolved}</span>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <select 
            value={filters.difficulty} 
            onChange={handleDifficultyChange}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent outline-none dark:text-white"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select 
            value={filters.topic} 
            onChange={handleTopicChange}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent outline-none dark:text-white"
          >
            <option value="">All Topics</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Hash Table">Hash Table</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Sorting">Sorting</option>
            <option value="Stacks">Stacks</option>
            <option value="Recursion">Recursion</option>
          </select>
        </CardContent>
      </Card>

      {/* Problem Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading && !problems.length ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <DataTable columns={columns} data={filteredProblems} emptyMessage="No problems found." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}