import { useResumeStore } from '../../store/resumeStore';
import SortableList from './SortableList';
import { GraduationCap, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

function EducationFields({ item }) {
  const updateItem = useResumeStore((s) => s.updateItem);

  const handleChange = (field, value) =>
    updateItem('education', item.id, { [field]: value });

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Degree / Course', field: 'degree', placeholder: 'B.Tech Computer Science', span: 2 },
        { label: 'Institution', field: 'institution', placeholder: 'IIT Bombay', span: 2 },
        { label: 'Start Year', field: 'startYear', placeholder: '2020' },
        { label: 'End Year', field: 'endYear', placeholder: '2024' },
        { label: 'CGPA / Percentage', field: 'grade', placeholder: '8.5 / 10' },
        { label: 'Location', field: 'location', placeholder: 'Mumbai, India' },
      ].map(({ label, field, placeholder, span }) => (
        <div key={field} className={span === 2 ? 'col-span-2' : ''}>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
          <input
            value={item[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

export default function EducationForm() {
  const education = useResumeStore((s) => s.resumeData.education);
  const addItem = useResumeStore((s) => s.addItem);
  const deleteItem = useResumeStore((s) => s.deleteItem);
  const reorderItems = useResumeStore((s) => s.reorderItems);

  const add = () =>
    addItem('education', { id: nanoid(), degree: '', institution: '', startYear: '', endYear: '', grade: '', location: '' });

  const reorder = (newList) => {
    // Directly replace to avoid double-processing
    useResumeStore.setState((s) => ({
      resumeData: { ...s.resumeData, education: newList },
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" /> Education
        </h2>
        <button onClick={add} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {education.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No education entries yet. Click <strong>Add</strong> to create one.
        </p>
      )}

      <SortableList
        items={education}
        onReorder={reorder}
        onDelete={(id) => deleteItem('education', id)}
        getTitle={(item) => item.degree || 'Education Entry'}
        renderItem={(item) => <EducationFields item={item} />}
      />
    </div>
  );
}
