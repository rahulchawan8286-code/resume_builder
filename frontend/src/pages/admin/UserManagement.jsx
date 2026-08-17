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