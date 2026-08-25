import { useState } from 'react';
import { mockAdminUsers } from '../data/mockAdminData';
import { Search, Ban, CheckCircle2, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUserPage() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState('');

  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        toast.success(`User status updated to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user permanently?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('User deleted permanently');
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Control access credentials and accounts.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users name or email..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Resumes</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    user.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{user.resumes}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    title={user.status === 'active' ? 'Suspend' : 'Activate'}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {user.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    title="Delete User"
                    className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No users found.</p>
        )}
      </div>
    </div>
  );
}
