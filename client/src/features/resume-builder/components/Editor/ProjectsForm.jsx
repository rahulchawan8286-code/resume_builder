import { useResumeStore } from '../../store/resumeStore';
import SortableList from './SortableList';
import { FolderGit2, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

function ProjectFields({ item }) {
  const updateItem = useResumeStore((s) => s.updateItem);
  const u = (field, val) => updateItem('projects', item.id, { [field]: val });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Project Name', field: 'name', placeholder: 'AI Resume Builder', span: 2 },
          { label: 'Tech Stack', field: 'techStack', placeholder: 'React, Node.js, MongoDB', span: 2 },
          { label: 'Live URL', field: 'liveUrl', placeholder: 'https://...' },
          { label: 'GitHub URL', field: 'githubUrl', placeholder: 'https://github.com/...' },
        ].map(({ label, field, placeholder, span }) => (
          <div key={field} className={span === 2 ? 'col-span-2' : ''}>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
            <input
              value={item[field] || ''}
              onChange={(e) => u(field, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
        <textarea
          rows={3}
          value={item.description || ''}
          onChange={(e) => u('description', e.target.value)}
          placeholder="Describe what you built, your role, and key outcomes..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
        />
      </div>
    </div>
  );
}

export default function ProjectsForm() {
  const projects  = useResumeStore((s) => s.resumeData.projects);
  const addItem   = useResumeStore((s) => s.addItem);
  const deleteItem = useResumeStore((s) => s.deleteItem);

  const add = () =>
    addItem('projects', { id: nanoid(), name: '', techStack: '', liveUrl: '', githubUrl: '', description: '' });

  const reorder = (newList) =>
    useResumeStore.setState((s) => ({ resumeData: { ...s.resumeData, projects: newList } }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <FolderGit2 className="h-4 w-4 text-primary" /> Projects
        </h2>
        <button onClick={add} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {projects.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No projects yet.
        </p>
      )}

      <SortableList
        items={projects}
        onReorder={reorder}
        onDelete={(id) => deleteItem('projects', id)}
        getTitle={(item) => item.name || 'Project'}
        renderItem={(item) => <ProjectFields item={item} />}
      />
    </div>
  );
}
