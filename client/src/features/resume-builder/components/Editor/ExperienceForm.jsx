import { useResumeStore } from '../../store/resumeStore';
import SortableList from './SortableList';
import { Briefcase, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

function ExperienceFields({ item }) {
  const updateItem = useResumeStore((s) => s.updateItem);
  const u = (field, val) => updateItem('experience', item.id, { [field]: val });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Job Title', field: 'title', placeholder: 'Software Engineer', span: 2 },
          { label: 'Company', field: 'company', placeholder: 'Google', span: 2 },
          { label: 'Start Date', field: 'startDate', placeholder: 'Jun 2022' },
          { label: 'End Date', field: 'endDate', placeholder: 'Present' },
          { label: 'Location', field: 'location', placeholder: 'Bangalore, India', span: 2 },
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
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Description / Achievements</label>
        <textarea
          rows={4}
          value={item.description || ''}
          onChange={(e) => u('description', e.target.value)}
          placeholder="• Led development of X feature that improved Y by Z%&#10;• Collaborated with cross-functional teams…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
        />
      </div>
    </div>
  );
}

export default function ExperienceForm() {
  const experience = useResumeStore((s) => s.resumeData.experience);
  const addItem   = useResumeStore((s) => s.addItem);
  const deleteItem = useResumeStore((s) => s.deleteItem);

  const add = () =>
    addItem('experience', { id: nanoid(), title: '', company: '', startDate: '', endDate: '', location: '', description: '' });

  const reorder = (newList) =>
    useResumeStore.setState((s) => ({ resumeData: { ...s.resumeData, experience: newList } }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" /> Work Experience
        </h2>
        <button onClick={add} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {experience.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No experience entries yet.
        </p>
      )}

      <SortableList
        items={experience}
        onReorder={reorder}
        onDelete={(id) => deleteItem('experience', id)}
        getTitle={(item) => item.title ? `${item.title} @ ${item.company}` : 'Experience Entry'}
        renderItem={(item) => <ExperienceFields item={item} />}
      />
    </div>
  );
}
