import { useState } from 'react';
import { mockAdminTemplates } from '../data/mockAdminData';
import { Plus, Trash2, Eye, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(mockAdminTemplates);

  const togglePublish = (id) => {
    setTemplates((prev) => prev.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'published' ? 'draft' : 'published';
        toast.success(`Template status updated to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTemplate = (id) => {
    if (window.confirm('Delete this template?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success('Template deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Engine Manager</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Add, preview, or publish resume document templates.</p>
        </div>
        <button onClick={() => toast('Upload template module coming soon', { icon: '🔜' })} className="flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-white hover:bg-destructive/95 transition-all">
          <Plus className="h-4 w-4" /> Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-destructive/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                template.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
              }`}>
                {template.status}
              </span>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-4">
              <span>Active uses</span>
              <span className="font-bold text-foreground">{template.uses.toLocaleString()} times</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => togglePublish(template.id)}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold hover:bg-muted transition-colors ${
                  template.status === 'published' ? 'text-yellow-600 border-yellow-500/30' : 'text-green-600 border-green-500/30'
                }`}
              >
                {template.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="rounded-lg border border-border p-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
