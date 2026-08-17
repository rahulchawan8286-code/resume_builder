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