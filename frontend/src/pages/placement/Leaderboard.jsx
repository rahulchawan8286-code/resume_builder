import { DataTable } from '../../components/ui/DataTable';
import { mockLeaderboard } from '../../mocks';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/Avatar';

export default function Leaderboard() {
  const columns = [
    { header: 'Rank', accessorKey: 'rank', cell: (row) => <span className="font-bold text-lg dark:text-white">#{row.rank}</span> },
    { header: 'Student', accessorKey: 'name', cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar} />
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium dark:text-white">{row.name}</span>
      </div>
    )},
    { header: 'Score', accessorKey: 'score', cell: (row) => <span className="text-indigo-600 dark:text-indigo-400 font-bold">{row.score}</span> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">See how you stack up against your peers.</p>
      </div>
      <DataTable columns={columns} data={mockLeaderboard} />
    </div>
  );
}