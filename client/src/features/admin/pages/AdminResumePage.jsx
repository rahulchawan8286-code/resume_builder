import { useState } from 'react';
import { mockAdminResumes } from '../data/mockAdminData';
import { Search, Trash2, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminResumePage() {
  const [resumes, setResumes] = useState(mockAdminResumes);
  const [search, setSearch] = useState('');

  const deleteResume = (id) => {
    if (window.confirm('Delete this resume permanently? Admin actions are logged.')) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted successfully');
    }
  };

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resume Audit Console</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage and inspect all documents across the platform.</p>
      </div>

      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by resume title or owner..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Template</th>
              <th className="px-6 py-4">ATS Score</th>
              <th className="px-6 py-4">Downloads</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filtered.map((resume) => (
              <tr key={resume.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold">{resume.title}</td>
                <td className="px-6 py-4">{resume.user}</td>
                <td className="px-6 py-4">{resume.template}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-primary">{resume.score}/100</span>
                </td>
                <td className="px-6 py-4">{resume.downloads}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Download metadata">
                    <Download className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteResume(resume.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete Resume">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No documents found.</p>
        )}
      </div>
    </div>
  );
}
